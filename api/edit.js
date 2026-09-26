import { send, readBody, cleanAnswers, fallbackEdit, normalizeEdited, needsReview, sign } from "./_lib.js";

// POST /api/edit — 回答を失敗談の形に整え、匿名化してプレビュー用に返す（まだ保存しない）
// body: { answers }
export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  const body = await readBody(req);
  const { answers, missing } = cleanAnswers(body.answers);
  if (missing.length) return send(res, 400, { error: "missing", missing });
  const edited = fallbackEdit(answers);
  const hold = needsReview(answers);
  if (hold) edited.moderation = { ok: false, reason: hold };
  const out = normalizeEdited(edited, answers);
  const edited_json = JSON.stringify(out);
  return send(res, 200, { edited: out, edited_json, sig: sign(edited_json), note: "" });
}
