"use strict";
const {test} = require("node:test");
const assert = require("node:assert/strict");
const {spawn} = require("node:child_process");
const fs = require("node:fs");
const vm = require("node:vm");
const {demo,validate,real,search,Problem,localPoint} = require("./engine");
const options = {work:"서울시청",menus:["삼겹살","회"],people:12,selected:["KTX","SRT","metro"],budget:null};
const run = async (provider = demo, overrides = {}) =>
  search(provider,validate({...options,...overrides}), (await demo.address("서울시청")).rows[0]);
const all = r=>[...r.recommended,...r.pending];

test("includes 1800/600 and excludes 1801/601 with the shortest valid exit",async ()=>{
  const result = await run();
  const exact = result.recommended.find(r=>r.place.id === "pork-seoul");
  assert.equal(exact.best.car,1800);
  assert.equal(exact.best.walk,600);
  assert.equal(exact.best.exit,"2번 출입구");
  assert.ok(!result.stations.some(s=>s.id === "demo-yongsan"));
  assert.ok(!all(result).some(r=>r.place.id === "too-far"));
  const fractional = await run({...demo,car:async ()=>({seconds:1800.001})});
  assert.equal(all(fractional).length,0);
});
test("tests each type and keeps different physical stations with the same name separate",async ()=>{
  for (const [type,id] of [["KTX","demo-seoul"],["SRT","demo-suseo"],["metro","demo-cityhall"]]) {
    const r = await run(demo,{selected:[type]});
    assert.ok(r.stations.some(s=>s.id === id));
    assert.ok(r.stations.every(s=>s.types.includes(type)));
  }
  const r = await run();
  assert.equal(r.stations.filter(s=>s.id === "demo-seoul").length,1);
  const busan = (await demo.address("부산")).rows[0];
  assert.deepEqual((await search(demo,validate(options),busan)).stations.map(s=>s.id),["demo-cityhall-busan"]);
  assert.equal((await demo.address("공용타워")).rows.length,2);
});
test("deduplication uses place IDs or names and addresses, with same-name branches distinct",async ()=>{
  const r = await run();
  assert.equal(r.recommended.filter(x=>x.place.name.startsWith("숯불정원")).length,2);
  const a = {name:"테스트 식당",address:"서울 중구 세종대로 1",x:126.978,y:37.565,source:"test",
    facts:{menu:["삼겹살"],capacity:12}};
  const across = await run({...demo,places:async()=>[a,{...a,name:"테스트식당"},{...a,address:"서울 중구 세종대로 2"}],
    walk:async(_exit,_place,station)=>station.id === "demo-seoul" ? 190 : 200});
  assert.equal(across.recommended.length,2);
  assert.ok(across.recommended.every(r=>r.best.station.id === "demo-seoul"));
});
test("missing capacity, missing menu, hours, budget and required amenities",async ()=>{
  const r = await run();
  const fish = r.pending.find(x=>x.place.id === "fish-seoul");
  assert.ok(fish.missing.includes("12명 단체석 전화 확인"));
  assert.ok(r.pending.find(x=>x.place.id === "needs-menu").missing.some(m=>m.includes("메뉴")));
  assert.ok(!all(r).some(x=>x.place.id === "busy"));
  assert.ok(r.recommended.every(x=>x.open === null));
  assert.equal(all(await run(demo,{date:"2026-11-26T23:00"})).length,0);
  assert.ok((await run(demo,{date:"2026-11-26T19:00",room:"required",budget:40000})).recommended.length);
  assert.equal(all(await run(demo,{budget:10000})).length,0);
  for (const people of [0,-1,1.5,"5"]) assert.throws(()=>validate({...options,people}),Problem);
  assert.throws(()=>validate({...options,date:"2026-02-30T12:00"}),Problem);
});
test("missing TMAP, timeout, and missing exit preserve pending candidates",async ()=>{
  const r = await run({...demo,walking:false});
  assert.equal(r.recommended.length,0);
  assert.ok(r.issues.includes("TMAP 보행 API 미설정"));
  assert.ok(r.pending.every(x=>x.best.walk == null));
  const mixed = await run({...demo,walk:async (exit,place)=>{
    if (exit.name === "1번 출입구") throw new Problem("응답 시간 초과",502);
    return demo.walk(exit,place);
  }});
  assert.ok(mixed.recommended.length);
  assert.ok(mixed.issues.some(s=>s.includes("시간 초과")));
  const missing = await run({...demo,stations:[{...demo.stations[0],exits:[],exitsComplete:false}],car:async()=>null});
  assert.ok(missing.pending.every(x=>x.missing.length >= 2));
  assert.equal(missing.stations.length,0);
  assert.equal(all(await run(demo,{menus:["실재하지 않는 메뉴"]})).length,0);
});
test("provider adapters use official endpoints, units, credentials and coordinate order",async ()=>{
  const catalog = require("./stations.json");
  assert.ok(Array.isArray(catalog) && catalog.length === 11);
  assert.equal(new Set(catalog.map(s=>s.id)).size,catalog.length);
  assert.ok(catalog.some(s=>s.carAccess?.address && s.exits.length));
  const calls = [];
  const fetcher = async (url,init)=>{
    calls.push([new URL(url),init]);
    const p = new URL(url).pathname;
    const result = p.includes("geocode") ? {status:"OK",addresses:[{roadAddress:"접근점",x:"126.971",y:"37.554"}]} :
      p.includes("driving") ? {code:0,route:{trafast:[{summary:{duration:1800001}}]}} :
      p.includes("pedestrian") ? {features:[{properties:{totalTime:600}}]} :
      {items:[{title:"<b>공용타워</b>",roadAddress:"주소 1",mapx:"1269710000",mapy:"375540000"},
        {title:"공용타워",roadAddress:"주소 2",mapx:"1269720000",mapy:"375550000"}]};
    return {ok:true,json:async()=>result};
  };
  const p = real({NCLOUD_MAPS_KEY_ID:"maps",NCLOUD_MAPS_KEY_SECRET:"hidden",NAVER_SEARCH_CLIENT_ID:"hub",
    NAVER_SEARCH_CLIENT_SECRET:"hidden-hub",TMAP_APP_KEY:"hidden-tmap"},[],{},fetcher);
  const s = {...demo.stations[0],carAccess:{address:"공식 주차장"}};
  const work = {x:126.978,y:37.5665};
  const locations = await p.address("공용타워");
  assert.ok(locations.rows.some(a=>a.address === "주소 1"));
  assert.ok(locations.rows.some(a=>a.address === "주소 2"));
  assert.equal((await p.car(work,s)).seconds,1800.001);
  assert.equal(await p.walk(work,{x:126.974,y:37.55}),600);
  assert.equal((await p.places("서울역 회"))[0].x,126.971);
  assert.deepEqual(localPoint({mapx:"127.1",mapy:"37.5"}),{x:127.1,y:37.5});
  const [drive,d] = calls.find(([url])=>url.pathname.includes("driving"));
  assert.equal(drive.host,"maps.apigw.ntruss.com");
  assert.equal(drive.searchParams.get("start"),"126.978,37.5665");
  assert.equal(drive.searchParams.get("goal"),"126.971,37.554");
  assert.equal(d.headers["X-NCP-APIGW-API-KEY"],"hidden");
  const [walk,t] = calls.find(([url])=>url.pathname.includes("pedestrian"));
  assert.equal(walk.host,"apis.openapi.sk.com");
  assert.deepEqual([JSON.parse(t.body).startX,JSON.parse(t.body).startY],[126.978,37.5665]);
  assert.equal(t.headers.appKey,"hidden-tmap");
});
test("HTTP demo, public key and secret isolation",async t=>{
  const child = spawn(process.execPath,["server.js"],{env:{...process.env,HOST:"127.0.0.1",PORT:"0",
    NAVER_MAP_PUBLIC_KEY:"public-test-key",NCLOUD_MAPS_KEY_SECRET:"sentinel-secret"}});
  t.after(()=>child.kill());
  const port = await new Promise((resolve,reject)=>{
    child.stdout.once("data",buf=>resolve(Number(buf.toString().trim().split(" ").at(-1))));
    child.once("error",reject);
    child.once("exit",code=>reject(new Error("서버 종료 "+code)));
  });
  const root = "http://127.0.0.1:"+port;
  const health = await fetch(root+"/health");
  assert.equal(health.status,200);
  assert.deepEqual(await health.json(),{status:"ok"});
  const config = await (await fetch(root+"/api/config")).json();
  assert.equal(config.mapKey,"public-test-key");
  assert.deepEqual(Object.keys(config).sort(),["live","mapKey","walking"]);
  assert.equal((await fetch(root+"/.env")).status,404);
  assert.match(await (await fetch(root)).text(),/네이버 지도/);
  const resp = await fetch(root+"/api/search",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({mode:"demo",...options,address:(await demo.address("서울시청")).rows[0]})});
  assert.equal(resp.status,200);
  const result = await resp.text();
  assert.ok(!result.includes("sentinel-secret"));
  assert.ok(JSON.parse(result).recommended.length);
});
test("map authentication callback shows a distinct error and leaves the demo form available",async ()=>{
  const fields = new Map();
  const get = id=>{
    if (!fields.has(id)) fields.set(id,{value:"",dataset:{},addEventListener(){}});
    return fields.get(id);
  };
  let context;
  const document = {getElementById:get,createElement:()=>({}),
    head:{append(script) { context.window.navermap_authFailure(); script.onload(); }}};
  context = vm.createContext({window:{},document,Intl,URL,AbortSignal,fetch:async()=>({ok:true,json:async()=>({live:false,mapKey:"mock"})}),setTimeout,clearTimeout});
  vm.runInContext(fs.readFileSync("ui.js","utf8"),context);
  await new Promise(resolve=>setImmediate(resolve));
  assert.match(get("mapMessage").textContent,/지도 인증 오류/);
  assert.equal(get("mapMessage").hidden,false);
  assert.equal(get("mode").value,"demo");
  assert.equal(get("work").value,"서울시청");
});