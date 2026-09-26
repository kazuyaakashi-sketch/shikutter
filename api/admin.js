import { rpc, send, readBody, adminOk } from "./_lib.js";

// 運営用。ヘッダー x-admin-key に ADMIN_PASSWORD を入れて呼ぶ
// GET  /api/admin                        → { failures, kpis }
// POST /api/admin { action:"update", id, patch:{status?, moderation_status?} }
// POST /api/admin { action:"hide_dummies" } / { action:"delete_dummies" }
export default async function handler(req, res) {
  if (!adminOk(req)) return send(res, 401, { error: "unauthorized" });
  try {
    if (req.method === "GET") {
      const [failures, kpis] = await Promise.all([rpc("admin_list"), rpc("admin_kpis")]);
      return send(res, 200, { failures, kpis });
    }
    if (req.method === "POST") {
      const b = await readBody(req);
      if (b.action === "update") {
        const patch = {};
        if (["published", "hidden"].includes(b.patch?.status)) patch.status = b.patch.status;
        if (["unchecked", "approved", "needs_fix", "hidden"].includes(b.patch?.moderation_status)) patch.moderation_status = b.patch.moderation_status;
        const f = await rpc("admin_update", { fid: String(b.id || ""), patch });
        return send(res, 200, { failure: f });
      }
      if (b.action === "hide_dummies") return send(res, 200, { n: await rpc("admin_hide_dummies") });
      if (b.action === "delete_dummies") return send(res, 200, { n: await rpc("admin_delete_dummies") });
      return send(res, 400, { error: "bad_request" });
    }
    return send(res, 405, { error: "method_not_allowed" });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "server_error" });
  }
}
