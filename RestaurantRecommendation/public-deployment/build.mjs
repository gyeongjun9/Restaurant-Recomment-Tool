import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from "node:fs";

const read = name => readFileSync(new URL(name,import.meta.url),"utf8");
const demo = read("demo.js");
const engine = read("engine.js").replace('require("./demo")', "demoModule");
const assets = Object.fromEntries([
  ["/",["index.html","text/html"]],["/index.html",["index.html","text/html"]],
  ["/style.css",["style.css","text/css"]],["/ui.js",["ui.js","text/javascript"]]
].map(([route,[file,type]]) => [route,[read(file),type]]));
const prefix = `const assets = ${JSON.stringify(assets)};
const stations = ${JSON.stringify(JSON.parse(read("stations.json")))};
const demoModule = (() => { const module = {exports:{}}; ${demo}\nreturn module.exports; })();
const {real,demo,search,validate,point,Problem} = (() => { const module = {exports:{}}; ${engine}\nreturn module.exports; })();\n`;
mkdirSync(new URL("dist/server/",import.meta.url),{recursive:true});
mkdirSync(new URL("dist/.openai/",import.meta.url),{recursive:true});
copyFileSync(new URL(".openai/hosting.json",import.meta.url),new URL("dist/.openai/hosting.json",import.meta.url));
writeFileSync(new URL("dist/server/index.js",import.meta.url),prefix+read("worker.mjs"));