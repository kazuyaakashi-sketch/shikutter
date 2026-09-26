import { rpc, send, readBody, ipHash } from "./_lib.js";

// POST /api/react — body: { fid, type: laugh|same|support, on: boolean, device_id }
export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  const b = await readBody(req);
  const fid = String(b.fid || "").slice(0, 40), dev = String(b.device_id || "").slice(0, 64);
  if (!fid || !/^[A-Za-z0-9_-]{8,64}$/.test(dev) || !["laugh", "same", "support"].includes(b.type)) {
    return send(res, 400, { error: "bad_request" });
  }
  try {
    const r = await rpc("react", { fid, dev, t: b.type, on_: !!b.on, ip: ipHash(req) });
    if (r?.error === "rate_limited") return send(res, 429, r);
    if (r?.error) return send(res, 404, r);
    return send(res, 200, { counts: r });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "server_error" });
  }
}
