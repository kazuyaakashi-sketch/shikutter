import { rpc, send } from "./_lib.js";

// GET /api/health — 環境変数の設定状況とDB疎通を確認する（値そのものは返さない）
const ENV_KEYS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "ADMIN_PASSWORD", "SIGNING_SECRET", "IP_SALT"];

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "method_not_allowed" });
  const env = {};
  for (const k of ENV_KEYS) env[k] = !!process.env[k];
  const envOk = ENV_KEYS.every((k) => env[k]);

  let db = "ok";
  try {
    await rpc("list_failures");
  } catch (e) {
    db = "error: " + String(e && e.message ? e.message : e).slice(0, 200);
  }

  const ok = envOk && db === "ok";
  return send(res, ok ? 200 : 500, { ok, env, db });
}
