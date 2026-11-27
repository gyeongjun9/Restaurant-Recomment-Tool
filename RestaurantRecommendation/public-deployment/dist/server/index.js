const assets = {"/":["<!doctype html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>회식 장소 찾기</title>\n<link rel=\"stylesheet\" href=\"/style.css\">\n<script src=\"/ui.js\" defer></script>\n</head>\n<body>\n<header class=\"hero\"><div class=\"wrap mast\"><div><h1>회식 장소 찾기</h1><p>근무지에서 자동차 30분, 역에서 도보 10분</p></div>\n<label class=\"mode\">검색 방식 <select id=\"mode\"><option value=\"live\">실데이터</option><option value=\"demo\">데모 데이터</option></select></label></div></header>\n<main class=\"wrap\">\n<form id=\"search\" aria-label=\"회식 조건\">\n<div class=\"fields\"><label>근무지<input id=\"work\" required maxlength=\"150\" placeholder=\"주소 또는 건물명\"></label>\n<label>희망 메뉴<input id=\"menus\" required maxlength=\"164\" placeholder=\"예: 삼겹살, 회\"></label>\n<label>인원<input id=\"people\" required type=\"number\" min=\"1\" step=\"1\" placeholder=\"예: 12\"></label>\n<button type=\"submit\" id=\"submit\">장소 찾기</button></div>\n<fieldset><legend>역 유형</legend><label><input type=\"checkbox\" name=\"station\" value=\"KTX\" checked> KTX</label><label><input type=\"checkbox\" name=\"station\" value=\"SRT\" checked> SRT</label><label><input type=\"checkbox\" name=\"station\" value=\"metro\" checked> 지하철</label></fieldset>\n<details><summary>회식 일시와 추가 조건</summary>\n<div class=\"extras\"><label>회식 일시 (한국 시간)<input type=\"datetime-local\" id=\"date\"></label>\n<label>1인 예산 (원)<input type=\"number\" min=\"1\" step=\"1\" id=\"budget\"></label>\n<label>룸<select id=\"room\"><option value=\"\">선택 안 함</option><option value=\"prefer\">선호</option><option value=\"required\">필수</option></select></label>\n<label>주차<select id=\"parking\"><option value=\"\">선택 안 함</option><option value=\"prefer\">선호</option><option value=\"required\">필수</option></select></label></div></details>\n<div id=\"choices\" hidden><label>근무지 주소 선택<select id=\"address\"></select></label></div>\n<p id=\"modeHelp\" aria-live=\"polite\">검색 서비스 연결 상태를 확인하는 중입니다.</p>\n<p id=\"status\" role=\"status\" aria-live=\"polite\"></p>\n</form>\n<div class=\"layout\">\n<section class=\"panel map-panel\" aria-labelledby=\"mapHeading\">\n<div class=\"panel-top\"><h2 id=\"mapHeading\">네이버 지도</h2><div class=\"legend\"><span>근무지</span><span>기준 통과 역</span><span>식당</span></div></div>\n<div class=\"map-frame\"><div id=\"map\" aria-label=\"네이버 지도\"></div><div id=\"mapMessage\" role=\"status\"><span>네이버 지도를 보려면 로컬 서버에서 페이지를 여세요. <a href=\"http://127.0.0.1:3000/\">로컬 앱 열기</a></span></div></div>\n</section>\n<section class=\"panel results\" aria-labelledby=\"resultsHeading\">\n<div class=\"panel-top\"><h2 id=\"resultsHeading\">검색 결과</h2><button id=\"copy\" type=\"button\" class=\"secondary\" hidden>요약 복사</button></div>\n<div class=\"result-body\"><p id=\"notice\">조건을 입력하면 추천 장소와 확인이 필요한 후보가 표시됩니다.</p>\n<details id=\"issues\" hidden><summary>일부 조회 실패</summary><ul></ul></details>\n<div id=\"results\"></div>\n<textarea id=\"share\" rows=\"5\" readonly aria-label=\"공유용 요약\" hidden></textarea></div>\n</section>\n</div>\n</main>\n</body>\n</html>","text/html"],"/index.html":["<!doctype html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>회식 장소 찾기</title>\n<link rel=\"stylesheet\" href=\"/style.css\">\n<script src=\"/ui.js\" defer></script>\n</head>\n<body>\n<header class=\"hero\"><div class=\"wrap mast\"><div><h1>회식 장소 찾기</h1><p>근무지에서 자동차 30분, 역에서 도보 10분</p></div>\n<label class=\"mode\">검색 방식 <select id=\"mode\"><option value=\"live\">실데이터</option><option value=\"demo\">데모 데이터</option></select></label></div></header>\n<main class=\"wrap\">\n<form id=\"search\" aria-label=\"회식 조건\">\n<div class=\"fields\"><label>근무지<input id=\"work\" required maxlength=\"150\" placeholder=\"주소 또는 건물명\"></label>\n<label>희망 메뉴<input id=\"menus\" required maxlength=\"164\" placeholder=\"예: 삼겹살, 회\"></label>\n<label>인원<input id=\"people\" required type=\"number\" min=\"1\" step=\"1\" placeholder=\"예: 12\"></label>\n<button type=\"submit\" id=\"submit\">장소 찾기</button></div>\n<fieldset><legend>역 유형</legend><label><input type=\"checkbox\" name=\"station\" value=\"KTX\" checked> KTX</label><label><input type=\"checkbox\" name=\"station\" value=\"SRT\" checked> SRT</label><label><input type=\"checkbox\" name=\"station\" value=\"metro\" checked> 지하철</label></fieldset>\n<details><summary>회식 일시와 추가 조건</summary>\n<div class=\"extras\"><label>회식 일시 (한국 시간)<input type=\"datetime-local\" id=\"date\"></label>\n<label>1인 예산 (원)<input type=\"number\" min=\"1\" step=\"1\" id=\"budget\"></label>\n<label>룸<select id=\"room\"><option value=\"\">선택 안 함</option><option value=\"prefer\">선호</option><option value=\"required\">필수</option></select></label>\n<label>주차<select id=\"parking\"><option value=\"\">선택 안 함</option><option value=\"prefer\">선호</option><option value=\"required\">필수</option></select></label></div></details>\n<div id=\"choices\" hidden><label>근무지 주소 선택<select id=\"address\"></select></label></div>\n<p id=\"modeHelp\" aria-live=\"polite\">검색 서비스 연결 상태를 확인하는 중입니다.</p>\n<p id=\"status\" role=\"status\" aria-live=\"polite\"></p>\n</form>\n<div class=\"layout\">\n<section class=\"panel map-panel\" aria-labelledby=\"mapHeading\">\n<div class=\"panel-top\"><h2 id=\"mapHeading\">네이버 지도</h2><div class=\"legend\"><span>근무지</span><span>기준 통과 역</span><span>식당</span></div></div>\n<div class=\"map-frame\"><div id=\"map\" aria-label=\"네이버 지도\"></div><div id=\"mapMessage\" role=\"status\"><span>네이버 지도를 보려면 로컬 서버에서 페이지를 여세요. <a href=\"http://127.0.0.1:3000/\">로컬 앱 열기</a></span></div></div>\n</section>\n<section class=\"panel results\" aria-labelledby=\"resultsHeading\">\n<div class=\"panel-top\"><h2 id=\"resultsHeading\">검색 결과</h2><button id=\"copy\" type=\"button\" class=\"secondary\" hidden>요약 복사</button></div>\n<div class=\"result-body\"><p id=\"notice\">조건을 입력하면 추천 장소와 확인이 필요한 후보가 표시됩니다.</p>\n<details id=\"issues\" hidden><summary>일부 조회 실패</summary><ul></ul></details>\n<div id=\"results\"></div>\n<textarea id=\"share\" rows=\"5\" readonly aria-label=\"공유용 요약\" hidden></textarea></div>\n</section>\n</div>\n</main>\n</body>\n</html>","text/html"],"/style.css":[":root{color-scheme:light;--ink:#142332;--muted:#4d6375;--line:#dce6ed;--paper:#fff;--blue:#15578b;--green:#08744c;--orange:#a64520}\n*{box-sizing:border-box}\n[hidden]{display:none!important}\nbody{margin:0;background:#eef4f8;color:var(--ink);font:15px/1.55 system-ui,\"Malgun Gothic\",sans-serif}\n.wrap{width:min(1420px,calc(100% - 48px));margin-inline:auto}\n.hero{background:#122d43;color:white;border-bottom:4px solid #4ba998}\n.mast,.panel-top{display:flex;align-items:center;justify-content:space-between;gap:12px}\n.mast{padding:22px 0}\nh1,h2,h3,p{margin:0}\nh1{font-size:clamp(26px,4vw,38px);letter-spacing:-.06em;line-height:1.2}\n.mast p{color:#d3e4ef;margin-top:6px}\n.mode{min-width:125px;color:#d3e4ef}\nform,.panel{background:var(--paper);border:1px solid var(--line);border-radius:16px}\nform{margin:20px 0;padding:17px 20px}\n.fields{display:grid;grid-template-columns:1.35fr 1fr minmax(84px,.36fr) auto;gap:12px;align-items:end}\n.extras{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:12px;padding-top:10px}\nlabel{display:grid;gap:5px;font-weight:650}\ninput,select,button,textarea{font:inherit}\ninput:not([type=checkbox]),select,textarea{width:100%;min-width:0;padding:9px 10px;border:1px solid #aabdc9;border-radius:8px;background:white;color:var(--ink)}\ninput[type=checkbox]{accent-color:var(--blue);width:16px;height:16px}\nbutton{border:1px solid transparent;border-radius:8px;padding:9px 14px;cursor:pointer;background:var(--blue);color:white;font-weight:700}\nbutton:disabled{opacity:.65;cursor:wait}\n.secondary{background:white;color:var(--blue);border-color:#aabdc9}\nfieldset{padding:0;border:0;margin:12px 0 8px;display:flex;flex-wrap:wrap;gap:10px 15px}\nfieldset legend{font-weight:700;float:left;margin-right:10px}\nfieldset label{display:flex;align-items:center;gap:3px;font-weight:500}\nsummary{cursor:pointer;color:var(--blue);font-weight:650}\n#choices{margin-top:12px}\n#modeHelp{margin-top:10px;color:var(--muted);font-size:14px}\n#status:not(:empty){margin-top:10px;color:var(--blue);font-weight:600}\n#status[data-error=\"true\"]{color:#963522}\n.layout{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:16px;align-items:start;margin-bottom:24px}\n.panel{overflow:hidden}\n.panel-top{min-height:59px;padding:10px 15px;border-bottom:1px solid var(--line);flex-wrap:wrap}\nh2{font-size:18px}\n.legend{display:flex;flex-wrap:wrap;gap:8px 13px;color:var(--muted);font-size:13px}\n.legend span::before{content:\"\";display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:var(--blue)}\n.legend span:nth-child(2)::before{background:var(--green)}\n.legend span:nth-child(3)::before{background:var(--orange)}\n.map-frame{height:min(68vh,680px);min-height:420px;background:#e6eef3;position:relative}\n#map{height:100%;width:100%}\n#mapMessage{position:absolute;inset:0;display:grid;place-content:center;text-align:center;padding:24px;background:#e6eef3;color:#395568;}\n#mapMessage a{color:var(--blue)}\n.result-body{padding:15px}\n#notice,.card p,.scope{overflow-wrap:anywhere}\n#notice,.card p,.empty{color:var(--muted);font-size:14px}\n#issues{margin-top:10px}\n.results h3{margin:17px 0 8px;font-size:17px}\n.card{border:1px solid var(--line);border-radius:10px;margin:8px 0;padding:11px 12px}\n.card.active{border-color:var(--blue);box-shadow:inset 3px 0 var(--blue);background:#f3f9ff}\n.card p{margin:4px 0}\n.card button{background:none;color:var(--ink);padding:2px 3px;text-align:left;font-size:16px}\n.card a{color:var(--blue);display:inline-block;margin-right:8px}\n.card .reason{color:#85401c}\n.pin{display:block;padding:3px 7px;font-size:12px;border:2px solid white;border-radius:12px;background:var(--blue);color:#fff;white-space:nowrap;box-shadow:0 1px 5px #0005}\n.pin.station{background:var(--green)}\n.pin.place{background:var(--orange)}\n.pin.selected{border-color:#fcd56d;outline:2px solid #142332}\nbutton:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #1a699c;outline-offset:2px}\n@media(max-width:820px){.layout{grid-template-columns:1fr}.map-frame{height:42vh;min-height:300px}}\n@media(max-width:570px){.wrap{width:calc(100% - 24px)}.mast{align-items:flex-start}.fields,.extras{grid-template-columns:1fr 1fr}.fields label:first-child,.fields label:nth-child(2){grid-column:1/-1}.mast p{font-size:13px}form{padding:13px}.mode{min-width:100px}}","text/css"],"/ui.js":["\"use strict\";\nconst $ = id => document.getElementById(id);\nconst mode = $(\"mode\");\nlet searchConfig;\nlet map, mapFailed = false, pins = [], model, visible, active, addresses = [], addressKey, addressNotes = [];\nconst kst = new Intl.DateTimeFormat(\"ko-KR\",{timeZone:\"Asia/Seoul\",dateStyle:\"short\",timeStyle:\"medium\"});\nfunction append(parent, tag, value, className) {\n  const node = document.createElement(tag);\n  if (value != null) node.textContent = value;\n  if (className) node.className = className;\n  parent.append(node);\n  return node;\n}\nfunction link(parent, title, url) {\n  try {\n    if (new URL(url).protocol !== \"https:\") return;\n  } catch { return; }\n  const a = append(parent,\"a\",title);\n  a.href = url;\n  a.target = \"_blank\";\n  a.rel = \"noopener noreferrer\";\n}\nfunction status(message, error = false) {\n  $(\"status\").textContent = message;\n  $(\"status\").dataset.error = error;\n}\nasync function request(name, data) {\n  const response = await fetch(\"/api/\"+name,data ? {method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(data)} : {signal:AbortSignal.timeout(5000)});\n  const result = await response.json();\n  if (!response.ok) throw new Error(result.error || \"서버 연결 오류\");\n  return result;\n}\nfunction showMapMessage(message, failed = false) {\n  mapFailed = failed;\n  $(\"mapMessage\").textContent = message;\n  $(\"mapMessage\").hidden = false;\n}\nasync function start() {\n  try {\n    showMapMessage(\"지도 설정을 확인하는 중입니다.\");\n    const config = searchConfig = await request(\"config\");\n    mode.value = config.live ? \"live\" : \"demo\";\n    updateModeHelp();\n    if (mode.value === \"demo\") fillDemo();\n    if (!config.mapKey) {\n      showMapMessage(\"네이버 지도 공개 키가 설정되지 않았습니다. 서버 .env의 NAVER_MAP_PUBLIC_KEY를 설정해 주세요. 데모 검색은 사용할 수 있습니다.\");\n      return;\n    }\n    showMapMessage(\"네이버 지도를 불러오는 중입니다.\");\n    const script = document.createElement(\"script\");\n    script.src = \"https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=\"+encodeURIComponent(config.mapKey);\n    const timeout = setTimeout(()=>showMapMessage(\"네이버 지도 로딩 시간 초과 · 네트워크를 확인하세요.\"),12000);\n    window.navermap_authFailure = () => {\n      clearTimeout(timeout);\n      showMapMessage(\"네이버 지도 인증 오류 · 공개 키, Dynamic Map 및 허용 URL을 확인하세요.\",true);\n    };\n    script.onerror = () => {\n      clearTimeout(timeout);\n      if (!mapFailed) showMapMessage(\"네이버 지도 로딩 실패 · 네트워크를 확인하세요.\");\n    };\n    script.onload = () => {\n      clearTimeout(timeout);\n      if (mapFailed) return;\n      try {\n        map = new naver.maps.Map(\"map\",{center:new naver.maps.LatLng(37.56359,126.975407),zoom:15,zoomControl:true});\n        $(\"mapMessage\").hidden = true;\n        if (model) drawMap(model.work);\n      } catch { showMapMessage(\"네이버 지도를 초기화하지 못했습니다.\"); }\n    };\n    document.head.append(script);\n  } catch {\n    $(\"modeHelp\").textContent = \"검색 서비스 연결 상태를 확인하지 못했습니다.\";\n    showMapMessage(\"서버에 연결할 수 없습니다. 페이지를 새로고침해 주세요.\");\n  }\n}\nfunction fillDemo() {\n  if (!$(\"work\").value) $(\"work\").value = \"서울시청\";\n  if (!$(\"menus\").value) $(\"menus\").value = \"삼겹살, 회\";\n  if (!$(\"people\").value) $(\"people\").value = \"12\";\n  status(\"데모 데이터 · 입력 예시로 검색할 수 있습니다.\");\n}\nfunction addPin(point, kind, label, onClick, selected = false) {\n  if (!map || mapFailed || !Number.isFinite(point.x) || !Number.isFinite(point.y) ||\n      point.x < 124 || point.x > 132 || point.y < 32 || point.y > 40) return;\n  const button = document.createElement(\"button\");\n  button.type = \"button\";\n  button.textContent = label;\n  button.className = \"pin \"+kind+(selected ? \" selected\" : \"\");\n  button.title = label;\n  button.addEventListener(\"click\",event=>{\n    event.stopPropagation();\n    if (onClick) onClick();\n    else map.panTo(marker.getPosition());\n  });\n  const marker = new naver.maps.Marker({map,position:new naver.maps.LatLng(point.y,point.x),\n    icon:{content:button,anchor:new naver.maps.Point(15,17)},zIndex:selected ? 100 : kind === \"place\" ? 50 : 20});\n  \n  pins.push(marker);\n}\nfunction drawMap(work, fit = true) {\n  if (!map || mapFailed) return;\n  pins.forEach(pin=>pin.setMap(null));\n  pins = [];\n  if (!work) return;\n  addPin(work,\"work\",\"근무지\");\n  const stationId = active?.best.station.id;\n  for (const station of model?.stations || []) {\n    addPin(station,\"station\",station.name+\" · \"+station.services.join(\"·\"),()=>{\n      const row = [...model.recommended,...model.pending].find(r=>r.best.station.id === station.id);\n      if (row) select(row,true);\n      else map.panTo(new naver.maps.LatLng(station.y,station.x));\n    },station.id === stationId);\n  }\n  for (const row of model ? [...model.recommended,...model.pending] : []) {\n    addPin(row.place,\"place\",row.place.name,()=>select(row,true),active === row);\n  }\n  if (fit && pins.length === 1) {\n    map.panTo(pins[0].getPosition());\n    map.setZoom(15);\n  } else if (fit && pins.length > 1) {\n    const bounds = new naver.maps.LatLngBounds(pins[0].getPosition(),pins[0].getPosition());\n    pins.forEach(pin=>bounds.extend(pin.getPosition()));\n    map.fitBounds(bounds,48);\n  }\n}\nfunction time(value) {\n  if (value == null) return \"확인 필요\";\n  const whole = Math.floor(value);\n  return Math.floor(whole/60)+\"분 \"+whole%60+\"초\";\n}\nfunction select(row, fromMap) {\n  active = row;\n  const key = model.recommended.includes(row) ? \"recommended\" : \"pending\";\n  if (fromMap && !visible.get(row)) render(new Set([key]));\n  for (const [item,card] of visible) {\n    card.classList.toggle(\"active\",item === row);\n    card.querySelector(\"button\").setAttribute(\"aria-pressed\",String(item === row));\n  }\n  if (fromMap) visible.get(row)?.scrollIntoView({block:\"nearest\",behavior:\"smooth\"});\n  drawMap(model.work,false);\n  if (map && !mapFailed && Number.isFinite(row.place.x) && row.place.x >= 124 && row.place.x <= 132 && row.place.y >= 32 && row.place.y <= 40) {\n    const bounds = new naver.maps.LatLngBounds(new naver.maps.LatLng(row.place.y,row.place.x),\n      new naver.maps.LatLng(row.place.y,row.place.x));\n    bounds.extend(new naver.maps.LatLng(row.best.station.y,row.best.station.x));\n    if (!map.getBounds().hasLatLng(new naver.maps.LatLng(row.place.y,row.place.x)) ||\n        !map.getBounds().hasLatLng(new naver.maps.LatLng(row.best.station.y,row.best.station.x))) map.fitBounds(bounds,55);\n  }\n}\nconst expansions = new Set();\nfunction render(expand = new Set()) {\n  expand.forEach(key=>expansions.add(key));\n  const root = $(\"results\");\n  root.replaceChildren();\n  visible = new Map();\n  if (!model) return;\n  const {scope,issues,options} = model;\n  const l = scope.limits;\n  $(\"notice\").textContent = (options.mode === \"demo\" ? \"데모 데이터 · \" : \"실데이터 · \")+\n    \"등록 역 \"+scope.catalog+\"곳 · 직선 \"+l.radius+\"km 내 \"+scope.inRadius+\"곳 중 \"+scope.stations+\"곳 조회(유형별 \"+l.perType+\"곳) · \"+\n    \"식당 지역 검색 \"+scope.queries+\"회, 검색어당 최대 \"+l.perQuery+\"곳 · 보행 \"+scope.walks+\"회(최대 \"+l.walking+\"회, 역·식당당 출입구 \"+l.exits+\"개)\"+\n    (scope.walkLimited || scope.exitLimited ? \" · 일부 출입구 조회 한도 적용\" : \"\");\n  $(\"issues\").hidden = !issues.length;\n  $(\"issues\").querySelector(\"ul\").replaceChildren();\n  issues.forEach(issue=>append($(\"issues\").querySelector(\"ul\"),\"li\",issue));\n  for (const [key,title] of [[\"recommended\",\"추천\"],[\"pending\",\"확인 필요\"]]) {\n    const rows = model[key], section = append(root,\"section\");\n    append(section,\"h3\",title+\" \"+rows.length+\"곳\");\n    if (!rows.length) append(section,\"p\",key === \"recommended\" ? \"추천 기준을 충족한 곳이 없습니다.\" : \"확인이 필요한 후보가 없습니다.\",\"empty\");\n    for (const row of rows.slice(0,expansions.has(key) ? rows.length : 5)) {\n      const {place,best} = row;\n      const card = append(section,\"article\",null,\"card\"+(row === active ? \" active\" : \"\"));\n      visible.set(row,card);\n      const pick = append(card,\"button\",place.name);\n      pick.type = \"button\";\n      pick.setAttribute(\"aria-pressed\",String(row === active));\n      pick.onclick = ()=>select(row,false);\n      append(card,\"p\",place.address);\n      link(card,\"네이버 지도\",place.url);\n      if (place.phone && options.mode !== \"demo\") {\n        const phone = append(card,\"a\",place.phone);\n        phone.href = \"tel:\"+place.phone.replace(/[^+\\d]/g,\"\");\n      }\n      append(card,\"p\",best.station.name+\" · \"+best.station.services.join(\" · \"));\n      append(card,\"p\",\"자동차 \"+time(best.car)+(best.carAt ? \" · \"+(options.mode === \"demo\" ? \"가상 교통\" : \"Ncloud Directions 5 조회 시점 교통\")+\" · \"+kst.format(new Date(best.carAt))+\" KST\" : \"\"));\n      append(card,\"p\",\"도보 \"+time(best.walk)+\" · \"+(best.exit || \"출입구 확인 필요\")+\" · \"+best.walkingProvider+\n        (best.partial && best.walk != null ? \" · 조회된 출입구 기준\" : \"\"));\n      append(card,\"p\",\"메뉴 \"+(row.matching.join(\", \") || \"확인 필요\")+\" · \"+(row.capacity == null ? options.people+\"명 단체석 전화 확인\" : \"동석 최대 \"+row.capacity+\"명\"));\n      append(card,\"p\",(options.date ? \"영업 \"+(row.open ? \"시간표상 영업\" : \"확인 필요\") : \"일시 미입력\")+\" · 예약 가능 여부 \"+(place.facts?.reservation === false ? \"예약 미운영\" : \"매장 확인 필요\"));\n      append(card,\"p\",\"장소 출처 · \"+place.source);\n      if (options.mode === \"demo\") append(card,\"p\",\"메뉴·좌석 근거 · 데모 매장 안내\");\n      else for (const source of place.facts?.sources || []) link(card,\"매장 근거\",source);\n      if (best.station.source) link(card,\"역 출처\"+(best.station.asOf ? \" · \"+best.station.asOf : \"\"),best.station.source);\n      if (best.station.carAccess?.name) append(card,\"p\",\"차량 도착 지점 · \"+best.station.carAccess.name);\n      if (best.station.carAccess?.source) link(card,\"차량 지점 출처\",best.station.carAccess.source);\n      const exitSource = best.station.exits?.find(e=>e.name === best.exit)?.source;\n      if (exitSource) link(card,\"출입구 출처\",exitSource);\n      if (row.missing.length) {\n        append(card,\"p\",row.missing.join(\" · \"),\"reason\");\n        const detail = append(card,\"details\");\n        append(detail,\"summary\",\"전화 확인 문구\");\n        append(detail,\"p\",(options.date ? options.date.replace(\"T\",\" \")+\"에 \" : \"\")+\n          options.people+\"명이 함께 앉을 수 있나요? \"+options.menus.join(\" 또는 \")+\" 주문이 가능한지와 단체 예약 가능 여부를 알려주세요.\");\n      }\n    }\n    if (rows.length > 5 && !expansions.has(key)) {\n      const more = append(section,\"button\",title+\" \"+(rows.length-5)+\"곳 더 보기\",\"secondary\");\n      more.onclick = ()=>render(new Set([key]));\n    }\n  }\n  $(\"copy\").hidden = !model.recommended.length && !model.pending.length;\n}\nfunction reset() {\n  addressKey = undefined;\n  addresses = [];\n  addressNotes = [];\n  $(\"choices\").hidden = true;\n}\nfunction updateModeHelp() {\n  const available = searchConfig?.live;\n  const state = mode.value === \"demo\" ?\n    \"데모 데이터는 가상의 식당과 이동 시간을 사용합니다. 서울시청 예시로 기능을 확인할 수 있습니다.\" :\n    available ? \"실데이터는 입력한 근무지를 네이버에서 찾고, 등록된 역과 실제 식당의 이동 시간을 조회합니다.\" :\n      \"실데이터는 네이버 주소·자동차·지역 검색 API를 연결한 뒤 사용할 수 있습니다.\";\n  $(\"modeHelp\").textContent = state + (mode.value === \"live\" && available && !searchConfig.walking ?\n    \" TMAP 미설정으로 도보 시간이 필요한 후보는 확인 필요로 표시됩니다.\" : \"\");\n}\nmode.onchange = () => {\n  reset();\n  model = active = undefined;\n  expansions.clear();\n  $(\"results\").replaceChildren();\n  $(\"issues\").hidden = $(\"copy\").hidden = $(\"share\").hidden = true;\n  $(\"notice\").textContent = \"조건을 입력하면 추천 장소와 확인이 필요한 후보가 표시됩니다.\";\n  drawMap();\n  updateModeHelp();\n  if (mode.value === \"demo\") fillDemo();\n  else status(\"\");\n};\n$(\"work\").addEventListener(\"input\",reset);\n$(\"copy\").onclick = async () => {\n  const summary = [model.options.mode === \"demo\" ? \"데모 데이터\" : \"회식 후보\",\n    ...[\"recommended\",\"pending\"].flatMap(key=>model[key].map(({place,best,missing})=>[\n      key === \"recommended\" ? \"추천\" : \"확인 필요\",place.name,best.station.name,\"차량 \"+time(best.car),\n      \"도보 \"+time(best.walk),...missing,place.url].join(\" · \")))].join(\"\\n\");\n  try { await navigator.clipboard.writeText(summary); status(\"공유용 요약을 복사했습니다.\"); }\n  catch { $(\"share\").hidden = false; $(\"share\").value = summary; $(\"share\").select(); }\n};\n$(\"search\").addEventListener(\"invalid\",()=>status(\"입력 오류 · 필수 입력과 양의 정수 조건을 확인하세요.\",true),true);\n$(\"search\").onsubmit = async event => {\n  event.preventDefault();\n  const options = {mode:mode.value,work:$(\"work\").value.trim(),menus:$(\"menus\").value.split(/[,，;\\n]/).map(m=>m.trim()).filter(Boolean),\n    people:Number($(\"people\").value),selected:[...document.querySelectorAll(\"[name=station]:checked\")].map(e=>e.value),\n    date:$(\"date\").value,budget:$(\"budget\").value ? Number($(\"budget\").value) : null,room:$(\"room\").value,parking:$(\"parking\").value};\n  if (!options.work || !options.menus.length || options.menus.length > 4 || options.menus.some(m=>m.length>40 || !m.replace(/[\\s\\p{P}]/gu,\"\")) ||\n      !Number.isSafeInteger(options.people) || options.people < 1 || !options.selected.length) {\n    status(\"입력 오류 · 근무지, 메뉴(최대 4개·각 40자), 인원 및 선택한 역 유형을 확인하세요.\",true);\n    return;\n  }\n  if (options.mode === \"live\" && searchConfig?.live === false) {\n    status(\"실데이터 검색을 하려면 서버에 네이버 주소·자동차·지역 검색 연결이 필요합니다.\",true);\n    return;\n  }\n  $(\"submit\").disabled = mode.disabled = true;\n  $(\"work\").readOnly = true;\n  $(\"results\").replaceChildren();\n  $(\"issues\").hidden = $(\"copy\").hidden = $(\"share\").hidden = true;\n  $(\"notice\").textContent = \"검색 중입니다.\";\n  model = active = undefined;\n  expansions.clear();\n  drawMap();\n  try {\n    if (addressKey !== options.work) {\n      status(\"근무지 주소를 확인하는 중입니다.\");\n      const result = await request(\"address\",options);\n      addresses = result.rows;\n      addressNotes = result.notes;\n      const pick = $(\"address\");\n      pick.replaceChildren(new Option(\"주소를 선택하세요\",\"\"));\n      addresses.forEach((a,i)=>pick.add(new Option([a.name,a.address].filter(Boolean).join(\" · \"),String(i))));\n      $(\"choices\").hidden = addresses.length < 2;\n      if (addresses.length) addressKey = options.work;\n    }\n    if (!addresses.length) {\n      status(\"근무지 검색 결과 없음\"+(addressNotes.length ? \" · 일부 조회 실패: \"+addressNotes.join(\" · \") : \" · 주소 또는 지역명을 함께 입력하세요.\"),!!addressNotes.length);\n      $(\"notice\").textContent = \"근무지 주소를 확인한 뒤 식당을 검색할 수 있습니다.\";\n      return;\n    }\n    if (addresses.length > 1 && !$(\"address\").value) {\n      status(\"근무지 주소를 선택한 뒤 장소 찾기를 눌러 주세요.\"+(addressNotes.length ? \" · 일부 조회 실패: \"+addressNotes.join(\" · \") : \"\"));\n      $(\"notice\").textContent = \"근무지 주소 선택을 기다리는 중입니다.\";\n      $(\"address\").focus();\n      return;\n    }\n    const address = addresses[addresses.length === 1 ? 0 : Number($(\"address\").value)];\n    drawMap(address);\n    status(\"역과 식당의 자동차·보행 경로를 조회하는 중입니다.\");\n    model = {...await request(\"search\",{...options,address}),options};\n    model.issues.unshift(...addressNotes);\n    render();\n    drawMap(model.work);\n    const count = model.recommended.length+model.pending.length;\n    status((options.mode === \"demo\" ? \"데모 데이터 · \" : \"\")+(count ? \"후보 \"+count+\"곳\" : model.issues.length ? \"조회된 후보 없음\" : \"검색 결과 없음\")+\n      (model.issues.length ? \" · 일부 조회 실패 또는 정보 미확인\" : \"\"));\n  } catch (e) {\n    status(e.message,true);\n    $(\"notice\").textContent = \"검색을 완료하지 못했습니다.\";\n  } finally { $(\"submit\").disabled = mode.disabled = false; $(\"work\").readOnly = false; }\n};\nstart();","text/javascript"]};
const stations = [{"id":"seoul","name":"서울역","region":"서울 용산구","x":126.9707,"y":37.5547,"services":["KTX","1호선","4호선","공항철도","경의중앙선"],"types":["KTX","metro"],"source":"https://www.data.go.kr/data/15067652/fileData.do","asOf":"2026-11-26 편집","carAccess":{"name":"서울역 KTX빌딩 주차장","source":"https://www.knpark.com/parkInfo/parkInfoDetail.do?pluNo=110210","address":"서울특별시 용산구 청파로 378"},"exits":[{"query":"서울역 15번출구","name":"15번 출입구","source":"https://www.arex.or.kr/file/emergency_seoul.pdf"}],"exitsComplete":false},{"id":"yongsan","name":"용산역","region":"서울 용산구","x":126.9647,"y":37.5299,"services":["KTX","1호선","경의중앙선"],"types":["KTX","metro"],"source":"https://www.data.go.kr/data/15067652/fileData.do","asOf":"2026-11-26 편집","carAccess":null,"exits":[],"exitsComplete":false},{"id":"gwangmyeong","name":"광명역","region":"경기 광명시","x":126.8847,"y":37.4162,"services":["KTX","1호선"],"types":["KTX","metro"],"source":"https://www.data.go.kr/data/15067652/fileData.do","asOf":"2026-11-26 편집","carAccess":null,"exits":[],"exitsComplete":false},{"id":"suseo","name":"수서역","region":"서울 강남구","x":127.1045,"y":37.485,"services":["SRT","3호선","수인분당선","GTX-A"],"types":["SRT","metro"],"source":"https://www.srail.or.kr/cms/archive.do?pageId=KR0405000000","asOf":"2026-11-26 편집","carAccess":{"name":"수서역 SRT 주차장","source":"https://www.srail.or.kr/cms/archive.do?pageId=KR0406010000","address":"서울특별시 강남구 수서동 200-3"},"exits":[{"query":"수서역 1번출구","name":"지하철 1번 출입구","source":"https://www.srail.or.kr/cms/archive.do?pageId=KR0406010000"}],"exitsComplete":false},{"id":"dongtan","name":"동탄역","region":"경기 화성시","x":127.0959,"y":37.2003,"services":["SRT","GTX-A"],"types":["SRT","metro"],"source":"https://www.srail.or.kr/cms/archive.do?pageId=KR0405000000","asOf":"2026-11-26 편집","carAccess":{"name":"동탄역 주차장","source":"https://www.srail.or.kr/cms/archive.do?pageId=KR0406020000","address":"경기도 화성시 동탄역로 151"},"exits":[],"exitsComplete":false},{"id":"pyeongtaekjije","name":"평택지제역","region":"경기 평택시","x":127.0705,"y":37.0188,"services":["SRT","1호선"],"types":["SRT","metro"],"source":"https://www.srail.or.kr/cms/archive.do?pageId=KR0405000000","asOf":"2026-11-26 편집","carAccess":null,"exits":[],"exitsComplete":false},{"id":"cheonan-asan","name":"천안아산역","region":"충남 아산시","x":127.1045,"y":36.7944,"services":["KTX","SRT"],"types":["KTX","SRT"],"source":"https://www.srail.or.kr/cms/archive.do?pageId=KR0405000000","asOf":"2026-11-26 편집","carAccess":{"name":"천안아산역 광장1 주차장","source":"https://www.knpark.com/parkInfo/parkInfoDetail.do?pluNo=110441","address":"충청남도 아산시 배방읍 희망로 100"},"exits":[],"exitsComplete":false},{"id":"cityhall-seoul","name":"시청역","region":"서울 중구","x":126.977,"y":37.5657,"services":["1호선","2호선"],"types":["metro"],"source":"https://www.data.go.kr/data/15013205/standard.do","asOf":"2026-11-26 편집","carAccess":{"name":"서울시청 본청사 주차장","source":"https://news.seoul.go.kr/gov/archives/102634","address":"서울특별시 중구 세종대로 110"},"exits":[{"query":"시청역 4번출구","name":"4번 출입구","source":"https://news.seoul.go.kr/gov/archives/102634"}],"exitsComplete":false},{"id":"cityhall-busan","name":"시청역","region":"부산 연제구","x":129.0768,"y":35.1798,"services":["부산 1호선"],"types":["metro"],"source":"https://www.data.go.kr/data/15013205/standard.do","asOf":"2026-11-26 편집","carAccess":{"name":"부산시청 부설주차장","source":"https://www.busan.go.kr/bhintro03","address":"부산광역시 연제구 중앙대로 1001"},"exits":[],"exitsComplete":false},{"id":"byeongjeom","name":"병점역","region":"경기 화성시","x":127.0331,"y":37.2075,"services":["1호선"],"types":["metro"],"source":"https://www.data.go.kr/data/15013205/standard.do","asOf":"2026-11-26 편집","carAccess":null,"exits":[],"exitsComplete":false},{"id":"seodongtan","name":"서동탄역","region":"경기 오산시","x":127.0517,"y":37.1955,"services":["1호선"],"types":["metro"],"source":"https://www.data.go.kr/data/15013205/standard.do","asOf":"2026-11-26 편집","carAccess":null,"exits":[],"exitsComplete":false}];
const demoModule = (() => { const module = {exports:{}}; "use strict";
const work = {x:126.978,y:37.5665,address:"서울특별시 중구 세종대로 110",name:"서울시청"};
const make = (id,name,region,x,y,types,services,seconds,exitsComplete = true) => ({
  id,name,region,x,y,types,services,seconds,exitsComplete,carAccess:{x:x-.0003,y},
  exits:exitsComplete ? [{name:"1번 출입구",x,y:y+.0001},{name:"2번 출입구",x:x+.0001,y}] : []
});
const stations = [
  make("demo-seoul","서울역","서울 용산구",126.971,37.554,["KTX","metro"],["KTX","1호선","4호선"],1800),
  make("demo-cityhall","시청역","서울 중구",126.977,37.565,["metro"],["1호선","2호선"],450),
  make("demo-suseo","수서역","서울 강남구",127.105,37.485,["SRT","metro"],["SRT","3호선","GTX-A"],1380),
  make("demo-yongsan","용산역","서울 용산구",126.965,37.530,["KTX","metro"],["KTX","1호선"],1801),
  make("demo-cityhall-busan","시청역","부산 연제구",129.077,35.180,["metro"],["부산 1호선"],900)
];
const hours = Array.from({length:7},()=>[["11:00","22:00"]]);
function makePlace(id,name,address,x,y,menu,capacity,duration,other = {}) {
  return {id,name,address,x,y,duration,facts:{menu,capacity,hours,room:capacity > 20,parking:true,price:32000,...other},
    source:"가상 매장 데이터",url:"https://map.naver.com/p/search/"+encodeURIComponent(address)};
}
const venues = {
  "demo-seoul":[
    makePlace("pork-seoul","서울역 숯불마당 (가상)","서울 용산구 가상길 1",126.973,37.554,["숙성 삼겹살"],24,600),
    makePlace("fish-seoul","파란바다 서울점 (가상)","서울 용산구 가상길 2",126.973,37.555,["모둠회"],null,475),
    makePlace("too-far","서울역 먼 고깃집 (가상)","서울 용산구 가상길 3",126.974,37.554,["삼겹살"],30,601),
    makePlace("branch-one","숯불정원 (가상)","서울 용산구 가상길 4",126.972,37.555,["삼겹살"],20,360)
  ],
  "demo-cityhall":[
    makePlace("branch-two","숯불정원 (가상)","서울 중구 가상길 4",126.979,37.565,["삼겹살"],22,310),
    makePlace("busy","시청 모둠회 (가상)","서울 중구 가상길 8",126.978,37.564,["모둠회"],8,410),
    makePlace("needs-menu","시청 고기상회 (가상)","서울 중구 가상길 7",126.979,37.564,[],40,510)
  ],
  "demo-suseo":[
    makePlace("pork-suseo","수서 고기한상 (가상)","서울 강남구 가상길 1",127.107,37.485,["삼겹살"],40,360),
    makePlace("fish-suseo","수서 회마당 (가상)","서울 강남구 가상길 2",127.107,37.486,["광어회"],30,400)
  ]
};
const demo = {
  stations, walking:true, walkingProvider:"가상 보행 경로",
  async address(q) {
    if (/공용타워/.test(q)) return {rows:[
      {...work,name:"공용타워",address:"서울 중구 가상로 10"},
      {...work,name:"공용타워",address:"서울 강남구 가상로 20",x:127.06,y:37.50}
    ],notes:[]};
    if (/부산/.test(q)) return {rows:[{name:"가상 근무지",address:"부산 연제구 가상로 10",x:129.077,y:35.18}],notes:[]};
    if (/서울|시청|세종대로/.test(q)) return {rows:[work],notes:[]};
    return {rows:[],notes:[]};
  },
  async car(_work,station) { return {seconds:station.seconds,at:new Date().toISOString()}; },
  async places(_query,station,menu) {
    return (venues[station.id] || []).filter(p=>p.name.includes("고기상회") ? /삼겹|고기/.test(menu) :
      p.facts.menu.some(item=>item.includes(menu) || (menu === "고기" && item.includes("삼겹살"))));
  },
  async walk(exit,place) { return place.duration+(exit.name === "1번 출입구" ? 24 : 0); }
};
module.exports = {demo};
return module.exports; })();
const {real,demo,search,validate,point,Problem} = (() => { const module = {exports:{}}; "use strict";
const {demo} = demoModule;
const types = ["KTX","SRT","metro"];
const limits = {radius:40, stations:9, perType:3, menus:4, exits:4, perQuery:5, walking:48};
class Problem extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const norm = value => String(value ?? "").normalize("NFKC").toLowerCase().replace(/[\s\p{P}]/gu,"");
const point = p => p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 124 && p.x <= 132 && p.y >= 32 && p.y <= 40;
const validTime = n => typeof n === "number" && Number.isFinite(n) && n >= 0;
const keyOf = p => p.id ? "id:"+p.id : norm(p.name)+"|"+norm(p.address);
const strip = s => String(s ?? "").replace(/<\/?b>/gi,"").replace(/&amp;/g,"&");
const naverLink = (name,address) => "https://map.naver.com/p/search/"+encodeURIComponent(name+" "+address);
function validate(input) {
  const {work, menus, people, selected, date, budget, room, parking} = input || {};
  if (typeof work !== "string" || !work.trim() || work.length > 150) throw new Problem("근무지 주소 또는 건물명을 확인하세요.");
  if (!Array.isArray(menus) || menus.length < 1 || menus.length > limits.menus || menus.some(m => typeof m !== "string" || !norm(m) || m.length > 40)) throw new Problem("메뉴는 40자 이하로 최대 4개 입력하세요.");
  if (!Number.isSafeInteger(people) || people < 1) throw new Problem("인원은 양의 정수로 입력하세요.");
  if (!Array.isArray(selected) || !selected.length || selected.length > 3 || !selected.every(t => types.includes(t))) throw new Problem("역 유형을 하나 이상 선택하세요.");
  if (date && (typeof date !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(date) ||
      !Number.isFinite(Date.parse(date+"+09:00")) || new Date(date+"Z").toISOString().slice(0,16) !== date)) throw new Problem("회식 일시를 확인하세요.");
  if (budget != null && (!Number.isSafeInteger(budget) || budget < 1)) throw new Problem("예산은 양의 정수로 입력하세요.");
  if (![room,parking].every(v => ["","prefer","required",undefined].includes(v))) throw new Problem("편의 조건을 확인하세요.");
  return {work,menus:[...new Map(menus.map(m=>[norm(m),m])).values()],people,selected:[...new Set(selected)],date,budget,room,parking};
}
function distance(a,b) {
  const rad = Math.PI / 180;
  return 12742 * Math.asin(Math.sqrt(Math.sin((a.y-b.y)*rad/2)**2 +
    Math.cos(a.y*rad)*Math.cos(b.y*rad)*Math.sin((a.x-b.x)*rad/2)**2));
}
async function pool(items, task, count = 6) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({length:Math.min(items.length,count)},async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await task(items[i]);
    }
  }));
  return results;
}
function localPoint(row) {
  const direct = {x:Number(row.mapx),y:Number(row.mapy)};
  return point(direct) ? direct : {x:direct.x/1e7,y:direct.y/1e7};
}
function real(env, stations, evidence, fetcher = fetch) {
  if (!Array.isArray(stations) || new Set(stations.map(s=>s.id)).size !== stations.length ||
      stations.some(s=>!s.id || !s.name || !s.region || !point(s) || !Array.isArray(s.services) || !Array.isArray(s.types))) {
    throw new Problem("역 데이터 형식을 확인하세요.",500);
  }
  const map = "https://maps.apigw.ntruss.com";
  const local = "https://naverapihub.apigw.ntruss.com/search/v1/local";
  const headers = (id, secret) => ({"X-NCP-APIGW-API-KEY-ID":id,"X-NCP-APIGW-API-KEY":secret});
  const maps = headers(env.NCLOUD_MAPS_KEY_ID,env.NCLOUD_MAPS_KEY_SECRET);
  const hub = headers(env.NAVER_SEARCH_CLIENT_ID,env.NAVER_SEARCH_CLIENT_SECRET);
  const ready = [...Object.values(maps),...Object.values(hub)].every(Boolean);
  const pending = new Map();
  async function call(base, params, credentials, provider, payload) {
    const url = base+"?"+new URLSearchParams(params);
    const key = url+(payload || "");
    // Defer starting the fetch until the in-flight promise has been inserted.
    if (!pending.has(key)) {
      pending.set(key, Promise.resolve().then(async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(),4500);
        try {
          const response = await fetcher(url, {headers:credentials, signal:controller.signal,
            redirect:"error", ...(payload ? {method:"POST",body:payload} : {})});
          if (!response.ok) throw new Problem(provider + (response.status === 429 ? " 호출 한도 초과" : " 조회 실패 (HTTP "+response.status+")"),502);
          return await response.json();
        } catch (e) {
          if (e instanceof Problem) throw e;
          throw new Problem(provider + " 응답 시간 초과 또는 연결 오류",502);
        } finally { clearTimeout(timer); pending.delete(key); }
      }));
    }
    return pending.get(key);
  }
  function check() {
    if (!ready) throw new Problem("실데이터 검색 설정이 필요합니다. 데모 모드를 이용하거나 서버 환경변수를 확인하세요.",503);
  }
  async function geocode(q) {
    const data = await call(map+"/map-geocode/v2/geocode",{query:q,count:5},maps,"Ncloud Geocoding");
    if (data.status !== "OK" || !Array.isArray(data.addresses)) throw new Problem("Ncloud 주소 응답 오류",502);
    return data.addresses.map(a=>({address:a.roadAddress || a.jibunAddress,x:Number(a.x),y:Number(a.y)})).filter(a=>a.address && point(a));
  }
  async function localRows(q) {
    const data = await call(local,{query:q,display:5,start:1,format:"json"},hub,"네이버 지역 검색");
    if (!Array.isArray(data.items)) throw new Problem("네이버 지역 검색 응답 오류",502);
    return data.items;
  }
  return {
    ready, stations, walking:!!env.TMAP_APP_KEY, walkingProvider:"TMAP 보행자 경로",
    async address(q) {
      check();
      const notes = [];
      const [direct, localResult] = await Promise.allSettled([geocode(q),localRows(q)]);
      if (direct.status === "rejected") notes.push(direct.reason.message);
      if (localResult.status === "rejected") notes.push(localResult.reason.message);
      if (direct.status === "rejected" && localResult.status === "rejected") throw new Problem(notes.join(" · "),502);
      const candidates = new Map((direct.value || []).map(a=>[norm(a.address),a]));
      const rows = (localResult.value || []).filter(r => (r.roadAddress || r.address) && norm(strip(r.title)).includes(norm(q)));
      await pool(rows, async row => {
        const address = row.roadAddress || row.address;
        let coordinates = localPoint(row);
        if (!point(coordinates)) {
          try { coordinates = (await geocode(address))[0]; } catch (e) { notes.push(e.message); }
        }
        if (point(coordinates)) candidates.set(norm(address),{x:coordinates.x,y:coordinates.y,address,name:strip(row.title)});
      });
      return {rows:[...candidates.values()],notes:[...new Set(notes)]};
    },
    async car(work, station) {
      check();
      const access = point(station.carAccess) ? station.carAccess : station.carAccess?.address
        ? (await geocode(station.carAccess.address)).find(a=>distance(a,station)<2) : null;
      if (!point(access)) return null;
      const at = new Date().toISOString();
      const result = await call(map+"/map-direction/v1/driving",{start:work.x+","+work.y,
        goal:access.x+","+access.y,option:"trafast"},maps,"Ncloud Directions 5");
      const duration = result.route?.trafast?.[0]?.summary?.duration;
      return result.code === 0 && validTime(duration) ? {seconds:duration/1000,at} : null;
    },
    async exits(station) {
      return (await pool(station.exits || [],async exit=>{
        if (point(exit)) return exit;
        if (!exit.query) return null;
        const rows = await localRows(station.region+" "+exit.query);
        const matches = rows.filter(row=>norm(strip(row.title)) === norm(exit.query)).map(localPoint)
          .filter(p=>point(p) && distance(p,station)<1);
        return matches.length === 1 ? {...exit,...matches[0]} : null;
      },2)).filter(Boolean);
    },
    async places(query) {
      check();
      return (await localRows(query)).map(row => {
        const name = strip(row.title), address = row.roadAddress || row.address;
        const id = String(row.link || "").match(/^https:\/\/(?:map|m\.place|place)\.naver\.com\/(?:p\/entry\/)?(?:place|restaurant)\/(\d+)(?:[/?#]|$)/)?.[1];
        const record = id && Object.hasOwn(evidence,"id:"+id) ? evidence["id:"+id] :
          (Object.hasOwn(evidence,keyOf({name,address})) ? evidence[keyOf({name,address})] : undefined);
        const facts = record?.sources?.length ? record : {};
        return {...localPoint(row),name,address,id,...{phone:facts.phone || (/^[\d()+ -]{7,20}$/.test(row.telephone || "") ? row.telephone : ""),url:naverLink(name,address)},
          facts, category:row.category, source:"네이버 지역 검색"};
      }).filter(p=>p.name && p.address);
    },
    async walk(exit, place) {
      const payload = JSON.stringify({startX:exit.x,startY:exit.y,endX:place.x,endY:place.y,
        reqCoordType:"WGS84GEO",resCoordType:"WGS84GEO",startName:"역 출입구",endName:"식당"});
      const response = await call("https://apis.openapi.sk.com/tmap/routes/pedestrian",{version:1},
        {appKey:env.TMAP_APP_KEY,"Content-Type":"application/json"},"TMAP",payload);
      const seconds = response.features?.[0]?.properties?.totalTime;
      return validTime(seconds) ? seconds : null;
    }
  };
}
function openAt(hours,date) {
  if (!date || !hours) return null;
  const day = new Date(date+"Z").getUTCDay(), time = date.slice(11), yesterday = hours[(day+6)%7], today = hours[day];
  if (today?.some(([start,end])=>start <= time && (end < start || time < end)) ||
      yesterday?.some(([start,end])=>end < start && time < end)) return true;
  return today && yesterday ? false : null;
}
function evaluate(place, paths, opts) {
  const facts = place.facts || {};
  const matching = (facts.menu || []).filter(m=>opts.menus.some(q=>norm(m).includes(norm(q))));
  const capacity = Number.isSafeInteger(facts.capacity) && facts.capacity > 0 ? facts.capacity : null;
  const open = openAt(facts.hours,opts.date);
  if ((facts.menuComplete && !matching.length) || (capacity != null && capacity < opts.people) ||
      (opts.date && open === false) || (opts.budget && facts.price > opts.budget)) return null;
  const cmp = (a,b) => (a.walk ?? Infinity)-(b.walk ?? Infinity) || (a.car ?? Infinity)-(b.car ?? Infinity);
  const valid = paths.filter(p=>!(p.car > 1800 || p.walk > 600)).sort((a,b)=>
    Number(a.walk == null || a.car == null)-Number(b.walk == null || b.car == null) || cmp(a,b));
  const best = valid[0];
  if (!best) return null;
  const missing = [];
  if (best.car == null) missing.push("자동차 경로 확인 필요");
  if (best.walk == null) missing.push("도보 확인 필요 · "+best.walkReason);
  if (!matching.length) missing.push("메뉴 확인 필요 · 매장 메뉴 근거 없음");
  if (capacity == null) missing.push(opts.people+"명 단체석 전화 확인");
  if (opts.date && open == null) missing.push("회식 일시 영업 확인 필요");
  if (opts.budget && !Number.isFinite(facts.price)) missing.push("1인 예산 확인 필요");
  let preferences = 0;
  for (const [key,label] of [["room","룸"],["parking","주차"]]) {
    if (opts[key] === "required" && facts[key] === false) return null;
    if (opts[key] === "required" && facts[key] !== true) missing.push(label+" 확인 필요");
    if (opts[key] === "prefer" && facts[key] === true) preferences++;
  }
  return {place,best,matching,capacity,missing,open,preferences};
}
async function search(provider, opts, work) {
  if (provider.ready === false) throw new Problem("실데이터 검색 환경변수를 확인하세요.",503);
  const issues = new Set(), queries = new Map(), walks = new Map();
  const scope = {limits, catalog:provider.stations.length, inRadius:0, stations:0, queries:0, walks:0, walkLimited:false, exitLimited:false};
  async function attempt(task, label) {
    try { return await task(); } catch (e) {
      issues.add(label+" · "+(e instanceof Problem ? e.message : "조회 실패"));
      return null;
    }
  }
  const nearby = provider.stations.filter(s=>point(s) && s.types.some(t=>opts.selected.includes(t)))
    .map(s=>({s,km:distance(work,s)})).filter(r=>r.km<=limits.radius).sort((a,b)=>a.km-b.km);
  scope.inRadius = nearby.length;
  const stations = [...new Map(opts.selected.flatMap(type=>nearby.filter(r=>r.s.types.includes(type))
    .slice(0,limits.perType).map(({s})=>[s.id,s]))).values()].slice(0,limits.stations);
  scope.stations = stations.length;
  const entries = new Map();
  const routes = (await pool(stations,async station=>{
    const car = await attempt(()=>provider.car(work,station),station.name+" 자동차");
    if (car?.seconds > 1800) return null;
    if (!car) issues.add(station.name+" · 자동차 경로 확인 필요");
    return {station,car};
  })).filter(Boolean);
  const jobs = routes.flatMap(route=>opts.menus.map(menu=>({route,menu})));
  const found = await pool(jobs, async ({route,menu})=>{
    const query = [route.station.region,route.station.name,menu].join(" ");
    if (!queries.has(query)) queries.set(query,attempt(()=>provider.places(query,route.station,menu),route.station.name+" 식당"));
    return {route,places:await queries.get(query) || []};
  });
  scope.queries = queries.size;
  for (const {route,places} of found) {
    for (const place of places) {
      const key = keyOf(place);
      if (!entries.has(key)) entries.set(key,{key,place,routes:new Map()});
      entries.get(key).routes.set(route.station.id,route);
    }
  }
  // Schedule each venue's nearest exit before additional exits to spread the quota.
  const needExits = new Set([...entries.values()].flatMap(e=>[...e.routes.keys()]));
  const exitsByStation = new Map(await pool(routes.filter(r=>needExits.has(r.station.id)),async ({station})=>[
    station.id, provider.walking && provider.exits ? await attempt(()=>provider.exits(station),station.name+" 출입구 좌표") || [] : station.exits || []
  ]));
  const pairs = [...entries.values()].flatMap(entry=>[...entry.routes.values()].map(route=>{
    const all = (exitsByStation.get(route.station.id) || []).filter(e=>point(e) && e.name);
    const exits = point(entry.place) ? all.sort((a,b)=>distance(a,entry.place)-distance(b,entry.place)).slice(0,limits.exits) : [];
    if (all.length > limits.exits) scope.exitLimited = true;
    return {entry,route,exits,incomplete:route.station.exitsComplete !== true || all.length !== (route.station.exits || []).length || all.length > limits.exits, keys:[]};
  }));
  const walkingJobs = [];
  if (provider.walking) {
    for (let i=0;i<limits.exits;i++) {
      for (const pair of pairs) {
        const exit = pair.exits[i];
        if (!exit) continue;
        const place = pair.entry.place;
        const key = [exit.x,exit.y,place.x,place.y].join(",");
        if (!walks.has(key)) {
          if (walks.size >= limits.walking) { scope.walkLimited = true; pair.incomplete = true; continue; }
          walks.set(key,null);
          walkingJobs.push({key,exit,place,station:pair.route.station});
        }
        pair.keys.push({key,exit});
      }
    }
    await pool(walkingJobs,async ({key,exit,place,station})=>{
      const value = await attempt(()=>provider.walk(exit,place,station),station.name+" 도보");
      walks.set(key,validTime(value) ? value : null);
    });
  } else if (pairs.length) issues.add("TMAP 보행 API 미설정");
  scope.walks = walks.size;
  const pathsByEntry = new Map();
  for (const pair of pairs) {
    const {entry,route,keys} = pair;
    const valid = keys.map(({key,exit})=>({seconds:walks.get(key),exit})).filter(r=>validTime(r.seconds)).sort((a,b)=>a.seconds-b.seconds);
    const partial = pair.incomplete || valid.length !== keys.length;
    const best = partial && valid[0]?.seconds > 600 ? null : valid[0];
    const walkReason = !provider.walking ? "TMAP 미설정" : !pair.exits.length ? "출입구 또는 장소 좌표 미확인" :
      partial ? "일부 출입구 미등록·미조회 또는 경로 없음" : "유효한 경로 없음";
    if (!best && provider.walking) issues.add(route.station.name+" · "+walkReason);
    if (!pathsByEntry.has(entry.key)) pathsByEntry.set(entry.key,[]);
    pathsByEntry.get(entry.key).push({station:route.station,car:route.car?.seconds,carAt:route.car?.at,
      walk:best?.seconds,exit:best?.exit.name,walkReason,partial,walkingProvider:provider.walkingProvider});
  }
  const rows = [...entries.values()].map(entry=>evaluate(entry.place,pathsByEntry.get(entry.key)||[],opts)).filter(Boolean);
  rows.sort((a,b)=>Number(!!b.matching.length)-Number(!!a.matching.length) ||
    Number(b.capacity != null)-Number(a.capacity != null) ||
    (a.best.walk ?? Infinity)-(b.best.walk ?? Infinity) || (a.best.car ?? Infinity)-(b.best.car ?? Infinity) ||
    b.preferences-a.preferences);
  return {work,stations:routes.filter(r=>r.car).map(r=>r.station),recommended:rows.filter(r=>!r.missing.length),
    pending:rows.filter(r=>r.missing.length),issues:[...issues],scope};
}
module.exports = {Problem,point,validate,real,demo,search,evaluate,localPoint,openAt};
return module.exports; })();
const json = (body,status = 200) => Response.json(body,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
let active = 0;
async function readInput(request) {
  if (!/^application\/json(?:;|$)/i.test(request.headers.get("Content-Type") || "")) throw new Problem("JSON 요청이 필요합니다.",415);
  const reader = request.body?.getReader();
  if (!reader) throw new Problem("요청 본문이 필요합니다.");
  const decoder = new TextDecoder();
  let input = "", size = 0;
  for (;;) {
    const {done,value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 12000) {
      await reader.cancel();
      throw new Problem("입력 크기 한도를 넘었습니다.",413);
    }
    input += decoder.decode(value,{stream:true});
  }
  try { return JSON.parse(input+decoder.decode()); } catch { throw new Problem("입력 형식을 확인하세요."); }
}
export default {
  async fetch(request,env) {
    try {
      const url = new URL(request.url);
      if (request.method === "GET" && Object.hasOwn(assets,url.pathname)) {
        const [content,type] = assets[url.pathname];
        return new Response(content,{headers:{"Content-Type":type+"; charset=utf-8","X-Content-Type-Options":"nosniff"}});
      }
      if (request.method === "GET" && url.pathname === "/health") return json({status:"ok"});
      const live = real(env,stations,{},async (url,options)=>{
        try { return await globalThis.fetch(url,options); }
        catch (error) {
          const message = String(error?.message || "");
          const safeReason = /illegal invocation/i.test(message) ? "호출 형식 오류" :
            /blocked|not allowed|disallowed|forbidden|denied|egress|policy|permission/i.test(message) ? "호스팅 외부 연결 제한" :
            /header|byte|invalid character/i.test(message) ? "인증 헤더 형식 오류" :
            error?.name === "AbortError" ? "요청 시간 초과" : "외부 네트워크 요청 실패";
          console.warn("Provider request failed",new URL(url).hostname,safeReason,message.replace(/[^a-zA-Z .:/_-]/g,"").slice(0,120));
          throw new Problem(safeReason,502);
        }
      });
      if (request.method === "GET" && url.pathname === "/api/config") return json({mapKey:env.NAVER_MAP_PUBLIC_KEY || "",live:live.ready,walking:live.walking});
      if (request.method !== "POST" || !["/api/address","/api/search"].includes(url.pathname)) throw new Problem("페이지를 찾을 수 없습니다.",404);
      const origin = request.headers.get("Origin");
      if (origin && origin !== url.origin) throw new Problem("같은 사이트에서 요청하세요.",403);
      if (active >= 2) throw new Problem("동시 검색 한도에 도달했습니다. 잠시 후 다시 시도하세요.",429);
      active++;
      try {
        const input = await readInput(request);
        const provider = input?.mode === "demo" ? demo : live;
        if (url.pathname === "/api/address") {
          if (typeof input?.work !== "string" || !input.work.trim() || input.work.length > 150) throw new Problem("근무지 주소 또는 건물명을 확인하세요.");
          return json(await provider.address(input.work.trim()));
        }
        const options = validate(input);
        if (!point(input.address) || typeof input.address.address !== "string" || input.address.address.length > 200) throw new Problem("근무지 주소를 선택하세요.");
        return json(await search(provider,options,input.address));
      } finally { active--; }
    } catch (error) { return json({error:error instanceof Problem ? error.message : "검색 처리 중 오류가 발생했습니다."},error instanceof Problem ? error.status : 500); }
  }
};