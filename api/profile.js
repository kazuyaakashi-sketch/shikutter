import { rpc, send, readBody, AGES, JOBS } from "./_lib.js";

// POST /api/profile — 投稿直後に、任意で年代・職業を自分の投稿に追加する
// body: { id, device_id, age_group?, occupation? }
// 本人確認は delete と同じく device_id の一致だけで行う
export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  const b = await readBody(req);
  const fid = String(b.id || "").slice(0, 40);
  const dev = String(b.device_id || "").slice(0, 64);
  const age = AGES.includes(b.age_group) ? b.age_group : "";
  const job = JOBS.includes(b.occupation) ? b.occupation : "";
  if (!fid || !/^[A-Za-z0-9_-]{8,64}$/.test(dev) || (!age && !job)) return send(res, 400, { error: "bad_request" });
  try {
    const r = await rpc("set_own_profile", { fid, dev, age, job });
    if (r?.error === "not_found") return send(res, 404, { error: "not_found" });
    return send(res, 200, { ok: true });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "server_error" });
  }
}
