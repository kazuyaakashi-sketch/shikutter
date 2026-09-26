import { rpc, send } from "./_lib.js";

// GET /api/failures — タイムライン用（公開中のみ）
export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "method_not_allowed" });
  try {
    const list = await rpc("list_failures");
    return send(res, 200, { failures: list || [] });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "server_error" });
  }
}
