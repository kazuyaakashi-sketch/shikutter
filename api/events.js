import { rpc, send, readBody } from "./_lib.js";

// POST /api/events — body: { sid, device_id, events: [{name, fid?, props?}] }
// navigator.sendBeacon からも送れるように text/plain の JSON も受け付ける
export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  const b = await readBody(req);
  const sid = String(b.sid || "").slice(0, 64), dev = String(b.device_id || "").slice(0, 64);
  const rows = Array.isArray(b.events) ? b.events.slice(0, 50).map((e) => ({
    name: String(e?.name || "").slice(0, 40),
    fid: String(e?.fid || "").slice(0, 40),
    props: e?.props && typeof e.props === "object" ? JSON.parse(JSON.stringify(e.props).slice(0, 500) || "{}") : {},
  })) : [];
  if (!sid || !rows.length) return send(res, 400, { error: "bad_request" });
  try {
    const n = await rpc("log_events", { s: sid, dev, rows });
    return send(res, 200, { ok: true, n });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "server_error" });
  }
}
