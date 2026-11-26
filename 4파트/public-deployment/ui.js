"use strict";
const $ = id => document.getElementById(id);
const mode = $("mode");
let searchConfig;
let map, mapFailed = false, pins = [], model, visible, active, addresses = [], addressKey, addressNotes = [];
const kst = new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",dateStyle:"short",timeStyle:"medium"});
function append(parent, tag, value, className) {
  const node = document.createElement(tag);
  if (value != null) node.textContent = value;
  if (className) node.className = className;
  parent.append(node);
  return node;
}
function link(parent, title, url) {
  try {
    if (new URL(url).protocol !== "https:") return;
  } catch { return; }
  const a = append(parent,"a",title);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
}
function status(message, error = false) {
  $("status").textContent = message;
  $("status").dataset.error = error;
}
async function request(name, data) {
  const response = await fetch("/api/"+name,data ? {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)} : {signal:AbortSignal.timeout(5000)});
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "서버 연결 오류");
  return result;
}
function showMapMessage(message, failed = false) {
  mapFailed = failed;
  $("mapMessage").textContent = message;
  $("mapMessage").hidden = false;
}
async function start() {
  try {
    showMapMessage("지도 설정을 확인하는 중입니다.");
    const config = searchConfig = await request("config");
    mode.value = config.live ? "live" : "demo";
    updateModeHelp();
    if (mode.value === "demo") fillDemo();
    if (!config.mapKey) {
      showMapMessage("네이버 지도 공개 키가 설정되지 않았습니다. 서버 .env의 NAVER_MAP_PUBLIC_KEY를 설정해 주세요. 데모 검색은 사용할 수 있습니다.");
      return;
    }
    showMapMessage("네이버 지도를 불러오는 중입니다.");
    const script = document.createElement("script");
    script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId="+encodeURIComponent(config.mapKey);
    const timeout = setTimeout(()=>showMapMessage("네이버 지도 로딩 시간 초과 · 네트워크를 확인하세요."),12000);
    window.navermap_authFailure = () => {
      clearTimeout(timeout);
      showMapMessage("네이버 지도 인증 오류 · 공개 키, Dynamic Map 및 허용 URL을 확인하세요.",true);
    };
    script.onerror = () => {
      clearTimeout(timeout);
      if (!mapFailed) showMapMessage("네이버 지도 로딩 실패 · 네트워크를 확인하세요.");
    };
    script.onload = () => {
      clearTimeout(timeout);
      if (mapFailed) return;
      try {
        map = new naver.maps.Map("map",{center:new naver.maps.LatLng(37.56359,126.975407),zoom:15,zoomControl:true});
        $("mapMessage").hidden = true;
        if (model) drawMap(model.work);
      } catch { showMapMessage("네이버 지도를 초기화하지 못했습니다."); }
    };
    document.head.append(script);
  } catch {
    $("modeHelp").textContent = "검색 서비스 연결 상태를 확인하지 못했습니다.";
    showMapMessage("서버에 연결할 수 없습니다. 페이지를 새로고침해 주세요.");
  }
}
function fillDemo() {
  if (!$("work").value) $("work").value = "서울시청";
  if (!$("menus").value) $("menus").value = "삼겹살, 회";
  if (!$("people").value) $("people").value = "12";
  status("데모 데이터 · 입력 예시로 검색할 수 있습니다.");
}
function addPin(point, kind, label, onClick, selected = false) {
  if (!map || mapFailed || !Number.isFinite(point.x) || !Number.isFinite(point.y) ||
      point.x < 124 || point.x > 132 || point.y < 32 || point.y > 40) return;
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.className = "pin "+kind+(selected ? " selected" : "");
  button.title = label;
  button.addEventListener("click",event=>{
    event.stopPropagation();
    if (onClick) onClick();
    else map.panTo(marker.getPosition());
  });
  const marker = new naver.maps.Marker({map,position:new naver.maps.LatLng(point.y,point.x),
    icon:{content:button,anchor:new naver.maps.Point(15,17)},zIndex:selected ? 100 : kind === "place" ? 50 : 20});
  
  pins.push(marker);
}
function drawMap(work, fit = true) {
  if (!map || mapFailed) return;
  pins.forEach(pin=>pin.setMap(null));
  pins = [];
  if (!work) return;
  addPin(work,"work","근무지");
  const stationId = active?.best.station.id;
  for (const station of model?.stations || []) {
    addPin(station,"station",station.name+" · "+station.services.join("·"),()=>{
      const row = [...model.recommended,...model.pending].find(r=>r.best.station.id === station.id);
      if (row) select(row,true);
      else map.panTo(new naver.maps.LatLng(station.y,station.x));
    },station.id === stationId);
  }
  for (const row of model ? [...model.recommended,...model.pending] : []) {
    addPin(row.place,"place",row.place.name,()=>select(row,true),active === row);
  }
  if (fit && pins.length === 1) {
    map.panTo(pins[0].getPosition());
    map.setZoom(15);
  } else if (fit && pins.length > 1) {
    const bounds = new naver.maps.LatLngBounds(pins[0].getPosition(),pins[0].getPosition());
    pins.forEach(pin=>bounds.extend(pin.getPosition()));
    map.fitBounds(bounds,48);
  }
}
function time(value) {
  if (value == null) return "확인 필요";
  const whole = Math.floor(value);
  return Math.floor(whole/60)+"분 "+whole%60+"초";
}
function select(row, fromMap) {
  active = row;
  const key = model.recommended.includes(row) ? "recommended" : "pending";
  if (fromMap && !visible.get(row)) render(new Set([key]));
  for (const [item,card] of visible) {
    card.classList.toggle("active",item === row);
    card.querySelector("button").setAttribute("aria-pressed",String(item === row));
  }
  if (fromMap) visible.get(row)?.scrollIntoView({block:"nearest",behavior:"smooth"});
  drawMap(model.work,false);
  if (map && !mapFailed && Number.isFinite(row.place.x) && row.place.x >= 124 && row.place.x <= 132 && row.place.y >= 32 && row.place.y <= 40) {
    const bounds = new naver.maps.LatLngBounds(new naver.maps.LatLng(row.place.y,row.place.x),
      new naver.maps.LatLng(row.place.y,row.place.x));
    bounds.extend(new naver.maps.LatLng(row.best.station.y,row.best.station.x));
    if (!map.getBounds().hasLatLng(new naver.maps.LatLng(row.place.y,row.place.x)) ||
        !map.getBounds().hasLatLng(new naver.maps.LatLng(row.best.station.y,row.best.station.x))) map.fitBounds(bounds,55);
  }
}
const expansions = new Set();
function render(expand = new Set()) {
  expand.forEach(key=>expansions.add(key));
  const root = $("results");
  root.replaceChildren();
  visible = new Map();
  if (!model) return;
  const {scope,issues,options} = model;
  const l = scope.limits;
  $("notice").textContent = (options.mode === "demo" ? "데모 데이터 · " : "실데이터 · ")+
    "등록 역 "+scope.catalog+"곳 · 직선 "+l.radius+"km 내 "+scope.inRadius+"곳 중 "+scope.stations+"곳 조회(유형별 "+l.perType+"곳) · "+
    "식당 지역 검색 "+scope.queries+"회, 검색어당 최대 "+l.perQuery+"곳 · 보행 "+scope.walks+"회(최대 "+l.walking+"회, 역·식당당 출입구 "+l.exits+"개)"+
    (scope.walkLimited || scope.exitLimited ? " · 일부 출입구 조회 한도 적용" : "");
  $("issues").hidden = !issues.length;
  $("issues").querySelector("ul").replaceChildren();
  issues.forEach(issue=>append($("issues").querySelector("ul"),"li",issue));
  for (const [key,title] of [["recommended","추천"],["pending","확인 필요"]]) {
    const rows = model[key], section = append(root,"section");
    append(section,"h3",title+" "+rows.length+"곳");
    if (!rows.length) append(section,"p",key === "recommended" ? "추천 기준을 충족한 곳이 없습니다." : "확인이 필요한 후보가 없습니다.","empty");
    for (const row of rows.slice(0,expansions.has(key) ? rows.length : 5)) {
      const {place,best} = row;
      const card = append(section,"article",null,"card"+(row === active ? " active" : ""));
      visible.set(row,card);
      const pick = append(card,"button",place.name);
      pick.type = "button";
      pick.setAttribute("aria-pressed",String(row === active));
      pick.onclick = ()=>select(row,false);
      append(card,"p",place.address);
      link(card,"네이버 지도",place.url);
      if (place.phone && options.mode !== "demo") {
        const phone = append(card,"a",place.phone);
        phone.href = "tel:"+place.phone.replace(/[^+\d]/g,"");
      }
      append(card,"p",best.station.name+" · "+best.station.services.join(" · "));
      append(card,"p","자동차 "+time(best.car)+(best.carAt ? " · "+(options.mode === "demo" ? "가상 교통" : "Ncloud Directions 5 조회 시점 교통")+" · "+kst.format(new Date(best.carAt))+" KST" : ""));
      append(card,"p","도보 "+time(best.walk)+" · "+(best.exit || "출입구 확인 필요")+" · "+best.walkingProvider+
        (best.partial && best.walk != null ? " · 조회된 출입구 기준" : ""));
      append(card,"p","메뉴 "+(row.matching.join(", ") || "확인 필요")+" · "+(row.capacity == null ? options.people+"명 단체석 전화 확인" : "동석 최대 "+row.capacity+"명"));
      append(card,"p",(options.date ? "영업 "+(row.open ? "시간표상 영업" : "확인 필요") : "일시 미입력")+" · 예약 가능 여부 "+(place.facts?.reservation === false ? "예약 미운영" : "매장 확인 필요"));
      append(card,"p","장소 출처 · "+place.source);
      if (options.mode === "demo") append(card,"p","메뉴·좌석 근거 · 데모 매장 안내");
      else for (const source of place.facts?.sources || []) link(card,"매장 근거",source);
      if (best.station.source) link(card,"역 출처"+(best.station.asOf ? " · "+best.station.asOf : ""),best.station.source);
      if (best.station.carAccess?.name) append(card,"p","차량 도착 지점 · "+best.station.carAccess.name);
      if (best.station.carAccess?.source) link(card,"차량 지점 출처",best.station.carAccess.source);
      const exitSource = best.station.exits?.find(e=>e.name === best.exit)?.source;
      if (exitSource) link(card,"출입구 출처",exitSource);
      if (row.missing.length) {
        append(card,"p",row.missing.join(" · "),"reason");
        const detail = append(card,"details");
        append(detail,"summary","전화 확인 문구");
        append(detail,"p",(options.date ? options.date.replace("T"," ")+"에 " : "")+
          options.people+"명이 함께 앉을 수 있나요? "+options.menus.join(" 또는 ")+" 주문이 가능한지와 단체 예약 가능 여부를 알려주세요.");
      }
    }
    if (rows.length > 5 && !expansions.has(key)) {
      const more = append(section,"button",title+" "+(rows.length-5)+"곳 더 보기","secondary");
      more.onclick = ()=>render(new Set([key]));
    }
  }
  $("copy").hidden = !model.recommended.length && !model.pending.length;
}
function reset() {
  addressKey = undefined;
  addresses = [];
  addressNotes = [];
  $("choices").hidden = true;
}
function updateModeHelp() {
  const available = searchConfig?.live;
  const state = mode.value === "demo" ?
    "데모 데이터는 가상의 식당과 이동 시간을 사용합니다. 서울시청 예시로 기능을 확인할 수 있습니다." :
    available ? "실데이터는 입력한 근무지를 네이버에서 찾고, 등록된 역과 실제 식당의 이동 시간을 조회합니다." :
      "실데이터는 네이버 주소·자동차·지역 검색 API를 연결한 뒤 사용할 수 있습니다.";
  $("modeHelp").textContent = state + (mode.value === "live" && available && !searchConfig.walking ?
    " TMAP 미설정으로 도보 시간이 필요한 후보는 확인 필요로 표시됩니다." : "");
}
mode.onchange = () => {
  reset();
  model = active = undefined;
  expansions.clear();
  $("results").replaceChildren();
  $("issues").hidden = $("copy").hidden = $("share").hidden = true;
  $("notice").textContent = "조건을 입력하면 추천 장소와 확인이 필요한 후보가 표시됩니다.";
  drawMap();
  updateModeHelp();
  if (mode.value === "demo") fillDemo();
  else status("");
};
$("work").addEventListener("input",reset);
$("copy").onclick = async () => {
  const summary = [model.options.mode === "demo" ? "데모 데이터" : "회식 후보",
    ...["recommended","pending"].flatMap(key=>model[key].map(({place,best,missing})=>[
      key === "recommended" ? "추천" : "확인 필요",place.name,best.station.name,"차량 "+time(best.car),
      "도보 "+time(best.walk),...missing,place.url].join(" · ")))].join("\n");
  try { await navigator.clipboard.writeText(summary); status("공유용 요약을 복사했습니다."); }
  catch { $("share").hidden = false; $("share").value = summary; $("share").select(); }
};
$("search").addEventListener("invalid",()=>status("입력 오류 · 필수 입력과 양의 정수 조건을 확인하세요.",true),true);
$("search").onsubmit = async event => {
  event.preventDefault();
  const options = {mode:mode.value,work:$("work").value.trim(),menus:$("menus").value.split(/[,，;\n]/).map(m=>m.trim()).filter(Boolean),
    people:Number($("people").value),selected:[...document.querySelectorAll("[name=station]:checked")].map(e=>e.value),
    date:$("date").value,budget:$("budget").value ? Number($("budget").value) : null,room:$("room").value,parking:$("parking").value};
  if (!options.work || !options.menus.length || options.menus.length > 4 || options.menus.some(m=>m.length>40 || !m.replace(/[\s\p{P}]/gu,"")) ||
      !Number.isSafeInteger(options.people) || options.people < 1 || !options.selected.length) {
    status("입력 오류 · 근무지, 메뉴(최대 4개·각 40자), 인원 및 선택한 역 유형을 확인하세요.",true);
    return;
  }
  if (options.mode === "live" && searchConfig?.live === false) {
    status("실데이터 검색을 하려면 서버에 네이버 주소·자동차·지역 검색 연결이 필요합니다.",true);
    return;
  }
  $("submit").disabled = mode.disabled = true;
  $("work").readOnly = true;
  $("results").replaceChildren();
  $("issues").hidden = $("copy").hidden = $("share").hidden = true;
  $("notice").textContent = "검색 중입니다.";
  model = active = undefined;
  expansions.clear();
  drawMap();
  try {
    if (addressKey !== options.work) {
      status("근무지 주소를 확인하는 중입니다.");
      const result = await request("address",options);
      addresses = result.rows;
      addressNotes = result.notes;
      const pick = $("address");
      pick.replaceChildren(new Option("주소를 선택하세요",""));
      addresses.forEach((a,i)=>pick.add(new Option([a.name,a.address].filter(Boolean).join(" · "),String(i))));
      $("choices").hidden = addresses.length < 2;
      if (addresses.length) addressKey = options.work;
    }
    if (!addresses.length) {
      status("근무지 검색 결과 없음"+(addressNotes.length ? " · 일부 조회 실패: "+addressNotes.join(" · ") : " · 주소 또는 지역명을 함께 입력하세요."),!!addressNotes.length);
      $("notice").textContent = "근무지 주소를 확인한 뒤 식당을 검색할 수 있습니다.";
      return;
    }
    if (addresses.length > 1 && !$("address").value) {
      status("근무지 주소를 선택한 뒤 장소 찾기를 눌러 주세요."+(addressNotes.length ? " · 일부 조회 실패: "+addressNotes.join(" · ") : ""));
      $("notice").textContent = "근무지 주소 선택을 기다리는 중입니다.";
      $("address").focus();
      return;
    }
    const address = addresses[addresses.length === 1 ? 0 : Number($("address").value)];
    drawMap(address);
    status("역과 식당의 자동차·보행 경로를 조회하는 중입니다.");
    model = {...await request("search",{...options,address}),options};
    model.issues.unshift(...addressNotes);
    render();
    drawMap(model.work);
    const count = model.recommended.length+model.pending.length;
    status((options.mode === "demo" ? "데모 데이터 · " : "")+(count ? "후보 "+count+"곳" : model.issues.length ? "조회된 후보 없음" : "검색 결과 없음")+
      (model.issues.length ? " · 일부 조회 실패 또는 정보 미확인" : ""));
  } catch (e) {
    status(e.message,true);
    $("notice").textContent = "검색을 완료하지 못했습니다.";
  } finally { $("submit").disabled = mode.disabled = false; $("work").readOnly = false; }
};
start();