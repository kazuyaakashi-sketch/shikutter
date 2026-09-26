import { rpc, send, readBody, ipHash, cleanAnswers, verify, buildSNS } from "./_lib.js";

// POST /api/post — プレビューで確認した内容を投稿する
// body: { answers, edited_json, sig }
export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  const body = await readBody(req);
  const { answers: a, missing } = cleanAnswers(body.answers);
  if (missing.length) return send(res, 400, { error: "missing", missing });
  if (typeof body.edited_json !== "string" || !verify(body.edited_json, body.sig)) {
    return send(res, 400, { error: "bad_signature" });
  }
  const ed = JSON.parse(body.edited_json);
  const ok = ed.moderation?.ok !== false;
  const doc = {
    title: ed.title, hook: ed.hook, setup: ed.setup, story: ed.story, inner_voice: ed.inner_voice,
    consequence_text: ed.consequence_text, current_line: ed.current_line, current_comment: ed.current_comment,
    despair_score: a.despair_score, actual_damage_score: a.actual_damage_score,
    loss_types: a.loss_types, loss_amount: a.loss_amount, loss_time: a.loss_time,
    current_status: a.current_status, category: a.category, subcategory: ed.subcategory || [],
    time_since: a.time_since, age_group: a.age_group, occupation: a.occupation,
    pii_detected: (ed.pii || []).length > 0, pii_removed: ed.pii || [],
    moderation_status: ok ? "unchecked" : "needs_fix", moderation_note: ok ? "" : ed.moderation.reason || "確認が必要です",
    status: ok ? "published" : "hidden", ai_used: !!ed.ai,
  };
  Object.assign(doc, buildSNS({ ...doc, tiktok: ed.tiktok, carousel: ed.carousel, x_post: ed.x_post }));
  const raw = {
    mistake_summary: a.mistake_summary, context: a.context, action: a.action, result: a.result,
    realization_moment: a.realization_moment, inner_voice: a.inner_voice, consequence: a.consequence,
    current_comment: a.current_comment, loss_amount: a.loss_amount, loss_time: a.loss_time,
  };
  try {
    const r = await rpc("create_failure", { p: doc, raw, ip: ipHash(req) });
    if (r?.error === "rate_limited") return send(res, 429, { error: "rate_limited" });
    return send(res, 200, { id: r.id, status: r.status });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "server_error" });
  }
}
