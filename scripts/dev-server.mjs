// ローカル確認用サーバー（本番は Vercel が同じ役割をします）
// 使い方: DATABASE_URL=postgres://... node scripts/dev-server.mjs
//  - DATABASE_URL を指定すると Supabase の代わりにローカルの Postgres を直接使います
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = +process.env.PORT || 3000;

if (process.env.DATABASE_URL) {
  const { default: pg } = await import("pg");
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const SIG = {
    list_failures: [], admin_list: [], admin_kpis: [], admin_hide_dummies: [], admin_delete_dummies: [],
    create_failure: ["p::jsonb", "raw::jsonb", "ip::text", "dev::text"], react: ["fid::text", "dev::text", "t::text", "on_::boolean", "ip::text"],
    delete_own_failure: ["fid::text", "dev::text"], set_own_profile: ["fid::text", "dev::text", "age::text", "job::text"],
    log_events: ["s::text", "dev::text", "rows::jsonb"], log_ai_call: ["ip::text"], admin_update: ["fid::text", "patch::jsonb"],
  };
  globalThis.__SHK_RPC__ = async (fn, args) => {
    const params = SIG[fn].map((s) => s.split("::")[0]);
    const vals = params.map((p) => (typeof args[p] === "object" && args[p] !== null ? JSON.stringify(args[p]) : args[p]));
    const ph = SIG[fn].map((s, i) => `$${i + 1}::${s.split("::")[1]}`).join(",");
    const r = await pool.query(`select ${fn}(${ph}) as v`, vals);
    return r.rows[0].v;
  };
}
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json" };
// vercel.json の rewrites と同じ一覧にしておく
const REWRITE = [/^\/post$/, /^\/preview$/, /^\/thanks$/, /^\/admin$/, /^\/about$/, /^\/guidelines$/, /^\/failure\/[^/]+$/];

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname.startsWith("/api/")) {
    const name = url.pathname.slice(5).replace(/[^a-z]/g, "");
    const file = path.join(root, "api", name + ".js");
    if (!fs.existsSync(file)) { res.statusCode = 404; return res.end("not found"); }
    try { const mod = await import(pathToFileURL(file).href); return await mod.default(req, res); }
    catch (e) { console.error(e); res.statusCode = 500; return res.end("error"); }
  }
  let p = url.pathname === "/" || REWRITE.some((r) => r.test(url.pathname)) ? "/index.html" : url.pathname;
  const file = path.join(root, "public", path.normalize(p));
  if (!file.startsWith(path.join(root, "public")) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    // Vercel と同じく、存在しないページは public/404.html を 404 で返す
    res.statusCode = 404; res.setHeader("Content-Type", TYPES[".html"]);
    return fs.createReadStream(path.join(root, "public", "404.html")).pipe(res);
  }
  res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
