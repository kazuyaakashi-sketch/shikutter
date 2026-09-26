// 共通処理（_ で始まるファイルは Vercel の API ルートになりません）
// 現在はAIを使わず、回答をルールで整えて匿名化しています。
import crypto from "node:crypto";

export const CATS = ["仕事", "恋愛", "お金", "人間関係", "日常"];
export const LOSS = ["特になし", "お金", "信用", "仕事", "恋人", "友人", "モノ", "時間", "その他"];
export const STATUS = ["普通に生きてる", "普通に働いてる", "なんとかなった", "今では笑い話", "まだちょっと引きずってる", "まだ解決してない", "その他"];
export const SINCE = ["今日", "1週間以内", "1ヶ月以内", "1年以内", "それより前"];
export const AGES = ["10代", "20代", "30代", "40代", "50代以上", "秘密"];
export const JOBS = ["会社員", "学生", "経営者・フリーランス", "その他", "秘密"];

export const starsTxt = (n) => "★".repeat(+n || 0) + "☆".repeat(5 - (+n || 0));

/* ---------------- HTTP ---------------- */
export function send(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

export async function readBody(req) {
  if (req.body !== undefined && req.body !== null && req.body !== "") {
    if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
    if (Buffer.isBuffer(req.body)) { try { return JSON.parse(req.body.toString("utf8")); } catch { return {}; } }
    return req.body;
  }
  const chunks = [];
  let size = 0;
  for await (const c of req) { size += c.length; if (size > 200_000) break; chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { return {}; }
}

export function ipHash(req) {
  const xf = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = xf || req.socket?.remoteAddress || "unknown";
  return crypto.createHash("sha256").update(ip + "|" + (process.env.IP_SALT || "shikutter")).digest("hex").slice(0, 32);
}

/* ---------------- Supabase (PostgREST RPC) ---------------- */
export async function rpc(fn, args = {}) {
  if (globalThis.__SHK_RPC__) return globalThis.__SHK_RPC__(fn, args); // ローカルテスト用
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が設定されていません");
  const headers = { apikey: key, "Content-Type": "application/json" };
  if (!key.startsWith("sb_")) headers.Authorization = `Bearer ${key}`; // 旧形式(JWT)の service_role キー
  const r = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, { method: "POST", headers, body: JSON.stringify(args) });
  const text = await r.text();
  if (!r.ok) throw new Error(`Supabase ${fn} ${r.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

/* ---------------- 署名（AI編集結果の改ざん防止） ---------------- */
function secret() { return process.env.SIGNING_SECRET || process.env.IP_SALT || "shikutter-dev-secret"; }
export const sign = (s) => crypto.createHmac("sha256", secret()).update(s).digest("hex");
export function verify(s, sig) {
  const a = Buffer.from(sign(s)), b = Buffer.from(String(sig || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
export function adminOk(req) {
  const want = process.env.ADMIN_PASSWORD || "";
  const got = String(req.headers["x-admin-key"] || "");
  if (!want || want.length < 8) return false;
  const a = crypto.createHash("sha256").update(want).digest(), b = crypto.createHash("sha256").update(got).digest();
  return crypto.timingSafeEqual(a, b);
}

/* ---------------- 入力チェック ---------------- */
const str = (v, max) => (v == null ? "" : String(v)).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
const pick = (v, list) => (list.includes(v) ? v : "");
const score = (v) => { const n = Math.round(+v); return n >= 1 && n <= 5 ? n : 0; };

export function cleanAnswers(a = {}) {
  const out = {
    mistake_summary: str(a.mistake_summary, 80),
    context: str(a.context, 400),
    action: str(a.action, 400),
    result: str(a.result, 400),
    realization_moment: str(a.realization_moment, 400),
    inner_voice: str(a.inner_voice, 80),
    despair_score: score(a.despair_score),
    consequence: str(a.consequence, 400),
    loss_types: Array.isArray(a.loss_types) ? [...new Set(a.loss_types.filter((x) => LOSS.includes(x)))] : [],
    loss_amount: str(a.loss_amount, 30),
    loss_time: str(a.loss_time, 30),
    actual_damage_score: score(a.actual_damage_score),
    current_status: pick(a.current_status, STATUS),
    current_comment: str(a.current_comment, 160),
    category: pick(a.category, CATS),
    time_since: pick(a.time_since, SINCE),
    age_group: pick(a.age_group, AGES),
    occupation: pick(a.occupation, JOBS),
  };
  if (!out.loss_types.includes("お金")) out.loss_amount = "";
  if (!out.loss_types.includes("時間")) out.loss_time = "";
  // 必須は「一言・何が起きた・絶望度・実際のヤバさ・今どうしてる・ジャンル」の核となる6問だけ。
  // それ以外（心の声・失ったもの・いつの話？・状況・気づき・結末・今だから言える一言・年代/職業）は任意。
  const missing = [];
  if (!out.mistake_summary) missing.push("何をしくった？");
  if (!out.action) missing.push("何をして、どうなった？");
  if (!out.despair_score) missing.push("当時の絶望度");
  if (!out.actual_damage_score) missing.push("実際のヤバさ");
  if (!out.current_status) missing.push("今どうしてる？");
  if (!out.category) missing.push("ジャンル");
  return { answers: out, missing };
}

/* ---------------- 匿名化（ルールベースの最終チェック） ---------------- */
const SKIP = /^(皆|奥|お客|親御|娘|息子|姉|兄|妹|弟|母|父|大家|店員|駅員|担当|部長|課長|係長|社長|専務|先輩|先生|お姉|お兄|おば|おじ)/;
const PII_RULES = [
  [/[\w.+-]+@[\w-]+\.[\w.-]+/g, "（メールアドレス）"],
  [/0\d{1,4}-?\d{1,4}-?\d{3,4}/g, "（電話番号）"],
  [/@[A-Za-z0-9_]{3,15}/g, "（アカウント）"],
  [/https?:\/\/\S+/g, "（URL）"],
  [/(株式会社|有限会社|合同会社|\(株\)|（株）)[ァ-ヶーA-Za-z0-9＆&・一-龥]{1,15}|[ァ-ヶーA-Za-z0-9＆&・一-龥]{1,15}(株式会社|有限会社|合同会社|\(株\)|（株）)/g, "ある会社"],
  [/[一-龥ぁ-んァ-ヶ]{1,12}(小学校|中学校|高校|高等学校|大学|専門学校)/g, "ある学校"],
  [/(東京都|北海道|大阪府|京都府|[一-龥]{2,3}県)[一-龥]{1,6}[市区町村][^\s、。]{0,12}/g, "ある街"],
  [/[一-龥]{1,4}(部長|課長|係長|社長|専務|先輩|先生)/g, "$1"],
  [/[一-龥]{1,4}(さん|くん|ちゃん|様)/g, "ある人"],
];
export function piiScrub(t, log) {
  if (!t) return t || "";
  let out = String(t);
  for (const [re, rep] of PII_RULES) {
    const one = new RegExp(re.source);
    out = out.replace(re, (m) => {
      if (SKIP.test(m) && m.length <= 4) return m;
      const r = m.replace(one, rep);
      if (r !== m) log.push({ from: m, to: r });
      return r;
    });
  }
  return out;
}

/* ---------------- AI 編集 ---------------- */
const endS = (x) => (x ? (/[。！？!?」…]$/.test(x) ? x : x + "。") : "");

export function fallbackEdit(a) {
  const current_line = [a.current_status && a.current_status !== "その他" ? a.current_status + "。" : "", endS(a.current_comment)]
    .filter(Boolean).join(" ") || "普通に生きてます。";
  return {
    title: endS(a.mistake_summary),
    hook: endS(a.mistake_summary),
    setup: endS(a.context),
    story: [a.action, a.result, a.realization_moment].map(endS).filter(Boolean),
    inner_voice: a.inner_voice,
    consequence_text: endS(a.consequence),
    current_line,
    current_comment: a.current_comment,
    subcategory: [],
    pii: [],
    moderation: { ok: true, reason: "" },
    ai: false,
  };
}

/** 公開前に運営確認へ回す言葉（自傷・暴力・強い攻撃） */
const HOLD = /(死にたい|自殺|首を吊|死ね|殺す|殺し|ぶっ殺)/;
export function needsReview(a) {
  const text = [a.mistake_summary, a.context, a.action, a.result, a.realization_moment, a.inner_voice, a.consequence, a.current_comment].join("\n");
  return HOLD.test(text) ? "強い言葉が含まれているため、運営が確認してから公開します" : "";
}

/** まとめた文章を型・長さで整え、ルールベースの匿名化をかける */
export function normalizeEdited(ed, a) {
  const log = [];
  const s = (v, max) => piiScrub(str(v, max), log);
  const fb = fallbackEdit(a);
  const out = {
    title: s(ed.title, 80) || fb.title,
    hook: s(ed.hook, 120) || fb.hook,
    setup: s(ed.setup, 200),
    story: (Array.isArray(ed.story) ? ed.story : [ed.story]).map((x) => s(x, 200)).filter(Boolean).slice(0, 5),
    inner_voice: s(ed.inner_voice, 80) || piiScrub(a.inner_voice, log),
    consequence_text: s(ed.consequence_text, 240),
    current_line: s(ed.current_line, 160) || fb.current_line,
    current_comment: s(ed.current_comment, 160),
    subcategory: (Array.isArray(ed.subcategory) ? ed.subcategory : []).map((x) => str(x, 20)).filter(Boolean).slice(0, 3),
    moderation: { ok: !(ed.moderation && ed.moderation.ok === false), reason: str(ed.moderation && ed.moderation.reason, 120) },
    ai: !!ed.ai,
    tiktok: null,
    carousel: null,
    x_post: "",
  };
  if (!out.story.length) out.story = fb.story;
  if (ed.tiktok && typeof ed.tiktok === "object") {
    out.tiktok = {};
    for (const k of ["HOOK", "SETUP", "MISTAKE", "REALIZATION", "INNER_VOICE", "CONSEQUENCE", "CURRENT_STATUS", "ENDING", "CTA"]) out.tiktok[k] = s(ed.tiktok[k], 160);
  }
  if (Array.isArray(ed.carousel) && ed.carousel.length >= 6) out.carousel = ed.carousel.slice(0, 8).map((x) => s(x, 240));
  if (ed.x_post) out.x_post = s(ed.x_post, 280);
  const aiPii = (Array.isArray(ed.pii) ? ed.pii : []).filter((p) => p && p.from).map((p) => ({ from: str(p.from, 60), to: str(p.to, 60) }));
  const seen = new Set();
  out.pii = [...aiPii, ...log].filter((p) => !seen.has(p.from) && seen.add(p.from)).slice(0, 20);
  return out;
}

/* ---------------- SNS 文章 ---------------- */
export function buildSNS(p) {
  const D = starsTxt(p.despair_score), Ac = starsTxt(p.actual_damage_score);
  const story = p.story || [];
  const tk = p.tiktok && typeof p.tiktok === "object" ? { ...p.tiktok } : {
    HOOK: p.hook || p.title, SETUP: p.setup || "", MISTAKE: story[0] || "", REALIZATION: story.slice(1).join(" "),
    INNER_VOICE: `「${p.inner_voice}」`, CONSEQUENCE: p.consequence_text || "", CURRENT_STATUS: p.current_line || "",
    ENDING: "まあ、生きてる。", CTA: "あなたの「しくった」も教えて。",
  };
  tk.DESPAIR = D; tk.ACTUAL_DAMAGE = Ac;
  const order = ["HOOK", "SETUP", "MISTAKE", "REALIZATION", "INNER_VOICE", "DESPAIR", "CONSEQUENCE", "ACTUAL_DAMAGE", "CURRENT_STATUS", "ENDING", "CTA"];
  const tiktok_script = order.map((k) => `${k}：\n${tk[k] || ""}`).join("\n\n");

  let car = Array.isArray(p.carousel) && p.carousel.length >= 6 ? p.carousel.map(String).slice(0, 8) : null;
  if (car) {
    if (car[3] != null) car[3] += `\n\n当時の絶望度\n${D}`;
    if (car[5] != null) car[5] = `実際のヤバさ\n${Ac}\n${car[5]}`;
  } else {
    car = [p.hook || p.title, p.setup || "しくる前", story.join("\n"), `「${p.inner_voice}」\n\n当時の絶望度\n${D}`,
      `結局どうなった？\n${p.consequence_text || ""}`, `実際のヤバさ\n${Ac}`, `現在\n${p.current_line || ""}`, "まあ、生きてる。\n\nしくったら、シクッター。"];
  }
  const instagram_carousel = car.map((t, i) => `【${i + 1}枚目】\n${t}`).join("\n\n");
  const x_post = p.x_post || [p.title, `「${p.inner_voice}」と思った。`, `当時の絶望度：${D}`, p.consequence_text,
    `実際のヤバさ：${Ac}`, p.current_line, "まあ、生きてる。"].filter(Boolean).join("\n");
  const edited_story = [p.setup, ...story, `「${p.inner_voice}」`, `当時の絶望度 ${D}`, p.consequence_text,
    `実際のヤバさ ${Ac}`, p.current_line, "まあ、生きてる。"].filter(Boolean).join("\n\n");
  return { tiktok_script, instagram_carousel, x_post, edited_story };
}
