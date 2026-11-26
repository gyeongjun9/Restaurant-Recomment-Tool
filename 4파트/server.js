"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const {real, demo, search, validate, point, Problem} = require("./engine");

const local = name => path.resolve(__dirname, name);
if (fs.existsSync(local(".env"))) process.loadEnvFile(local(".env"));
const settings = process.env;
function read(file) {
  return JSON.parse(fs.readFileSync(local(file), "utf8").replace(/^\uFEFF/, ""));
}
const live = real(settings, read(settings.STATIONS_FILE || "stations.json"),
  settings.EVIDENCE_FILE ? read(settings.EVIDENCE_FILE) : {});
const files = {"/": ["index.html", "text/html"], "/index.html": ["index.html", "text/html"],
  "/ui.js": ["ui.js", "text/javascript"], "/style.css": ["style.css", "text/css"]};
const port = Number(settings.PORT || 3000);
let active = 0;
async function body(req) {
  if (!/^application\/json(?:;|$)/i.test(req.headers["content-type"] || "")) throw new Problem("JSON 요청이 필요합니다.", 415);
  let input = "";
  for await (const chunk of req.setEncoding("utf8")) {
    input += chunk;
    if (input.length > 12000) throw new Problem("입력 크기 한도를 넘었습니다.", 413);
  }
  try { return JSON.parse(input); } catch { throw new Problem("입력 형식을 확인하세요."); }
}
const server = http.createServer(async (req, res) => {
  function json(status, data) {
    res.writeHead(status, {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});
    res.end(JSON.stringify(data));
  }
  try {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET" && Object.hasOwn(files, url.pathname)) {
      const [file, type] = files[url.pathname];
      res.writeHead(200, {"Content-Type":type+"; charset=utf-8","X-Content-Type-Options":"nosniff"});
      res.end(fs.readFileSync(local(file)));
      return;
    }
    if (req.method === "GET" && url.pathname === "/health") return json(200, {status:"ok"});
    if (req.method === "GET" && url.pathname === "/api/config") {
      return json(200, {mapKey:settings.NAVER_MAP_PUBLIC_KEY || "", live:live.ready});
    }
    if (req.method !== "POST" || !["/api/address","/api/search"].includes(url.pathname)) throw new Problem("페이지를 찾을 수 없습니다.",404);
    if (req.headers.origin && ((!/^https?:\/\//.test(req.headers.origin)) || new URL(req.headers.origin).host !== req.headers.host)) {
      throw new Problem("같은 사이트에서 요청하세요.",403);
    }
    if (active >= 2) throw new Problem("동시 검색 한도에 도달했습니다. 잠시 후 다시 시도하세요.",429);
    active++;
    try {
      const input = await body(req);
      const provider = input?.mode === "demo" ? demo : live;
      if (url.pathname === "/api/address") {
        if (typeof input?.work !== "string" || !input.work.trim() || input.work.length > 150) throw new Problem("근무지 주소 또는 건물명을 확인하세요.");
        return json(200, await provider.address(input.work.trim()));
      }
      const options = validate(input);
      if (!point(input.address) || typeof input.address.address !== "string" || input.address.address.length > 200) throw new Problem("근무지 주소를 선택하세요.");
      json(200, await search(provider, options, input.address));
    } finally { active--; }
  } catch (error) {
    if (!res.headersSent) json(error instanceof Problem ? error.status : 500,
      {error:error instanceof Problem ? error.message : "검색 처리 중 오류가 발생했습니다."});
  }
});
server.listen(port, settings.HOST || "127.0.0.1", () =>
  console.log("회식 장소 검색 서버가 준비되었습니다. 포트 " + server.address().port));