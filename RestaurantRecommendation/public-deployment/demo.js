"use strict";
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