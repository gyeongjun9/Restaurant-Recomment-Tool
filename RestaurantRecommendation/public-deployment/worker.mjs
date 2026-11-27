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