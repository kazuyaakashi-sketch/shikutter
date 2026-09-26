import { rpc, send, readBody } from "./_lib.js";

// POST /api/delete — 自分の投稿を削除する
// body: { id, device_id }
// 本人確認は device_id の一致だけで行う（adminOk は不要）
export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  const b = await readBody(req);
  const fid = String(b.id || "").slice(0, 40);
  const dev = String(b.device_id || "").slice(0, 64);
  if (!fid || !/^[A-Za-z0-9_-]{8,64}$/.test(dev)) return send(res, 400, { error: "bad_request" });
  try {
    const r = await rpc("delete_own_failure", { fid, dev });
    if (r?.error === "not_found") return send(res, 404, { error: "not_found" });
    return send(res, 200, { ok: true });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "server_error" });
  }
}
