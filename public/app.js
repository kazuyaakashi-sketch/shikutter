/* シクッター フロントエンド（v3：テキスト中心のミニマルUI） */
(() => {
"use strict";

/* ============ 定数 ============ */
const CATS = ["仕事", "恋愛", "お金", "人間関係", "日常"];
const DESPAIR = [["😐", "まだいける"], ["😥", "ちょっとまずい"], ["😨", "かなりまずい"], ["😱", "終わったかも"], ["☠️", "完全に終わった"]];
const DAMAGE = [["🩹", "かすり傷"], ["🤕", "ちょっと痛い"], ["😵", "まあまあ痛い"], ["🚑", "けっこうヤバい"], ["🔥", "本当にヤバい"]];
const LOSS = ["特になし", "お金", "信用", "仕事", "恋人", "友人", "モノ", "時間", "その他"];
const STATUS = ["普通に生きてる", "普通に働いてる", "なんとかなった", "今では笑い話", "まだちょっと引きずってる", "まだ解決してない", "その他"];
const SINCE = ["今日", "1週間以内", "1ヶ月以内", "1年以内", "それより前"];
// 「いつの話？」の選択肢を、タイムラインで自然に読める経過時間に言い換える
const SINCE_LABEL = { "今日": "今日", "1週間以内": "数日前", "1ヶ月以内": "数週間前", "1年以内": "数ヶ月前", "それより前": "1年以上前" };
const AGES = ["10代", "20代", "30代", "40代", "50代以上", "秘密"];
const JOBS = ["会社員", "学生", "経営者・フリーランス", "その他", "秘密"];
const MOD = { unchecked: "未確認", approved: "公開OK", needs_fix: "要修正", hidden: "非公開" };
const RX = [["laugh", "😂", "笑った"], ["same", "🤝", "俺もある"], ["support", "🫂", "生きろ"]];
const TABS = [["all", "おすすめ"], ...CATS.map((c) => [c, c])];
const RELIEF_AFTER = 4;     // タイムラインで何件表示されたら「ちょっとマシになった？」を出すか
const EXCERPT = 72;         // タイムラインで見せる本文の文字数

// 投稿は5ステップ。1ステップの中に必須は1〜2問だけ。任意の項目は「くわしく書く」に畳んでいる。
const STEPS = [
  { id: "what", q: "何しくった？", hint: "まずは一言で。", fields: [
    { key: "mistake_summary", type: "text", max: 80, req: true, label: "何をしくった？", srLabel: true, ph: "例：取引先50社に社内メールを誤送信した" },
    { key: "category", type: "choice", options: CATS, req: true, label: "ジャンルは？" },
  ] },
  { id: "then", q: "そのときどうなった？", hint: "何をしてて、何が起きたか。ざっくりでOK。", fields: [
    { key: "action", type: "area", max: 400, req: true, label: "何が起きた？", ph: "例：宛先を確認せずに一斉送信して、取引先約50社に社内向けの内容が届いた" },
    { key: "inner_voice", type: "text", max: 80, label: "その瞬間、頭に浮かんだ言葉は？", sub: "「あの時」として表示されます。そのままの言葉でOK。", ph: "例：終わった。クビになる。" },
    { group: "くわしく書く", fields: [
      { key: "context", type: "area", max: 400, short: true, label: "しくる前、何してた？", ph: "例：新入社員で、社内向けの案内メールを作っていた" },
      { key: "realization_moment", type: "area", max: 400, short: true, label: "「しくった」って気づいた瞬間は？", ph: "例：送信済みフォルダを見た瞬間、血の気が引いた" },
    ] },
  ] },
  { id: "despair", q: "どんくらい終わったと思った？", hint: "その瞬間の気持ちで。", fields: [
    { key: "despair_score", type: "scale", scale: DESPAIR, req: true, label: "その瞬間の「終わった」度", srLabel: true, ends: ["まだいける", "完全に終わった"] },
  ] },
  { id: "result", q: "で、結局どうなった？", hint: "怒られた、謝った、意外と何もなかった…など。", fields: [
    { key: "consequence", type: "area", max: 400, req: true, label: "実際どうなった？", srLabel: true, ph: "例：上司と一緒に謝罪した。大きな損害はなかった" },
    { key: "actual_damage_score", type: "scale", scale: DAMAGE, req: true, label: "実際どれくらいヤバかった？", ends: ["かすり傷", "本当にヤバい"] },
    { group: "失ったものを書く", fields: [{ key: "loss_types", type: "loss", label: "実際、何を失った？" }] },
  ] },
  { id: "now", q: "今どうしてる？", hint: "「普通に生きてる」だけで十分です。", fields: [
    { key: "current_status", type: "choice", options: STATUS, req: true, label: "今どうしてる？", srLabel: true },
    { key: "time_since", type: "choice", options: SINCE, toggle: true, label: "それ、いつの話？" },
    { key: "current_comment", type: "text", max: 160, label: "今だから言える一言", ph: "例：宛先は2回見るようになりました" },
  ] },
];
const allFields = (st) => st.fields.flatMap((f) => (f.group ? f.fields : [f]));

/* ============ ユーティリティ ============ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const h = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function loadLS(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function loadSS(k) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function saveSS(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
const rid = (n) => { const a = new Uint8Array(n); (crypto.getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => a[i] = Math.random() * 256)); return Array.from(a, (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join(""); };
const starsTxt = (n) => "★".repeat(+n || 0) + "☆".repeat(5 - (+n || 0));
function toast(t, ms = 2600) { const el = $("#toast"); el.hidden = true; void el.offsetWidth; el.textContent = t; el.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => (el.hidden = true), ms); }
const fid2url = (id) => "/failure/" + encodeURIComponent(id);

function ago(iso) {
  const t = Date.parse(iso || ""); if (!t) return "たった今";
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 60) return "たった今";
  if (s < 3600) return Math.floor(s / 60) + "分前";
  if (s < 86400) return Math.floor(s / 3600) + "時間前";
  if (s < 86400 * 30) return Math.floor(s / 86400) + "日前";
  const d = new Date(t); return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
// メタ情報の経過時間：「いつの話？」があればそれ（失敗した時期）、なければ投稿からの時間
const whenText = (f) => SINCE_LABEL[f.time_since] || ago(f.created_at);
const storyText = (f) => [f.setup, ...(f.story || [])].filter(Boolean).join("");
function excerpt(t, n) {
  if (t.length <= n) return { text: t, cut: false };
  let s = t.slice(0, n); const i = Math.max(s.lastIndexOf("。"), s.lastIndexOf("、"));
  if (i > n * 0.6) s = s.slice(0, i + 1);
  return { text: s.replace(/[、。]$/, "") + "…", cut: true };
}
// 「あの時」「実際」が空のときも、選んだ段階の言葉で自然な文にする
const thenText = (f) => (f.inner_voice ? `「${f.inner_voice}」` : DESPAIR[f.despair_score - 1] ? `「${DESPAIR[f.despair_score - 1][1]}」と思った。` : "");
const actualText = (f) => f.consequence_text || (DAMAGE[f.actual_damage_score - 1] ? `実際のダメージは「${DAMAGE[f.actual_damage_score - 1][1]}」くらいだった。` : "");
const nowText = (f) => f.current_line || f.current_status || "普通に生きてます。";

async function api(path, { method = "GET", body, headers = {}, signal } = {}) {
  const r = await fetch(path, {
    method, signal, cache: "no-store",
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  let j = null;
  try { j = await r.json(); } catch (e) {}
  if (!r.ok) { const err = new Error((j && j.error) || "http_" + r.status); err.status = r.status; err.data = j; throw err; }
  return j;
}

/* ============ 状態 ============ */
const DEVICE = (() => { let d = loadLS("shk_dev"); if (!d) { d = "d" + rid(23); saveLS("shk_dev", d); } return d; })();
const SID = (() => { let s = loadSS("shk_sid"); if (!s) { s = "s" + Date.now().toString(36) + rid(6); saveSS("shk_sid", s); } return s; })();
const sessSaved = loadSS("shk_sess") || {};
const S = {
  failures: [], loaded: false, error: false, loadedAt: 0,
  my: loadLS("shk_react") || {}, inflight: new Set(),
  filter: "all", draft: loadLS("shk_draft") || {}, step: 0, flowStarted: false, preview: null, lastPosted: loadSS("shk_last") || null,
  adminKey: loadSS("shk_admin") || "", admin: null, adminTab: "all", adminErr: "",
  homeScroll: 0, lastRoute: null, navCount: 0,
};
const MYPOSTS = new Set(loadLS("shk_mine") || []);
const A = {
  imp: new Set(sessSaved.imp || []), read: new Set(sessSaved.read || []), open: new Set(sessSaved.open || []),
  reliefDone: !!sessSaved.reliefDone, reliefAt: null, reliefThanks: null,
};
function saveSess() { saveSS("shk_sess", { imp: [...A.imp], read: [...A.read], open: [...A.open], reliefDone: A.reliefDone }); }
function saveDraft() { saveLS("shk_draft", S.draft); }

/* ============ 計測 ============ */
const Q = [];
let qTimer = null;
function track(name, fid, props) {
  Q.push({ name, fid: fid || "", props: props || {} });
  saveSess();
  clearTimeout(qTimer);
  if (Q.length >= 20) flush(); else qTimer = setTimeout(flush, 4000);
}
function flush(useBeacon) {
  if (!Q.length) return;
  const events = Q.splice(0, 50);
  const payload = JSON.stringify({ sid: SID, device_id: DEVICE, events });
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon("/api/events", new Blob([payload], { type: "text/plain" }));
  } else {
    fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
  }
  if (Q.length) setTimeout(flush, 500);
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(true); });
window.addEventListener("pagehide", () => flush(true));

let io = null;
const readTimers = new Map();
function observePosts() {
  if (!("IntersectionObserver" in window)) return;
  if (io) io.disconnect();
  io = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      const fid = en.target.dataset.fid;
      if (en.isIntersecting && en.intersectionRatio >= 0.5) {
        if (!A.imp.has(fid)) { A.imp.add(fid); track("failure_impression", fid); maybeRelief(fid); }
        if (!A.read.has(fid) && !readTimers.has(fid)) readTimers.set(fid, setTimeout(() => { readTimers.delete(fid); markRead(fid); }, 2500));
      } else if (readTimers.has(fid)) { clearTimeout(readTimers.get(fid)); readTimers.delete(fid); }
    });
  }, { threshold: [0, 0.5, 1] });
  $$(".post[data-fid]").forEach((c) => io.observe(c));
}
function markRead(fid) {
  if (A.read.has(fid)) return;
  A.read.add(fid);
  track("failure_read", fid);
}

/* ============ データ ============ */
async function loadFailures() {
  try {
    const j = await api("/api/failures");
    S.failures = j.failures || [];
    S.error = false; S.loadedAt = Date.now();
  } catch (e) { S.error = true; }
  S.loaded = true;
  const r = route().name;
  if (r === "home" || r === "detail") render(true);
}

/* ============ 投稿の表示（タイムライン・詳細・プレビュー共通） ============ */
function counts(f) { return { laugh: f.laugh_count || 0, same: f.same_count || 0, support: f.support_count || 0 }; }
function rxHtml(f, withLabel) {
  const c = counts(f), mine = S.my[f.id] || {};
  return `<div class="rxs" role="group" aria-label="リアクション">${RX.map(([k, e, l]) =>
    `<button type="button" class="rx" data-rx="${k}" data-fid="${h(f.id)}" aria-pressed="${!!mine[k]}" title="${l}"><span class="e" aria-hidden="true">${e}</span>${withLabel ? `<span class="lbl">${l}</span>` : `<span class="sr">${l}</span>`}<span class="n">${c[k]}</span></button>`).join("")}</div>`;
}
function echoHtml(f) {
  // 自分の投稿にだけ「俺もある」の数を伝える（ログイン不要・同じ端末のみ）
  if (!f.id || !MYPOSTS.has(f.id) || !(f.same_count > 0)) return "";
  return `<p class="echo">あなたのしくったに、<b>${f.same_count}人</b>が「俺もある」と思いました。</p>`;
}
/**
 * 投稿1件。mode: "tl"（タイムライン・抜粋）/ "detail"（全文）/ "preview"（全文・リアクションなし）
 */
function postHtml(f, mode) {
  const full = mode !== "tl";
  const mine = f.id && MYPOSTS.has(f.id);
  const meta = `<div class="meta"><span>${h(f.category)}</span><span class="dotsep" aria-hidden="true">·</span><span>${h(whenText(f))}</span>${mine ? `<span class="dotsep" aria-hidden="true">·</span><span class="mine">あなたの投稿</span>` : ""}</div>`;
  const TitleTag = mode === "detail" ? "h1" : "h2";
  const title = mode === "tl"
    ? `<h2 class="p-title"><a href="${fid2url(f.id)}">${h(f.title)}</a></h2>`
    : `<${TitleTag} class="p-title">${h(f.title)}</${TitleTag}>`;
  let body = "";
  if (full) {
    body = [f.setup, ...(f.story || [])].filter(Boolean).map((p) => `<p class="p-body">${h(p)}</p>`).join("");
  } else {
    const ex = excerpt(storyText(f), EXCERPT);
    if (ex.text) body = `<p class="p-body">${h(ex.text)}${ex.cut ? ` <a class="more" href="${fid2url(f.id)}" tabindex="-1">続きを読む</a>` : ""}</p>`;
  }
  const arc = `<dl class="arc">
      <div class="then"><dt>あの時</dt><dd>${h(thenText(f))}</dd></div>
      <div class="actual"><dt>実際</dt><dd>${h(actualText(f))}</dd></div>
      <div class="now"><dt>現在</dt><dd>${h(nowText(f))}</dd></div>
    </dl>`;
  if (mode === "preview") return `<article class="post">${meta}${title}${body}${arc}</article>`;
  if (mode === "detail") {
    const loss = (f.loss_types || []).filter((x) => x !== "特になし").map((x) => {
      let t = x; if (x === "お金" && f.loss_amount) t += `（${f.loss_amount}）`; if (x === "時間" && f.loss_time) t += `（${f.loss_time}）`; return t;
    });
    const d = +f.despair_score || 0, a = +f.actual_damage_score || 0, g = d - a;
    const facts = [
      d && a ? `<span>当時の絶望度 <b>${d}/5</b>（${DESPAIR[d - 1][1]}） → 実際のヤバさ <b>${a}/5</b>（${DAMAGE[a - 1][1]}）</span>` : "",
      d && a ? `<span>${g > 0 ? `思ってたより${g}段階マシだった。` : g === 0 ? "思ったとおりのヤバさだった。" : "思ってたよりヤバかった。それでも生きてる。"}</span>` : "",
      loss.length ? `<span>失ったもの：${h(loss.join("、"))}</span>` : "",
    ].filter(Boolean).join("");
    return `<article class="detail" data-fid-detail="${h(f.id)}">${meta}${title}${body}${arc}
      ${facts ? `<div class="facts">${facts}</div>` : ""}
      ${rxHtml(f, true)}${echoHtml(f)}
      <span id="read-sentinel" style="display:block;height:1px"></span>
    </article>`;
  }
  return `<article class="post link" data-fid="${h(f.id)}">${meta}${title}${body}${arc}${rxHtml(f)}${echoHtml(f)}</article>`;
}

/* ============ リアクション ============ */
function refreshRx() {
  $$(".rx[data-fid]").forEach((b) => {
    const f = S.failures.find((x) => x.id === b.dataset.fid); if (!f) return;
    b.querySelector(".n").textContent = counts(f)[b.dataset.rx];
    b.setAttribute("aria-pressed", !!(S.my[f.id] && S.my[f.id][b.dataset.rx]));
  });
}
async function toggleReact(fid, k, btn) {
  const key = fid + ":" + k;
  if (S.inflight.has(key)) return;
  const f = S.failures.find((x) => x.id === fid); if (!f) return;
  S.my[fid] = S.my[fid] || {};
  const on = !S.my[fid][k];
  const apply = (dir) => {
    if (dir) S.my[fid][k] = 1; else delete S.my[fid][k];
    f[k + "_count"] = Math.max(0, (f[k + "_count"] || 0) + (dir ? 1 : -1));
    saveLS("shk_react", S.my); refreshRx();
  };
  apply(on);
  if (btn && on) { btn.classList.add("pop"); setTimeout(() => btn.classList.remove("pop"), 180); }
  if (on && k === "same") toast(`あなたで${f.same_count}人目の「俺もある」。`);
  if (on) { track("reaction_" + k, fid); markRead(fid); }
  S.inflight.add(key);
  try {
    const j = await api("/api/react", { method: "POST", body: { fid, type: k, on, device_id: DEVICE } });
    if (j && j.counts) { f.laugh_count = j.counts.laugh; f.same_count = j.counts.same; f.support_count = j.counts.support; refreshRx(); }
  } catch (e) {
    apply(!on);
    toast(e.status === 429 ? "リアクションが多すぎるので、少し時間をおいてください" : "リアクションを送れませんでした");
  }
  S.inflight.delete(key);
}

/* ============ ルーティング ============ */
const ROUTES = { "/": "home", "/post": "post", "/preview": "preview", "/thanks": "thanks", "/admin": "admin", "/about": "about", "/guidelines": "guidelines" };
function route() {
  const p = location.pathname.replace(/\/+$/, "") || "/";
  if (p.startsWith("/failure/")) return { name: "detail", id: decodeURIComponent(p.slice(9)) };
  return { name: ROUTES[p] || "notfound" };
}
function go(path, replace) {
  if (route().name === "home") S.homeScroll = window.scrollY;
  if (location.pathname !== path) { history[replace ? "replaceState" : "pushState"](null, "", path); if (!replace) S.navCount++; }
  render();
  window.scrollTo(0, 0);
}
window.addEventListener("popstate", () => {
  S.navCount = Math.max(0, S.navCount - 1);
  render();
  if (route().name === "home") requestAnimationFrame(() => window.scrollTo(0, S.homeScroll)); else window.scrollTo(0, 0);
});

const TITLES = { post: "しくったを投稿", preview: "投稿の確認", thanks: "しくった認定", about: "シクッターとは", guidelines: "コミュニティガイドライン", admin: "運営管理", notfound: "ページが見つかりません" };
function render(fromData) {
  const r = route();
  const mm = $("#mobile-menu"), mb = $("#menu-btn");
  if (mm) mm.hidden = true;
  if (mb) { mb.setAttribute("aria-expanded", "false"); mb.setAttribute("aria-label", "メニューを開く"); }
  if (r.name !== S.lastRoute) {
    S.lastRoute = r.name;
    if (r.name === "home") track("timeline_view");
    A.reliefThanks = null;
  }
  const flow = ["post", "preview", "thanks"].includes(r.name);
  $("#hd").hidden = r.name === "admin";
  $("#hd-cta").hidden = flow;
  $("#ft").hidden = flow || r.name === "admin";
  if (r.name === "home") renderHome();
  else if (r.name === "detail") renderDetail(r.id);
  else if (fromData) return;
  else if (r.name === "post") renderPost();
  else if (r.name === "preview") renderPreview();
  else if (r.name === "thanks") renderThanks();
  else if (r.name === "admin") renderAdmin();
  else if (r.name === "about") renderAbout();
  else if (r.name === "guidelines") renderGuidelines();
  else renderNotFound();
  if (r.name !== "detail") document.title = r.name === "home" ? "シクッター｜しくったら、シクッター。" : `${TITLES[r.name] || ""}｜シクッター`;
  if (r.name === "home" && Date.now() - S.loadedAt > 60000 && S.loaded && !fromData) loadFailures();
}

/* ============ ホーム ============ */
function renderHome() {
  const list = S.failures.filter((f) => S.filter === "all" || f.category === S.filter);
  let feed;
  if (!S.loaded) feed = `<div class="sk" aria-hidden="true"><i style="width:30%"></i><i style="width:80%"></i><i></i><i style="width:60%"></i></div>`.repeat(3) + `<p class="sr" role="status">読み込み中</p>`;
  else if (S.error && !S.failures.length) feed = `<div class="empty">読み込めませんでした。通信状況を確認してください。<button class="btn sec sm" data-reload>もう一度読み込む</button></div>`;
  else if (!list.length) feed = `<div class="empty">このジャンルのしくったは、まだありません。<a class="btn sec sm" href="/post" data-post-entry>最初のしくったを投稿</a></div>`;
  else feed = list.map((f) => postHtml(f, "tl")).join("");
  $("#app").innerHTML = `
    <section class="lead">
      <h1>しくったら、シクッター。</h1>
      <p>みんなの「しくった」を見たり、あなたの「しくった」を投稿して、ちょっとだけ気持ちを軽くしよう。</p>
    </section>
    <div class="tabs" role="tablist" aria-label="ジャンル">
      ${TABS.map(([v, l]) => `<button type="button" class="tab" role="tab" id="tab-${h(v)}" data-filter="${h(v)}" aria-selected="${S.filter === v}" aria-controls="feed" tabindex="${S.filter === v ? 0 : -1}">${h(l)}</button>`).join("")}
    </div>
    <section class="feed" id="feed" role="tabpanel" aria-labelledby="tab-${h(S.filter)}" aria-busy="${!S.loaded}">${feed}</section>`;
  placeRelief();
  observePosts();
}

/* ============ ちょっとマシになった？（タイムラインの中に1回だけ） ============ */
function reliefHtml() {
  if (A.reliefThanks) {
    return `<section class="relief done" aria-live="polite">
      <h2>回答ありがとう。</h2>
      <p>${A.reliefThanks === "worse" ? "教えてくれてありがとう。無理して見なくても大丈夫です。しんどさが続くときは、信頼できる人や相談窓口に話してみてください。" : "もうちょっと、しくった話を見てく？"}</p>
    </section>`;
  }
  return `<section class="relief" aria-labelledby="relief-h">
    <h2 id="relief-h">ちょっとマシになった？</h2>
    <p>シクッターを開いたときより、今の気持ちはどう？</p>
    <div class="relief-opts">
      <button type="button" data-relief="better"><span class="e" aria-hidden="true">😌</span>ちょっとマシ</button>
      <button type="button" data-relief="same"><span class="e" aria-hidden="true">😐</span>変わらない</button>
      <button type="button" data-relief="worse"><span class="e" aria-hidden="true">😵</span>まだしんどい</button>
    </div>
    <button type="button" class="linkbtn x" data-relief-x>今は答えない</button>
  </section>`;
}
function placeRelief() {
  $$(".relief").forEach((x) => x.remove());
  if (!A.reliefAt || (A.reliefDone && !A.reliefThanks) || route().name !== "home") return;
  const posts = $$("#feed .post[data-fid]"); if (!posts.length) return;
  const anchor = posts.find((p) => p.dataset.fid === A.reliefAt) || posts[Math.min(RELIEF_AFTER, posts.length) - 1];
  anchor.insertAdjacentHTML("afterend", reliefHtml());
}
function maybeRelief(fid) {
  if (A.reliefDone || A.reliefAt || A.imp.size < RELIEF_AFTER || route().name !== "home") return;
  A.reliefAt = fid;
  track("relief_prompt_view", "", { imps: A.imp.size });
  placeRelief();
}
function answerRelief(v) {
  A.reliefDone = true; A.reliefThanks = v;
  track("relief_answer", "", { v, imps: A.imp.size, reads: A.read.size });
  flush();
  const el = $(".relief"); if (el) el.outerHTML = reliefHtml();
}

/* ============ 詳細 ============ */
function renderDetail(id) {
  const f = S.failures.find((x) => x.id === id);
  const bar = `<div class="subbar"><button type="button" class="back" data-back aria-label="戻る">←</button><span class="t">しくった</span></div>`;
  if (!f) {
    $("#app").innerHTML = `${bar}<div class="empty">${S.loaded ? "このしくったは見つかりませんでした。<a class=\"textlink\" href=\"/\">みんなのしくったに戻る</a>" : "読み込み中…"}</div>`;
    return;
  }
  document.title = `${f.title}｜シクッター`;
  if (!A.open.has(id)) { A.open.add(id); track("failure_open", id); }
  const others = S.failures.filter((x) => x.id !== id && x.category === f.category).slice(0, 3);
  const mine = MYPOSTS.has(id);
  $("#app").innerHTML = `${bar}
    ${postHtml(f, "detail")}
    ${mine ? `<div class="own"><button type="button" class="linkbtn" data-delete-post="${h(id)}">この投稿を削除</button></div>` : ""}
    ${others.length ? `<h2 class="sec-h">似たしくったを見る</h2><div class="feed">${others.map((x) => postHtml(x, "tl")).join("")}</div>` : ""}`;
  if ("IntersectionObserver" in window) {
    const o = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { markRead(id); o.disconnect(); } });
    o.observe($("#read-sentinel"));
  }
  observePosts();
}

/* ============ 投稿フロー（5ステップ） ============ */
const filled = (v) => (Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== "");
const stepValid = (st) => allFields(st).every((f) => !f.req || filled(S.draft[f.key]));
function countCls(len, max) { const r = max ? len / max : 0; return r >= 1 ? "danger" : r >= 0.9 ? "warn" : ""; }
function fieldHtml(f) {
  const v = S.draft[f.key];
  const id = "in-" + f.key;
  const lab = (tag) => (f.srLabel ? `<${tag === "label" ? `label for="${id}"` : "span"} class="sr">${h(f.label)}</${tag}>`
    : `<${tag === "label" ? `label for="${id}"` : `span class="lbl" id="lb-${f.key}"`}>${h(f.label)}${f.req ? "" : '<span class="opt-tag">任意</span>'}</${tag}>`);
  const sub = f.sub ? `<p class="sub">${h(f.sub)}</p>` : "";
  if (f.type === "text" || f.type === "area") {
    const len = (v || "").length;
    const input = f.type === "text"
      ? `<input id="${id}" class="field" type="text" data-key="${f.key}" maxlength="${f.max}" value="${h(v || "")}" placeholder="${h(f.ph || "")}" autocomplete="off" enterkeyhint="done" aria-describedby="cnt-${f.key}"${f.req ? ' aria-required="true"' : ""}>`
      : `<textarea id="${id}" class="field${f.short ? " short" : ""}" data-key="${f.key}" maxlength="${f.max}" placeholder="${h(f.ph || "")}" aria-describedby="cnt-${f.key}"${f.req ? ' aria-required="true"' : ""}>${h(v || "")}</textarea>`;
    return `<div class="fld">${lab("label")}${sub}${input}<span class="count ${countCls(len, f.max)}" id="cnt-${f.key}" aria-live="off">${len} / ${f.max}</span></div>`;
  }
  if (f.type === "choice") {
    return `<div class="fld">${lab("span")}<div class="chips" role="group" aria-label="${h(f.label)}">${f.options.map((o) =>
      `<button type="button" class="chip" data-choice="${f.key}" data-val="${h(o)}"${f.toggle ? " data-toggle" : ""} aria-pressed="${v === o}">${h(o)}</button>`).join("")}</div></div>`;
  }
  if (f.type === "scale") {
    const cur = f.scale[(+v || 0) - 1];
    return `<div class="fld">${lab("span")}<div class="scale" role="radiogroup" aria-label="${h(f.label)}">${f.scale.map(([e, w], i) =>
      `<button type="button" role="radio" data-scale="${f.key}" data-val="${i + 1}" aria-checked="${+v === i + 1}" tabindex="${(+v || 1) === i + 1 ? 0 : -1}" aria-label="${i + 1}：${h(w)}"><span class="e" aria-hidden="true">${e}</span><span class="w" aria-hidden="true">${i + 1}</span></button>`).join("")}</div>
      <div class="scale-ends" aria-hidden="true"><span>← ${h(f.ends[0])}</span><span>${h(f.ends[1])} →</span></div>
      <p class="scale-now${cur ? "" : " empty"}" id="now-${f.key}" aria-live="polite">${cur ? `${cur[0]} ${h(cur[1])}` : "近いものをえらんでね"}</p></div>`;
  }
  if (f.type === "loss") {
    const sel = v || [];
    return `<div class="fld">${lab("span")}<div class="chips" role="group" aria-label="${h(f.label)}">${LOSS.map((o) =>
      `<button type="button" class="chip" data-loss="${h(o)}" aria-pressed="${sel.includes(o)}">${h(o)}</button>`).join("")}</div></div>
      <div class="fld" id="wrap-loss_amount"${sel.includes("お金") ? "" : " hidden"}><label for="in-loss_amount">だいたいいくら？<span class="opt-tag">任意</span></label><input id="in-loss_amount" class="field" type="text" data-key="loss_amount" maxlength="30" placeholder="例：3万円くらい" value="${h(S.draft.loss_amount || "")}"></div>
      <div class="fld" id="wrap-loss_time"${sel.includes("時間") ? "" : " hidden"}><label for="in-loss_time">どれくらいの時間？<span class="opt-tag">任意</span></label><input id="in-loss_time" class="field" type="text" data-key="loss_time" maxlength="30" placeholder="例：丸一日" value="${h(S.draft.loss_time || "")}"></div>`;
  }
  return "";
}
function renderPost() {
  S.step = Math.min(Math.max(0, S.step | 0), STEPS.length - 1);
  if (!S.flowStarted) { S.flowStarted = true; track("post_start"); }
  const st = STEPS[S.step], n = S.step + 1, tot = STEPS.length, last = n === tot;
  const hasDraft = S.step === 0 && Object.values(S.draft).some(filled);
  const body = st.fields.map((f) => {
    if (!f.group) return fieldHtml(f);
    const open = f.fields.some((x) => filled(S.draft[x.key]));
    return `<details class="more-fields"${open ? " open" : ""}><summary>${h(f.group)}<span class="opt-tag mut" style="font-weight:400;font-size:13px">任意</span></summary><div class="inner">${f.fields.map(fieldHtml).join("")}</div></details>`;
  }).join("");
  $("#app").innerHTML = `
    <div class="flowbar">
      <button type="button" class="back" data-step-back aria-label="${S.step === 0 ? "投稿をやめて戻る" : "前のステップへ"}">←</button>
      <span class="stepn" aria-label="${tot}ステップ中${n}ステップ目"><b>${n}</b> / ${tot}</span>
    </div>
    <div class="prog" aria-hidden="true"><i style="width:${(n / tot) * 100}%"></i></div>
    <section class="step">
      <div>
        <h1 tabindex="-1" id="step-h">${h(st.q)}</h1>
        ${st.hint ? `<p class="hint">${h(st.hint)}</p>` : ""}
      </div>
      ${hasDraft ? `<p class="resume">書きかけの内容から再開しています。<button type="button" class="linkbtn" data-reset-draft>消して最初から</button></p>` : ""}
      ${body}
      <p class="safe">🔒 名前や会社名は書かなくてOK。公開前に、個人を特定できる情報がないか確認します。<a href="/guidelines" target="_blank" rel="noopener">ガイドライン</a></p>
    </section>
    <div class="actions">
      <button type="button" class="btn wide" id="next-btn" data-step-next ${stepValid(st) ? "" : "disabled"}>${last ? "まとめて確認する" : "次へ"}</button>
    </div>`;
}
function syncNext() { const b = $("#next-btn"); if (b) b.disabled = !stepValid(STEPS[S.step]); }
function stepTo(i) {
  S.step = i; renderPost(); window.scrollTo(0, 0);
  const hd = $("#step-h"); if (hd) hd.focus({ preventScroll: true });
}
function nextStep() {
  const st = STEPS[S.step];
  if (!stepValid(st)) return;
  track("post_step_complete", "", { step: st.id, n: S.step + 1 });
  if (S.step < STEPS.length - 1) stepTo(S.step + 1);
  else generate();
}

/* ============ まとめ（ルールベース） ============ */
async function generate() {
  $("#app").innerHTML = `<section class="gen" aria-live="polite"><b>あなたの「しくった」をまとめています…</b><span class="mut">名前や会社名を伏せています</span></section>`;
  const ctrl = new AbortController();
  const hard = setTimeout(() => ctrl.abort(), 20000);
  let res = null, err = null;
  try { res = await api("/api/edit", { method: "POST", body: { answers: S.draft }, signal: ctrl.signal }); }
  catch (e) { err = e; }
  clearTimeout(hard);
  if (route().name !== "post") return;
  if (err) {
    if (err.data && err.data.missing) {
      toast("まだ答えていない質問があります");
      return stepTo(Math.max(0, STEPS.findIndex((s) => !stepValid(s))));
    }
    $("#app").innerHTML = `<section class="gen"><b>うまくまとめられませんでした。</b><span class="mut">通信状況を確認して、もう一度お試しください。回答は残っています。</span><div><button type="button" class="btn" data-regen>もう一度まとめる</button></div></section>`;
    return;
  }
  S.preview = res;
  go("/preview");
}
function previewObj() {
  const d = S.draft, p = S.preview.edited;
  return {
    category: d.category, time_since: d.time_since, created_at: new Date().toISOString(),
    title: p.title, setup: p.setup, story: p.story, inner_voice: p.inner_voice,
    consequence_text: p.consequence_text, current_line: p.current_line, current_status: d.current_status,
    despair_score: +d.despair_score, actual_damage_score: +d.actual_damage_score,
  };
}
function renderPreview() {
  if (!S.preview) return go("/post", true);
  track("post_preview");
  const p = S.preview.edited, pii = p.pii || [];
  $("#app").innerHTML = `
    <div class="flowbar"><button type="button" class="back" data-edit="4" aria-label="修正する">←</button><span class="stepn">確認</span></div>
    <h1 class="pv-h">あなたの「しくった」をまとめました。</h1>
    <p class="pv-sub">タイムラインでは、こんなふうに表示されます。</p>
    <div class="pv">${postHtml(previewObj(), "preview")}</div>
    <div class="notes">
      ${pii.length ? `<p>🔒 特定につながりそうな言葉を置き換えました：${pii.slice(0, 6).map((x) => `「${h(x.from)}」→「${h(x.to)}」`).join("、")}</p>` : `<p>🔒 個人を特定できそうな言葉は見つかりませんでした。</p>`}
      ${p.moderation && p.moderation.ok === false ? `<p class="warn">${h(p.moderation.reason || "内容を確認してから公開します")}</p>` : ""}
    </div>
    <p class="only">公開されるのはこの内容だけです。</p>
    <div class="pv-actions">
      <button type="button" class="btn sec" data-edit="0">修正する</button>
      <button type="button" class="btn" data-publish>この内容で投稿する</button>
    </div>
    <nav class="pv-jump" aria-label="項目をえらんで直す"><span>項目をえらんで直す：</span>${["何しくった", "そのとき", "終わった度", "結局", "今"].map((l, i) => `<button type="button" class="jl" data-edit="${i}">${l}</button>`).join('<span aria-hidden="true">·</span>')}</nav>`;
}
async function publish(btn) {
  btn.disabled = true; btn.textContent = "投稿しています…";
  try {
    const r = await api("/api/post", { method: "POST", body: { answers: S.draft, edited_json: S.preview.edited_json, sig: S.preview.sig, device_id: DEVICE } });
    MYPOSTS.add(r.id); saveLS("shk_mine", [...MYPOSTS]);
    track("post_complete", r.id, { status: r.status });
    flush();
    S.lastPosted = { id: r.id, ok: r.status === "published", profile: null };
    saveSS("shk_last", S.lastPosted);
    S.draft = {}; saveDraft(); S.preview = null; S.step = 0; S.flowStarted = false;
    S.filter = "all";
    loadFailures();
    go("/thanks", true);
  } catch (e) {
    btn.disabled = false; btn.textContent = "この内容で投稿する";
    toast(e.status === 429 ? "短い時間に投稿が続いています。少し時間をおいてください。" : e.message === "bad_signature" ? "内容の確認に失敗しました。「修正する」から、もう一度まとめてください。" : "投稿を保存できませんでした。もう一度お試しください。", 4000);
  }
}

/* ============ 投稿完了 ============ */
function renderThanks() {
  const lp = S.lastPosted;
  if (!lp) return go("/", true);
  track("post_complete_view", lp.id);
  const prof = lp.profile; // null=未回答 / "done" / "skip"
  const choice = (key, list) => `<div class="chips" role="group" aria-labelledby="pl-${key}">${list.map((o) =>
    `<button type="button" class="chip" data-prof="${key}" data-val="${h(o)}" aria-pressed="false">${h(o)}</button>`).join("")}</div>`;
  $("#app").innerHTML = `
    <h1 class="done-h" tabindex="-1">しくった認定。</h1>
    <div class="done-body">
      <p>投稿ありがとう。</p>
      <p>あなたの「しくった」が、今日しくった誰かの「まあ、いっか。」になるかもしれません。</p>
      ${lp.ok ? "" : `<p class="mut" style="font-size:14px">内容を運営が確認してから公開します。</p>`}
    </div>
    <div class="done-cta">
      <a class="btn" href="/" data-return>みんなのしくったに戻る</a>
      ${lp.ok && lp.id ? `<a class="linkbtn" href="${fid2url(lp.id)}">自分の投稿を見る</a>` : ""}
    </div>
    ${prof ? (prof === "done" ? `<section class="profile"><p class="mut" style="font-size:14px">ありがとう。シクッターを良くするために使わせてもらいます。</p></section>` : "")
    : `<section class="profile" aria-labelledby="prof-h">
      <h2 id="prof-h">シクッターを良くするために、よければあと2つだけ。</h2>
      <div class="fld"><span class="lbl" id="pl-age_group">年代</span>${choice("age_group", AGES)}</div>
      <div class="fld"><span class="lbl" id="pl-occupation">職業</span>${choice("occupation", JOBS)}</div>
      <p class="mut" style="font-size:12.5px">投稿には表示されません。集計にだけ使います。</p>
      <div class="row"><button type="button" class="btn sec sm" data-prof-save disabled>送る</button><button type="button" class="linkbtn" data-prof-skip>スキップ</button></div>
    </section>`}`;
}
async function saveProfile(btn) {
  const lp = S.lastPosted; if (!lp) return;
  const pick = (k) => { const b = $(`[data-prof="${k}"][aria-pressed="true"]`); return b ? b.dataset.val : ""; };
  const body = { id: lp.id, device_id: DEVICE, age_group: pick("age_group"), occupation: pick("occupation") };
  if (!body.age_group && !body.occupation) return;
  btn.disabled = true;
  try {
    await api("/api/profile", { method: "POST", body });
    lp.profile = "done"; saveSS("shk_last", lp);
    const sec = $(".profile"); if (sec) sec.innerHTML = `<p class="mut" style="font-size:14px">ありがとう。シクッターを良くするために使わせてもらいます。</p>`;
  } catch (e) { btn.disabled = false; toast("送れませんでした。もう一度お試しください。"); }
}

/* ============ 読み物ページ ============ */
function renderAbout() {
  $("#app").innerHTML = `<article class="doc">
    <h1>しくったら、シクッター。</h1>
    <p>シクッターは、失敗談を匿名でシェアする場所です。</p>
    <p>やらかした直後って、世界で自分だけがダメな気がします。でも、ほかの人の「しくった」を読んでいると、「みんな結構しくってるな」「それでも普通に生きてるな」と、ちょっとだけ気持ちが軽くなります。</p>
    <h2>成功談にしなくていい</h2>
    <p>失敗を「そのおかげで成長できました」に変換しなくて大丈夫です。無理に教訓を見つけなくてもいい。「で、今は普通に生きてる」。それだけで十分です。</p>
    <h2>笑うのは、自分の失敗だけ</h2>
    <p class="big">人を笑うのではなく、自分の失敗を笑ってもらう。</p>
    <p>ここに載るのは、書いた本人の失敗だけです。誰かの失敗を晒す場所ではありません。あなたの「しくった」が、今日しくった誰かの「まあ、いっか。」になるかもしれません。</p>
    <p class="fine"><a class="textlink" href="/guidelines">コミュニティガイドライン</a>もあわせて読んでください。</p>
    <p class="close">まあ、生きてる。</p>
  </article>`;
}
function renderGuidelines() {
  $("#app").innerHTML = `<article class="doc">
    <h1>コミュニティガイドライン</h1>
    <h2>いちばん大事なこと</h2>
    <p class="big">投稿するのは「自分の失敗」。</p>
    <p>シクッターは、自分の失敗を自分で笑ってもらう場所です。誰かを笑ったり、傷つけたりするためには使わないでください。</p>
    <h2>書かないでほしいこと</h2>
    <ul>
      <li>他人の失敗の晒し</li>
      <li>実名</li>
      <li>会社名</li>
      <li>学校名</li>
      <li>住所</li>
      <li>電話番号</li>
      <li>メールアドレス</li>
      <li>SNSアカウント</li>
      <li>そのほか、個人を特定できる情報</li>
      <li>誹謗中傷</li>
      <li>差別</li>
      <li>脅迫</li>
      <li>嫌がらせ</li>
      <li>犯罪の推奨・助長</li>
    </ul>
    <h2>自動で伏せる仕組みについて</h2>
    <p>会社名・「〇〇さん」などの人名・学校名・電話番号・メールアドレス・住所・URLは、公開前にルールで自動的に伏せます。ただし、この仕組みは完璧ではありません。カタカナの名前や店名、あだ名などは残ってしまうことがあります。</p>
    <p>何を書くかは、最後はあなた自身で判断してください。投稿前の確認画面で、公開される内容をよく見てから投稿してください。</p>
    <h2>運営の対応</h2>
    <p>ガイドラインに合わない投稿や、強い言葉を含む投稿は、運営の判断で非公開にすることがあります。自分の投稿は、投稿した端末から詳細ページでいつでも削除できます。</p>
  </article>`;
}
function renderNotFound() {
  $("#app").innerHTML = `<div class="empty" style="padding-top:72px"><p>ページが見つかりませんでした。</p><a class="btn sec sm" href="/">みんなのしくったに戻る</a></div>`;
}

/* ============ Admin ============ */
async function loadAdmin() {
  try {
    S.admin = await api("/api/admin", { headers: { "x-admin-key": S.adminKey } });
    S.adminErr = "";
  } catch (e) {
    if (e.status === 401) { S.adminKey = ""; saveSS("shk_admin", ""); S.adminErr = "パスワードが違います。"; }
    else S.adminErr = "読み込めませんでした。";
    S.admin = null;
  }
  if (route().name === "admin") renderAdmin();
}
function pct(a, b) { return b ? Math.round((a / b) * 1000) / 10 + "%" : "—"; }
function renderAdmin() {
  if (!S.adminKey) {
    $("#app").innerHTML = `<form class="login" id="admin-login">
      <h1>運営管理</h1>
      <label for="admin-pw" class="mut" style="font-size:14px">管理用パスワード</label>
      <input id="admin-pw" class="field" type="password" autocomplete="current-password" required>
      ${S.adminErr ? `<span class="err">${h(S.adminErr)}</span>` : ""}
      <button class="btn ink" type="submit">ひらく</button>
      <a class="linkbtn" href="/">タイムラインへ戻る</a>
    </form>`;
    return;
  }
  if (!S.admin) {
    $("#app").innerHTML = `<div class="empty" style="padding-top:80px">${S.adminErr ? h(S.adminErr) + ' <button class="linkbtn" data-adm-refresh>再読み込み</button>' : "読み込み中…"}</div>`;
    if (!S.adminErr) loadAdmin();
    return;
  }
  const k = S.admin.kpis || {}, all = S.admin.failures || [];
  const tabs = [["all", "すべて"], ["unchecked", "未確認"], ["approved", "公開OK"], ["needs_fix", "要修正"], ["hidden", "非公開"], ["dummy", "ダミー"]];
  const inTab = (f, v) => v === "all" || (v === "dummy" ? f.is_dummy : f.moderation_status === v);
  const list = all.filter((f) => inTab(f, S.adminTab));
  const openIds = $$("details.aitem[open]").map((d) => d.dataset.aid);
  $("#app").innerHTML = `<div class="adm">
    <div class="adm-h"><h1>運営管理</h1><div class="abtns"><button class="btn sec sm" data-adm-refresh>更新</button><a class="btn sec sm" href="/">サイトへ</a></div></div>
    <h2 class="h-sec">検証KPI · ${k.sessions || 0}セッション</h2>
    <div class="kpis">
      <div class="kpi star"><span class="k">😌 ちょっとマシになった率（relief_rate）</span><span class="v">${pct(k.relief_better, k.relief_n)}</span><span class="s">回答${k.relief_n || 0}件：マシ${k.relief_better || 0}・変わらない${k.relief_same || 0}・しんどい${k.relief_worse || 0}</span></div>
      <div class="kpi"><span class="k">質問の回答率</span><span class="v">${pct(k.relief_n, k.relief_views)}</span><span class="s">回答 ${k.relief_n || 0} / 表示 ${k.relief_views || 0} セッション</span></div>
      <div class="kpi"><span class="k">1セッションの閲覧数</span><span class="v">${k.sessions ? (k.reads_in_tl_sessions / k.sessions).toFixed(1) : "—"}</span><span class="s">読了 ${k.reads || 0} 件</span></div>
      <div class="kpi"><span class="k">詳細CTR</span><span class="v">${pct(k.opens, k.impressions)}</span><span class="s">詳細 ${k.opens || 0} / 表示 ${k.impressions || 0}</span></div>
      <div class="kpi"><span class="k">読了率</span><span class="v">${pct(k.reads, k.impressions)}</span><span class="s">読了 / 表示</span></div>
      <div class="kpi"><span class="k">リアクション率</span><span class="v">${pct(k.reactions, k.impressions)}</span><span class="s">リアクション / 表示</span></div>
      <div class="kpi"><span class="k">🤝 俺もある率</span><span class="v">${pct(k.same, k.impressions)}</span><span class="s">俺もある ${k.same || 0} / 表示</span></div>
      <div class="kpi"><span class="k">閲覧→投稿開始</span><span class="v">${pct(k.post_start_sessions, k.sessions)}</span><span class="s">${k.post_start_sessions || 0} セッション</span></div>
      <div class="kpi"><span class="k">投稿開始→完了</span><span class="v">${pct(k.post_complete_sessions, k.post_start_any)}</span><span class="s">完了 ${k.post_complete_sessions || 0} / 開始 ${k.post_start_any || 0}</span></div>
      <div class="kpi"><span class="k">完了後→タイムラインへ</span><span class="v">${pct(k.post_complete_returns, k.post_complete_views)}</span><span class="s">戻った ${k.post_complete_returns || 0} / 完了画面 ${k.post_complete_views || 0}</span></div>
    </div>
    <div class="atabs" role="group" aria-label="絞り込み">${tabs.map(([v, l]) => `<button class="chip" data-atab="${v}" aria-pressed="${S.adminTab === v}">${l} ${all.filter((f) => inTab(f, v)).length}</button>`).join("")}</div>
    ${S.adminTab === "dummy" && list.length ? `<div class="abtns" style="margin-bottom:10px"><button class="btn sec sm" data-dummy="hide_dummies">ダミーをすべて非公開</button><button class="btn sec sm" data-dummy="delete_dummies" id="del-dummy">ダミーを削除…</button></div>` : ""}
    <div class="alist">${list.map(adminItem).join("") || `<div class="empty">該当する投稿はありません。</div>`}</div>
  </div>`;
  openIds.forEach((id) => { const d = document.querySelector(`details.aitem[data-aid="${CSS.escape(id)}"]`); if (d) d.open = true; });
}
function adminItem(f) {
  const raw = f.raw || null, ms = f.moderation_status || "unchecked";
  const rawRows = [["何を", "mistake_summary"], ["状況", "context"], ["行動", "action"], ["結果", "result"], ["気づき", "realization_moment"], ["心の声", "inner_voice"], ["結末", "consequence"], ["一言", "current_comment"], ["金額", "loss_amount"], ["時間", "loss_time"]];
  return `<details class="aitem s-${ms}" data-aid="${h(f.id)}">
    <summary>
      <span class="meta"><span class="pill p-${ms}">${MOD[ms]}</span>${f.status === "published" ? '<span class="pill p-pub">公開中</span>' : '<span class="pill p-hidden">非表示</span>'}${f.is_dummy ? '<span class="pill p-dummy">ダミー</span>' : ""}${f.pii_detected ? '<span class="pill p-pii">PII置換あり</span>' : ""}<span>${h(f.category)}</span><span>${h((f.created_at || "").slice(0, 10))}</span></span>
      <span class="t">${h(f.title)}</span>
      <span class="meta">絶望 ${starsTxt(f.despair_score)} → 実際 ${starsTxt(f.actual_damage_score)} · gap ${f.relief_gap} · 😂${f.laugh_count} 🤝${f.same_count} 🫂${f.support_count}</span>
    </summary>
    <div class="abody">
      <div class="abtns">
        <select data-mod="${h(f.id)}" aria-label="確認ステータス">${Object.entries(MOD).map(([v, l]) => `<option value="${v}" ${v === ms ? "selected" : ""}>${l}</option>`).join("")}</select>
        <button class="btn sm ${f.status === "published" ? "sec" : "ink"}" data-pub="${h(f.id)}" data-on="${f.status !== "published"}">${f.status === "published" ? "非公開にする" : "公開する"}</button>
        ${f.status === "published" ? `<a class="btn sec sm" href="${fid2url(f.id)}" target="_blank" rel="noopener">表示を確認</a>` : ""}
      </div>
      ${f.moderation_note ? `<div class="note warn"><b>確認メモ</b><span>${h(f.moderation_note)}</span></div>` : ""}
      <div><div class="h5">原文</div>${raw ? `<dl class="kv">${rawRows.filter(([, k]) => raw[k]).map(([l, k]) => `<dt>${l}</dt><dd>${h(raw[k])}</dd>`).join("")}</dl>` : `<p class="mut">${f.is_dummy ? "ダミーデータのため原文はありません。" : "原文はありません。"}</p>`}</div>
      <div><div class="h5">編集文</div><div class="box">${h(f.edited_story || "")}</div></div>
      <div><div class="h5">PII検出</div>${(f.pii_removed || []).length ? `<div class="box">${f.pii_removed.map((x) => `「${h(x.from)}」→「${h(x.to)}」`).join("\n")}</div>` : `<p class="mut">検出なし</p>`}</div>
      <dl class="kv"><dt>カテゴリー</dt><dd>${h(f.category)} / ${h((f.subcategory || []).join(" / "))}</dd><dt>いつの話</dt><dd>${h(f.time_since || "—")}</dd><dt>失ったもの</dt><dd>${h((f.loss_types || []).join("、"))}${f.loss_amount ? " · " + h(f.loss_amount) : ""}${f.loss_time ? " · " + h(f.loss_time) : ""}</dd><dt>現在</dt><dd>${h(f.current_status)}</dd><dt>属性</dt><dd>${h([f.age_group, f.occupation].filter(Boolean).join(" · ") || "—")}</dd></dl>
      <div class="abtns">
        <button class="btn sm ink" data-copy="tiktok_script" data-cid="${h(f.id)}">TikTok/Reels台本をコピー</button>
        <button class="btn sm ink" data-copy="instagram_carousel" data-cid="${h(f.id)}">カルーセル文をコピー</button>
        <button class="btn sm ink" data-copy="x_post" data-cid="${h(f.id)}">X投稿文をコピー</button>
      </div>
      <textarea class="field" id="copy-${h(f.id)}" rows="6" readonly style="font-size:12.5px" aria-label="コピー用テキスト">${h(f.x_post || "")}</textarea>
    </div>
  </details>`;
}
async function adminPost(body, okMsg) {
  try {
    const r = await api("/api/admin", { method: "POST", body, headers: { "x-admin-key": S.adminKey } });
    toast(okMsg || "更新しました");
    return r;
  } catch (e) { toast("更新できませんでした"); return null; }
}
async function adminUpdate(id, patch) {
  const r = await adminPost({ action: "update", id, patch });
  if (r && r.failure) { const i = S.admin.failures.findIndex((x) => x.id === id); if (i >= 0) S.admin.failures[i] = { ...S.admin.failures[i], ...r.failure }; }
  renderAdmin();
  S.loadedAt = 0;
}

/* ============ イベント ============ */
function setPressedIn(group, btn, attr = "aria-pressed") { $$(group).forEach((b) => b.setAttribute(attr, b === btn ? "true" : "false")); }
document.addEventListener("click", async (e) => {
  const t = e.target.closest("button,a");
  if (!t) {
    // 投稿の余白をクリックしたら詳細へ（キーボードはタイトルのリンクで開ける）
    const card = e.target.closest(".post.link[data-fid]");
    if (card && !window.getSelection().toString()) go(fid2url(card.dataset.fid));
    return;
  }
  const ds = t.dataset;
  if (ds.rx) { e.preventDefault(); return toggleReact(ds.fid, ds.rx, t); }
  if ("postEntry" in ds) { S.step = 0; }
  if ("return" in ds) { track("post_complete_return_timeline", S.lastPosted && S.lastPosted.id); flush(); }
  if (t.id === "menu-btn") {
    const menu = $("#mobile-menu"); if (!menu) return;
    const open = menu.hidden;
    menu.hidden = !open;
    t.setAttribute("aria-expanded", String(open));
    t.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    return;
  }
  // 内部リンク
  if (t.tagName === "A" && t.getAttribute("href") && t.getAttribute("href").startsWith("/") && !t.target && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
    if (t.getAttribute("href") === "/" && route().name === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    return go(t.getAttribute("href"));
  }
  if (ds.filter) {
    if (S.filter !== ds.filter) { S.filter = ds.filter; A.reliefThanks = null; track("category_filter", "", { c: ds.filter }); }
    const y = window.scrollY, lead = $(".lead"), stick = lead ? lead.offsetHeight : 0;
    renderHome();
    $(`#tab-${CSS.escape(S.filter)}`).focus({ preventScroll: true });
    window.scrollTo(0, Math.min(y, stick));
    return;
  }
  if ("reload" in ds) { S.loaded = false; renderHome(); return loadFailures(); }
  if (ds.relief) return answerRelief(ds.relief);
  if ("reliefX" in ds) { A.reliefDone = true; A.reliefThanks = null; track("relief_dismiss"); const el = $(".relief"); if (el) el.remove(); return; }
  if ("back" in ds) { if (S.navCount > 0) history.back(); else go("/"); return; }
  // 投稿フロー
  if ("stepBack" in ds) { if (S.step <= 0) { if (S.navCount > 0) history.back(); else go("/"); } else stepTo(S.step - 1); return; }
  if ("stepNext" in ds) return nextStep();
  if ("resetDraft" in ds) { S.draft = {}; saveDraft(); return stepTo(0); }
  if (ds.choice) {
    const k = ds.choice;
    const on = !("toggle" in ds && S.draft[k] === ds.val);
    S.draft[k] = on ? ds.val : undefined; saveDraft();
    $$(`[data-choice="${k}"]`).forEach((b) => b.setAttribute("aria-pressed", String(on && b === t)));
    return syncNext();
  }
  if (ds.scale) {
    const k = ds.scale, v = +ds.val, st = allFields(STEPS[S.step]).find((f) => f.key === k);
    S.draft[k] = v; saveDraft();
    $$(`[data-scale="${k}"]`).forEach((b) => { const sel = b === t; b.setAttribute("aria-checked", String(sel)); b.tabIndex = sel ? 0 : -1; });
    const now = $("#now-" + k); if (now && st) { now.textContent = st.scale[v - 1].join(" "); now.classList.remove("empty"); }
    return syncNext();
  }
  if (ds.loss) {
    let v = S.draft.loss_types || []; const o = ds.loss;
    if (o === "特になし") v = v.includes(o) ? [] : [o];
    else { v = v.filter((x) => x !== "特になし"); v = v.includes(o) ? v.filter((x) => x !== o) : [...v, o]; }
    if (!v.includes("お金")) delete S.draft.loss_amount;
    if (!v.includes("時間")) delete S.draft.loss_time;
    S.draft.loss_types = v; saveDraft();
    $$("[data-loss]").forEach((b) => b.setAttribute("aria-pressed", String(v.includes(b.dataset.loss))));
    $("#wrap-loss_amount").hidden = !v.includes("お金");
    $("#wrap-loss_time").hidden = !v.includes("時間");
    return;
  }
  if ("regen" in ds) return generate();
  if (ds.edit != null && ds.edit !== "") { S.step = +ds.edit; S.preview = null; return go("/post"); }
  if ("publish" in ds) return publish(t);
  // 完了画面の年代・職業
  if (ds.prof) {
    const on = t.getAttribute("aria-pressed") !== "true";
    $$(`[data-prof="${ds.prof}"]`).forEach((b) => b.setAttribute("aria-pressed", String(on && b === t)));
    const btn = $("[data-prof-save]"); if (btn) btn.disabled = !$('[data-prof][aria-pressed="true"]');
    return;
  }
  if ("profSave" in ds) return saveProfile(t);
  if ("profSkip" in ds) { if (S.lastPosted) { S.lastPosted.profile = "skip"; saveSS("shk_last", S.lastPosted); } const sec = $(".profile"); if (sec) sec.remove(); return; }
  if (ds.deletePost) {
    if (!confirm("この投稿を削除します。元に戻せません。よろしいですか？")) return;
    try {
      await api("/api/delete", { method: "POST", body: { id: ds.deletePost, device_id: DEVICE } });
      MYPOSTS.delete(ds.deletePost); saveLS("shk_mine", [...MYPOSTS]);
      S.failures = S.failures.filter((x) => x.id !== ds.deletePost);
      toast("投稿を削除しました");
      go("/", true);
    } catch (err) { toast("削除できませんでした。もう一度お試しください。"); }
    return;
  }
  // 管理画面
  if (ds.atab) { S.adminTab = ds.atab; return renderAdmin(); }
  if ("admRefresh" in ds) { S.admin = null; S.adminErr = ""; return renderAdmin(); }
  if (ds.pub) { const on = ds.on === "true"; return adminUpdate(ds.pub, on ? { status: "published", moderation_status: "approved" } : { status: "hidden" }); }
  if (ds.dummy) {
    if (ds.dummy === "delete_dummies" && t.dataset.armed !== "1") { t.dataset.armed = "1"; t.textContent = "本当に削除する（元に戻せません）"; return; }
    await adminPost({ action: ds.dummy }, ds.dummy === "delete_dummies" ? "ダミーを削除しました" : "ダミーを非公開にしました");
    S.admin = null; S.loadedAt = 0; return renderAdmin();
  }
  if (ds.copy) {
    const f = (S.admin && S.admin.failures || []).find((x) => x.id === ds.cid); if (!f) return;
    const txt = f[ds.copy] || "";
    const ta = document.getElementById("copy-" + ds.cid); if (ta) ta.value = txt;
    try { await navigator.clipboard.writeText(txt); toast("コピーしました"); }
    catch (err) { if (ta) { ta.focus(); ta.select(); } toast("テキストを選択しました。長押しでコピーしてください"); }
  }
});
// 入力欄：下書きに保存し、文字数と「次へ」を更新
document.addEventListener("input", (e) => {
  const t = e.target; const k = t.dataset && t.dataset.key; if (!k) return;
  S.draft[k] = t.value; saveDraft();
  const c = $("#cnt-" + k);
  if (c && t.maxLength > 0) { c.textContent = `${t.value.length} / ${t.maxLength}`; c.className = "count " + countCls(t.value.length, t.maxLength); }
  syncNext();
});
document.addEventListener("keydown", (e) => {
  const t = e.target;
  // タブ・段階選択は左右キーで移動
  const group = t.matches && (t.matches(".tab") ? ".tab" : t.matches("[data-scale]") ? `[data-scale="${t.dataset.scale}"]` : null);
  if (group && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
    const items = $$(group), i = items.indexOf(t);
    const j = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    e.preventDefault(); items[j].focus(); items[j].click();
    return;
  }
  if (e.key === "Enter" && t.matches && t.matches("input.field[data-key]") && !e.isComposing && route().name === "post") {
    e.preventDefault();
    const b = $("#next-btn"); if (b && !b.disabled) nextStep();
  }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.mod) {
    const v = t.value, patch = { moderation_status: v };
    if (v === "hidden") patch.status = "hidden";
    if (v === "approved") patch.status = "published";
    adminUpdate(t.dataset.mod, patch);
  }
});
document.addEventListener("submit", (e) => {
  if (e.target.id === "admin-login") {
    e.preventDefault();
    S.adminKey = $("#admin-pw").value; saveSS("shk_admin", S.adminKey);
    S.admin = null; S.adminErr = ""; renderAdmin();
  }
});

/* ============ 起動 ============ */
{
  const r = route().name;
  if (r === "preview") history.replaceState(null, "", "/post");
  if (r === "thanks" && !S.lastPosted) history.replaceState(null, "", "/");
}
render();
loadFailures();
})();
