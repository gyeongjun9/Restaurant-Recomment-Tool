"use strict";
const {demo} = require("./demo");
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