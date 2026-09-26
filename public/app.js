/* シクッター MVP フロントエンド */
(() => {
"use strict";

/* ============ 定数 ============ */
const CATS = ["仕事", "恋愛", "お金", "人間関係", "日常"];
const DESPAIR = [["😐", "まだいける"], ["😥", "ちょっとまずい"], ["😨", "かなりまずい"], ["😱", "終わったかも"], ["☠️", "完全に終わった"]];
const DAMAGE = [["🩹", "かすり傷"], ["🤕", "ちょっと痛い"], ["😵", "まあまあ痛い"], ["🚑", "けっこうヤバい"], ["🔥", "本当にヤバい"]];
const MOOD = [["🙂", "平気"], ["😕", "ちょい"], ["😞", "落ちてる"], ["😣", "かなり"], ["🫠", "限界"]];
const LOSS = ["特になし", "お金", "信用", "仕事", "恋人", "友人", "モノ", "時間", "その他"];
const STATUS = ["普通に生きてる", "普通に働いてる", "なんとかなった", "今では笑い話", "まだちょっと引きずってる", "まだ解決してない", "その他"];
const SINCE = ["今日", "1週間以内", "1ヶ月以内", "1年以内", "それより前"];
const AGES = ["10代", "20代", "30代", "40代", "50代以上", "秘密"];
const JOBS = ["会社員", "学生", "経営者・フリーランス", "その他", "秘密"];
const MOD = { unchecked: "未確認", approved: "公開OK", needs_fix: "要修正", hidden: "非公開" };
const RX = [["laugh", "😂", "笑った"], ["same", "🤝", "俺もある"], ["support", "🫂", "生きろ"]];
const RELIEF_AFTER = 4;

const STEPS = [
  { key: "mistake_summary", q: "何をしくった？", hint: "まずは一言で教えて。", ex: "取引先50社に社内メールを誤送信した", type: "text", req: true, max: 60 },
  { key: "context", q: "しくる前、何してた？", hint: "どんな状況だった？ ざっくりでOK。", ex: "新入社員で、社内向けの案内メールを作っていた", type: "area" },
  { key: "action", q: "何をして、しくった？", ex: "宛先を確認せずに、取引先リストに一斉送信した", type: "area" },
  { key: "result", q: "何が起きた？", ex: "社内向けの内容が、取引先約50社に届いた", type: "area" },
  { key: "realization_moment", q: "「しくった」って気づいた瞬間は？", ex: "送信済みメールを見た瞬間、血の気が引いた。", type: "area" },
  { key: "inner_voice", q: "その瞬間、頭に浮かんだ言葉は？", hint: "「終わった」「逃げたい」など、そのままでOK。", ex: "終わった。クビになる。", type: "text", req: true, max: 60 },
  { key: "despair_score", q: "その瞬間、どれくらい終わったと思った？", type: "scale", scale: DESPAIR, req: true },
  { key: "consequence", q: "で、結局どうなった？", hint: "怒られた、振られた、弁償した、意外と何もなかった等。", ex: "上司と一緒に謝罪した。大きな損害はなかった", type: "area" },
  { key: "loss_types", q: "実際、何を失った？", hint: "いくつでも選べます。", type: "loss", req: true },
  { key: "actual_damage_score", q: "今振り返ると、実際どれくらいヤバかった？", type: "scale", scale: DAMAGE, req: true },
  { key: "current_status", q: "で、今どうしてる？", hint: "「普通に生きてる」だけで十分です。", type: "single", options: STATUS, req: true },
  { key: "current_comment", q: "今だから言える一言ある？", hint: "なくても大丈夫。", ex: "宛先は2回見るようになりました", type: "area", max: 120 },
  { key: "category", q: "どのジャンルのしくった？", type: "classify", req: true },
  { key: "age_group", q: "最後に、よければ教えて", hint: "どちらも任意です。集計にだけ使い、投稿には表示しません。", type: "attrs" },
];

/* ============ ユーティリティ ============ */
const $ = (sel, root = document) => root.querySelector(sel);
const h = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function loadLS(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function loadSS(k) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function saveSS(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
const rid = (n) => { const a = new Uint8Array(n); (crypto.getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => a[i] = Math.random() * 256)); return Array.from(a, (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join(""); };
function stars(n) { n = +n || 0; let o = ""; for (let i = 1; i <= 5; i++) o += i <= n ? "★" : '<span class="off">☆</span>'; return `<span class="stars" aria-label="5段階中${n}">${o}</span>`; }
const starsTxt = (n) => "★".repeat(+n || 0) + "☆".repeat(5 - (+n || 0));
function gapHtml(d, a) {
  const g = (+d || 0) - (+a || 0);
  if (g > 0) return `<span class="gap">思ってたより ${g}段階 マシだった</span>`;
  if (g === 0) return `<span class="gap same">思ったとおりのヤバさだった</span>`;
  return `<span class="gap worse">思ってたよりヤバかった。それでも生きてる</span>`;
}
function toast(t, ms = 2400) { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => (el.hidden = true), ms); }
const mark = (t) => `<b style="background:linear-gradient(transparent 58%,var(--marker) 58%,var(--marker) 92%,transparent 92%)">${t}</b>`;

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
  filter: "all", draft: loadLS("shk_draft") || {}, step: -1, preview: null, lastPosted: null,
  adminKey: loadSS("shk_admin") || "", admin: null, adminTab: "all", adminErr: "",
  homeScroll: 0, lastRoute: null, navCount: 0,
};
const MYPOSTS = new Set(loadLS("shk_mine") || []);
const A = {
  imp: new Set(sessSaved.imp || []), read: new Set(sessSaved.read || []), open: new Set(sessSaved.open || []),
  mood: sessSaved.mood || null, moodDismissed: !!sessSaved.moodDismissed,
  reliefDone: !!sessSaved.reliefDone, reliefShown: false,
};
function saveSess() { saveSS("shk_sess", { imp: [...A.imp], read: [...A.read], open: [...A.open], mood: A.mood, moodDismissed: A.moodDismissed, reliefDone: A.reliefDone }); }
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
function observeCards() {
  if (!("IntersectionObserver" in window)) return;
  if (io) io.disconnect();
  io = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      const fid = en.target.dataset.fid;
      if (en.isIntersecting && en.intersectionRatio >= 0.5) {
        if (!A.imp.has(fid)) { A.imp.add(fid); track("failure_impression", fid); }
        if (!A.read.has(fid) && !readTimers.has(fid)) readTimers.set(fid, setTimeout(() => { readTimers.delete(fid); markRead(fid); }, 2500));
      } else if (readTimers.has(fid)) { clearTimeout(readTimers.get(fid)); readTimers.delete(fid); }
    });
  }, { threshold: [0, 0.5, 1] });
  document.querySelectorAll(".card[data-fid]").forEach((c) => io.observe(c));
}
function markRead(fid) {
  if (A.read.has(fid)) return;
  A.read.add(fid);
  track("failure_read", fid);
  maybeRelief();
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
const visible = () => S.failures;

/* ============ リアクション ============ */
function counts(f) { return { laugh: f.laugh_count || 0, same: f.same_count || 0, support: f.support_count || 0 }; }
function rxHtml(f) {
  const c = counts(f), mine = S.my[f.id] || {};
  return `<div class="reacts" role="group" aria-label="リアクション">${RX.map(([k, e, l]) =>
    `<button class="rx" data-rx="${k}" data-fid="${h(f.id)}" aria-pressed="${!!mine[k]}"><span aria-hidden="true">${e}</span>${l}<span class="n">${c[k]}</span></button>`).join("")}</div>`;
}
function refreshRx() {
  document.querySelectorAll(".rx[data-fid]").forEach((b) => {
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
  if (btn) { btn.classList.add("pop"); setTimeout(() => btn.classList.remove("pop"), 150); }
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
function route() {
  const p = location.pathname.replace(/\/+$/, "") || "/";
  if (p.startsWith("/failure/")) return { name: "detail", id: decodeURIComponent(p.slice(9)) };
  return { name: { "/post": "post", "/preview": "preview", "/thanks": "thanks", "/admin": "admin" }[p] || "home" };
}
function go(path, replace) {
  if (route().name === "home") S.homeScroll = window.scrollY;
  if (location.pathname !== path) { history[replace ? "replaceState" : "pushState"](null, "", path); if (!replace) S.navCount++; }
  render();
  window.scrollTo(0, 0);
}
window.addEventListener("popstate", () => { S.navCount = Math.max(0, S.navCount - 1); render(); if (route().name === "home") requestAnimationFrame(() => window.scrollTo(0, S.homeScroll)); else window.scrollTo(0, 0); });

function render(fromData) {
  const r = route();
  if (r.name !== S.lastRoute) {
    S.lastRoute = r.name;
    if (r.name === "home") track("timeline_view");
    if (!(r.name === "home" || r.name === "detail")) $("#relief").hidden = true;
  }
  renderNav(r.name);
  if (r.name === "home") renderHome();
  else if (r.name === "detail") renderDetail(r.id);
  else if (fromData) return;
  else if (r.name === "post") renderPost();
  else if (r.name === "preview") renderPreview();
  else if (r.name === "thanks") renderThanks();
  else if (r.name === "admin") renderAdmin();
  if (r.name === "home" && Date.now() - S.loadedAt > 60000 && S.loaded && !fromData) loadFailures();
}
function renderNav(n) {
  const nav = $("#nav");
  nav.parentElement.hidden = n === "admin";
  nav.innerHTML = `
    <a href="/" class="${n === "home" || n === "detail" ? "on" : ""}"><span class="ico" aria-hidden="true">🏠</span>ホーム</a>
    <a href="/post" class="post-btn" data-post-entry><span aria-hidden="true">＋</span>しくった</a>
    <a href="/" data-top><span class="ico" aria-hidden="true">↑</span>上へ</a>`;
}

/* ============ ホーム ============ */
function cardHtml(f) {
  return `<article class="card" data-fid="${h(f.id)}">
    <div class="meta"><span class="cat">${h(f.category)}</span><span>·</span><span>${h(f.time_since || "")}の話</span>${MYPOSTS.has(f.id) ? '<span class="mine">あなたの投稿</span>' : ""}</div>
    <h2 class="title"><a href="/failure/${encodeURIComponent(f.id)}">${h(f.title)}</a></h2>
    <p class="voice"><mark>「${h(f.inner_voice)}」</mark></p>
    <div class="scores">
      <span class="slbl">当時の絶望度</span>${stars(f.despair_score)}
      <span class="slbl">実際のヤバさ</span>${stars(f.actual_damage_score)}
      ${gapHtml(f.despair_score, f.actual_damage_score)}
    </div>
    <p class="now"><span class="slbl">現在</span><span>${h(f.current_line || f.current_status)}</span></p>
    ${rxHtml(f)}
    <a class="more" href="/failure/${encodeURIComponent(f.id)}">続きを見る →</a>
  </article>`;
}
function renderHome() {
  const list = visible().filter((f) => S.filter === "all" || f.category === S.filter);
  const showMood = A.mood == null && !A.moodDismissed;
  let feed;
  if (!S.loaded) feed = `<div class="skeleton"></div><div class="skeleton"></div>`;
  else if (S.error && !S.failures.length) feed = `<div class="empty retry">読み込めませんでした。通信状況を確認してください。<button class="btn ghost sm" data-reload>もう一度読み込む</button></div>`;
  else if (!list.length) feed = `<div class="empty">このジャンルのしくったは、まだありません。<br>最初の1件になりませんか。</div>`;
  else feed = list.map(cardHtml).join("");
  $("#app").innerHTML = `
    <header class="top">
      <a class="brand" href="/"><span class="logo">シク<span class="tsu">ッ</span>ター</span><span class="tag">しくったら、シクッター。</span></a>
      <span class="demo-pill">テスト版</span>
    </header>
    <div class="chips" role="group" aria-label="カテゴリー">
      ${["all", ...CATS].map((c) => `<button class="chip" data-filter="${c}" aria-pressed="${S.filter === c}">${c === "all" ? "すべて" : c}</button>`).join("")}
    </div>
    ${showMood ? `<section class="mood" aria-label="今の気分">
      <div class="mood-head"><span>今、どれくらい落ち込んでる？ <span class="mut" style="font-weight:400;font-size:12px">任意</span></span><button class="x" data-mood-x aria-label="閉じる">×</button></div>
      <div class="scale5">${MOOD.map(([e, l], i) => `<button data-mood="${i + 1}" aria-label="${i + 1} ${l}">${e}<small>${l}</small></button>`).join("")}</div>
    </section>` : ""}
    <section class="feed" aria-label="みんなのしくった">${feed}</section>
    <footer class="foot"><span>シクッター（テスト版）</span><span>失敗しても、いつもの自分に戻れる社会へ。</span></footer>`;
  observeCards();
}

/* ============ 詳細 ============ */
function renderDetail(id) {
  const f = S.failures.find((x) => x.id === id);
  if (!f) {
    $("#app").innerHTML = `<button class="back" data-back>← みんなのしくった</button><div class="empty">${S.loaded ? "このしくったは見つかりませんでした。" : "読み込み中…"}</div>`;
    return;
  }
  if (!A.open.has(id)) { A.open.add(id); track("failure_open", id); }
  const loss = (f.loss_types || []).filter((x) => x !== "特になし").map((x) => {
    let t = x; if (x === "お金" && f.loss_amount) t += `（${f.loss_amount}）`; if (x === "時間" && f.loss_time) t += `（${f.loss_time}）`;
    return `<span class="loss">${h(t)}</span>`;
  }).join("");
  const others = visible().filter((x) => x.id !== id && x.category === f.category).slice(0, 2);
  const d = +f.despair_score || 0, a = +f.actual_damage_score || 0;
  $("#app").innerHTML = `
    <button class="back" data-back>← みんなのしくった</button>
    <article class="story">
      <div class="meta"><span class="cat">${h(f.category)}</span>${(f.subcategory || []).map((s) => `<span>/ ${h(s)}</span>`).join("")}<span>·</span><span>${h(f.time_since)}の話</span></div>
      <h1 class="title">${h(f.title)}</h1>
      ${f.setup ? `<p>${h(f.setup)}</p>` : ""}
      ${(f.story || []).map((p) => `<p>${h(p)}</p>`).join("")}
      <p class="big-voice"><mark>「${h(f.inner_voice)}」</mark></p>
      <div class="meter"><div class="row"><span class="slbl">当時の絶望度</span><span class="word">${DESPAIR[d - 1] ? DESPAIR[d - 1].join(" ") : ""}</span></div>${stars(d)}</div>
      ${f.consequence_text ? `<p>${h(f.consequence_text)}</p>` : ""}
      <div class="meter"><div class="row"><span class="slbl">実際のヤバさ</span><span class="word">${DAMAGE[a - 1] ? DAMAGE[a - 1].join(" ") : ""}</span></div>${stars(a)}${gapHtml(d, a)}</div>
      ${loss ? `<div><div class="slbl" style="margin-bottom:6px">失ったもの</div><div class="losses">${loss}</div></div>` : ""}
      <p class="after">${h(f.current_line || f.current_status)}</p>
      <p class="close">まあ、生きてる。</p>
      ${rxHtml(f)}
      <span id="read-sentinel" style="display:block;height:1px"></span>
    </article>
    <div class="cta-box">
      <b>あなたも、しくった？</b>
      <span class="mut" style="font-size:14px">匿名で、一問一答で答えるだけ。読みやすい形にまとめて載せます。</span>
      <a class="btn" href="/post" data-post-entry>＋ しくったを投稿</a>
    </div>
    ${others.length ? `<h2 class="section-h">ほかの「${h(f.category)}」のしくった</h2><div class="feed">${others.map(cardHtml).join("")}</div>` : ""}`;
  if ("IntersectionObserver" in window) {
    const o = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { markRead(id); o.disconnect(); } });
    o.observe($("#read-sentinel"));
  }
  observeCards();
}

/* ============ ちょっとマシになった？ ============ */
function maybeRelief() {
  if (A.reliefDone || A.reliefShown || A.read.size < RELIEF_AFTER) return;
  const r = route().name; if (r !== "home" && r !== "detail") return;
  A.reliefShown = true;
  const el = $("#relief");
  el.innerHTML = `<div class="relief-in" role="dialog" aria-label="ちょっとマシになった？">
    <div class="relief-q"><div><b>ちょっとマシになった？</b><span>シクッターを見る前と比べて、今の気持ちはどう？</span></div><button class="x" data-relief-x aria-label="閉じる">×</button></div>
    <div class="relief-opts">
      <button data-relief="better"><span>😌</span>少しマシになった</button>
      <button data-relief="same"><span>😐</span>変わらない</button>
      <button data-relief="worse"><span>😔</span>余計つらくなった</button>
    </div></div>`;
  el.hidden = false;
}
function answerRelief(v) {
  A.reliefDone = true;
  track("relief_answer", "", { v, reads: A.read.size, mood_before: A.mood });
  const msg = v === "better" ? "よかった。まあ、生きてる。" : v === "same" ? "了解。気が向いたら、また覗いてください。" : "教えてくれてありがとう。無理して見なくて大丈夫です。";
  $("#relief").innerHTML = `<div class="relief-in"><div class="relief-q"><div><b>${msg}</b>${v === "worse" ? "<span>しんどさが続くときは、信頼できる人や専門の相談先に話してみてください。</span>" : ""}</div><button class="x" data-relief-x aria-label="閉じる">×</button></div></div>`;
  setTimeout(() => { $("#relief").hidden = true; }, v === "worse" ? 9000 : 2600);
}

/* ============ 投稿フロー ============ */
function stepValid(st) {
  const v = S.draft[st.key];
  if (!st.req) return true;
  if (st.type === "loss") return Array.isArray(v) && v.length > 0;
  if (st.type === "classify") return !!S.draft.category && !!S.draft.time_since;
  if (st.type === "scale") return !!v;
  return v != null && String(v).trim() !== "";
}
function stepFilled(s) {
  if (s.type === "classify") return !!S.draft.category;
  if (s.type === "attrs") return !!(S.draft.age_group || S.draft.occupation);
  const v = S.draft[s.key]; return Array.isArray(v) ? v.length > 0 : v != null && v !== "";
}
function opt(attr, val, pressed, label) { return `<button class="opt" ${attr}="${h(val)}" aria-pressed="${!!pressed}">${h(label || val)}</button>`; }
function renderPost() {
  if (S.step < 0) return renderIntro();
  const st = STEPS[S.step], n = S.step + 1, tot = STEPS.length, v = S.draft[st.key];
  let body = "";
  if (st.type === "text") {
    body = `<input id="in-${st.key}" class="field" type="text" maxlength="${st.max || 80}" value="${h(v || "")}" autocomplete="off" enterkeyhint="next" aria-label="${h(st.q)}">
      <div class="count"><span id="cnt">${(v || "").length}</span>/${st.max || 80}</div>`;
  } else if (st.type === "area") {
    body = `<textarea id="in-${st.key}" class="field" maxlength="${st.max || 400}" aria-label="${h(st.q)}">${h(v || "")}</textarea>`;
  } else if (st.type === "scale") {
    body = `<div class="bigscale" role="radiogroup">${st.scale.map(([e, l], i) => `<button class="opt" role="radio" data-scale="${i + 1}" aria-pressed="${v === i + 1}" aria-checked="${v === i + 1}"><span><span class="dot" style="font-size:18px;margin-right:10px">${i + 1}</span>${l}</span><span class="e">${e}</span></button>`).join("")}</div>`;
  } else if (st.type === "single") {
    body = `<div class="opts">${st.options.map((o) => opt("data-single", o, v === o)).join("")}</div>`;
  } else if (st.type === "loss") {
    const sel = v || [];
    body = `<div class="opts two">${LOSS.map((o) => opt("data-loss", o, sel.includes(o))).join("")}</div>
      ${sel.includes("お金") ? `<div class="sub"><label for="in-loss_amount">だいたいいくら？ <span class="mut" style="font-weight:400">任意</span></label><input id="in-loss_amount" class="field" type="text" placeholder="例：3万円くらい" value="${h(S.draft.loss_amount || "")}" maxlength="30"></div>` : ""}
      ${sel.includes("時間") ? `<div class="sub"><label for="in-loss_time">どれくらいの時間？ <span class="mut" style="font-weight:400">任意</span></label><input id="in-loss_time" class="field" type="text" placeholder="例：丸一日" value="${h(S.draft.loss_time || "")}" maxlength="30"></div>` : ""}`;
  } else if (st.type === "classify") {
    body = `<div class="grp"><h3>ジャンル</h3><div class="opts two">${CATS.map((o) => `<button class="opt" data-set="category" data-val="${o}" aria-pressed="${S.draft.category === o}">${o}</button>`).join("")}</div></div>
      <div class="grp"><h3>いつの話？</h3><div class="opts two">${SINCE.map((o) => `<button class="opt" data-set="time_since" data-val="${o}" aria-pressed="${S.draft.time_since === o}">${o}</button>`).join("")}</div></div>`;
  } else if (st.type === "attrs") {
    body = `<div class="grp"><h3>年代</h3><div class="opts two">${AGES.map((o) => `<button class="opt" data-set="age_group" data-val="${o}" aria-pressed="${S.draft.age_group === o}">${o}</button>`).join("")}</div></div>
      <div class="grp"><h3>職業</h3><div class="opts two">${JOBS.map((o) => `<button class="opt" data-set="occupation" data-val="${o}" aria-pressed="${S.draft.occupation === o}">${o}</button>`).join("")}</div></div>`;
  }
  const last = S.step === STEPS.length - 1;
  $("#app").innerHTML = `
    <div class="stepbar">
      <button class="iconbtn" data-step-back aria-label="前の質問へ">←</button>
      <div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="${tot}" aria-valuenow="${n}"><i style="width:${(n / tot) * 100}%"></i></div>
      <span class="stepn">${n}/${tot}</span>
    </div>
    <section class="qwrap">
      <span class="qlabel">Q${n}</span>
      <h1 class="q">${h(st.q)}</h1>
      ${st.hint ? `<p class="hint">${h(st.hint)}</p>` : ""}
      ${body}
      ${st.ex ? `<p class="ex">例：「${h(st.ex)}」</p>` : ""}
    </section>
    <div class="actions">
      ${st.req ? "<span></span>" : `<button class="linkbtn" data-step-next data-skip>${stepFilled(st) ? "" : "スキップ"}</button>`}
      <button class="btn" id="next-btn" data-step-next ${stepValid(st) ? "" : "disabled"}>${last ? "まとめて確認する" : "次へ"}</button>
    </div>
    <div class="dots" aria-label="質問一覧">${STEPS.map((s, i) => `<button data-jump="${i}" class="${i === S.step ? "cur" : stepFilled(s) ? "done" : ""}" aria-label="Q${i + 1}へ">${i + 1}</button>`).join("")}</div>
    <p class="mut" style="font-size:12px;margin-top:14px">本名・会社名・学校名などは書かなくて大丈夫。書いてしまっても、見つけたものは公開前に自動で伏せます。</p>`;
  const inp = $("#app .field");
  if (inp && (st.type === "text" || st.type === "area")) {
    inp.addEventListener("input", () => {
      S.draft[st.key] = inp.value; saveDraft();
      const c = $("#cnt"); if (c) c.textContent = inp.value.length;
      $("#next-btn").disabled = !stepValid(st);
      const sk = $("[data-skip]"); if (sk) sk.textContent = inp.value ? "" : "スキップ";
    });
    if (st.type === "text") inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing && stepValid(st)) { e.preventDefault(); nextStep(); } });
    setTimeout(() => inp.focus({ preventScroll: true }), 50);
  }
  ["loss_amount", "loss_time"].forEach((k) => { const el = $("#in-" + k); if (el) el.addEventListener("input", () => { S.draft[k] = el.value; saveDraft(); }); });
}
function renderIntro() {
  $("#app").innerHTML = `
    <section class="intro">
      <h1>しくった？<br>大丈夫。<br><span class="m">みんな結構しくってる。</span></h1>
      <p class="lead">あなたの「しくった」が、<br>今日しくった誰かを少し楽にするかもしれません。</p>
      <p class="safe">ここは、失敗を責める場所じゃありません。</p>
      <div style="display:grid;gap:10px;justify-items:start">
        <button class="btn" data-begin>しくった話を投稿する</button>
        ${Object.keys(S.draft).length ? `<button class="linkbtn" data-reset-draft>書きかけを消して最初から</button>` : ""}
      </div>
      <ul class="promise" style="padding:0;list-style:disc">
        <li>匿名で投稿できます。登録やログインはいりません。</li>
        <li>個人を特定できる情報は公開しません。</li>
        <li>投稿できるのは、あなた自身のしくっただけです。誰かの失敗を晒す投稿は公開しません。</li>
        <li>コメント欄はありません。届くのはリアクションだけです。</li>
      </ul>
    </section>`;
}
function nextStep() {
  const st = STEPS[S.step];
  if (!stepValid(st)) return;
  track("post_step_complete", "", { step: st.key, n: S.step + 1 });
  if (S.step < STEPS.length - 1) { S.step++; renderPost(); window.scrollTo(0, 0); }
  else generate();
}

/* ============ まとめ（ルールベース） ============ */
async function generate() {
  $("#app").innerHTML = `<section class="gen" aria-live="polite">
    <div class="spin dot" aria-hidden="true"><span>し</span><span>く</span><span>っ</span><span>た</span></div>
    <b style="font-size:18px">あなたの「しくった」をまとめています</b>
    <span class="mut">名前や会社名を伏せています…</span>
  </section>`;
  const ctrl = new AbortController();
  const hard = setTimeout(() => ctrl.abort(), 20000);
  let res = null, err = null;
  try { res = await api("/api/edit", { method: "POST", body: { answers: S.draft }, signal: ctrl.signal }); }
  catch (e) { err = e; }
  clearTimeout(hard);
  if (route().name !== "post") return;
  if (err) {
    if (err.data && err.data.missing) {
      const idx = STEPS.findIndex((s) => !stepValid(s));
      toast("未回答の質問があります");
      S.step = Math.max(0, idx); renderPost(); return;
    }
    $("#app").innerHTML = `<section class="gen"><b>うまくまとめられませんでした。</b><span class="mut">通信状況を確認して、もう一度お試しください。回答は残っています。</span><div><button class="btn" data-regen>もう一度まとめる</button></div></section>`;
    return;
  }
  S.preview = res;
  go("/preview");
}
function renderPreview() {
  if (!S.preview) { S.step = Math.max(0, S.step); return go("/post", true); }
  track("post_preview");
  const d = S.draft, p = S.preview.edited, pii = p.pii || [];
  $("#app").innerHTML = `
    <h1 class="pv-h">あなたの「しくった」をまとめました。</h1>
    <p class="mut" style="font-size:14px;margin-bottom:14px">この内容で公開されます。気になるところは「修正する」で答えを直してください。</p>
    <div style="display:grid;gap:10px;margin-bottom:14px">
      ${pii.length ? `<div class="note"><b>🔒 特定につながりそうな言葉を置き換えました</b>${pii.slice(0, 6).map((x) => `<span>「${h(x.from)}」→「${h(x.to)}」</span>`).join("")}</div>` : `<div class="note"><b>🔒 個人を特定できそうな情報は見つかりませんでした</b></div>`}
      ${p.moderation && p.moderation.ok === false ? `<div class="note warn"><b>運営が確認してから公開します</b><span>${h(p.moderation.reason || "内容の確認が必要です")}</span></div>` : ""}
      ${S.preview.note ? `<div class="note"><span>${h(S.preview.note)}</span></div>` : ""}
    </div>
    <article class="story">
      <div class="meta"><span class="cat">${h(d.category)}</span>${(p.subcategory || []).map((s) => `<span>/ ${h(s)}</span>`).join("")}<span>·</span><span>${h(d.time_since)}の話</span></div>
      <h2 class="title">${h(p.title)}</h2>
      ${p.setup ? `<p>${h(p.setup)}</p>` : ""}
      ${(p.story || []).map((x) => `<p>${h(x)}</p>`).join("")}
      <p class="big-voice"><mark>「${h(p.inner_voice)}」</mark></p>
      <div class="meter"><span class="slbl">当時の絶望度</span>${stars(d.despair_score)}</div>
      ${p.consequence_text ? `<p>${h(p.consequence_text)}</p>` : ""}
      <div class="meter"><span class="slbl">実際のヤバさ</span>${stars(d.actual_damage_score)}${gapHtml(d.despair_score, d.actual_damage_score)}</div>
      <p class="after">${h(p.current_line)}</p>
      <p class="close">まあ、生きてる。</p>
    </article>
    <div class="pv-actions">
      <button class="btn ghost" data-edit>修正する</button>
      <button class="btn mark" data-publish>この内容で投稿する</button>
    </div>
    <p class="mut" style="font-size:12px">「修正する」で質問に戻れます。答えを直すと、もう一度まとめ直します。</p>`;
}
async function publish(btn) {
  btn.disabled = true; btn.textContent = "投稿しています…";
  try {
    const r = await api("/api/post", { method: "POST", body: { answers: S.draft, edited_json: S.preview.edited_json, sig: S.preview.sig } });
    MYPOSTS.add(r.id); saveLS("shk_mine", [...MYPOSTS]);
    track("post_complete", r.id, { status: r.status });
    flush();
    S.lastPosted = { id: r.id, ok: r.status === "published" };
    S.draft = {}; saveDraft(); S.preview = null; S.step = -1;
    loadFailures();
    go("/thanks", true);
  } catch (e) {
    btn.disabled = false; btn.textContent = "この内容で投稿する";
    toast(e.status === 429 ? "短い時間に投稿が続いています。少し時間をおいてください。" : e.message === "bad_signature" ? "内容の確認に失敗しました。「修正する」から、もう一度まとめてください。" : "投稿を保存できませんでした。もう一度お試しください。", 4000);
  }
}
function renderThanks() {
  const lp = S.lastPosted || { ok: true };
  $("#app").innerHTML = `<section class="thanks">
    <h1>しくった話、<br>ありがとう。</h1>
    <p>あなたの失敗が、<br>今日しくった誰かの<br>${mark("「まあ、いっか。」")}<br>になるかもしれません。</p>
    <p class="mut" style="font-size:14px">${lp.ok ? "タイムラインに載りました。" : "内容を運営が確認してから公開します。"}</p>
    <div><a class="btn" href="/">みんなのしくったを見る</a></div>
    ${lp.ok && lp.id ? `<a class="linkbtn" href="/failure/${encodeURIComponent(lp.id)}">自分の投稿を見る</a>` : ""}
  </section>`;
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
      <button class="btn" type="submit">ひらく</button>
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
  const openIds = [...document.querySelectorAll("details.aitem[open]")].map((d) => d.dataset.aid);
  const mb = (v) => (v == null ? "—" : v);
  $("#app").innerHTML = `
    <div class="adm-h"><h1>運営管理</h1><div class="abtns"><button class="btn ghost sm" data-adm-refresh>更新</button><a class="btn ghost sm" href="/">サイトへ</a></div></div>
    <h2 class="section-h" style="margin-top:6px">検証KPI · ${k.sessions || 0}セッション</h2>
    <div class="kpis">
      <div class="kpi star"><span class="k">😌 少しマシになった率</span><span class="v">${pct(k.relief_better, k.relief_n)}</span><span class="s">回答${k.relief_n || 0}件（変わらない${k.relief_same || 0}・つらくなった${k.relief_worse || 0}）</span></div>
      <div class="kpi"><span class="k">閲覧前の落ち込み平均</span><span class="v">${mb(k.mood_avg)}</span><span class="s">回答${k.mood_n || 0}件 · マシ派${mb(k.mood_avg_better)} / それ以外${mb(k.mood_avg_not_better)}</span></div>
      <div class="kpi"><span class="k">1セッションの閲覧数</span><span class="v">${k.sessions ? (k.reads_in_tl_sessions / k.sessions).toFixed(1) : "—"}</span><span class="s">読了 ${k.reads || 0} 件</span></div>
      <div class="kpi"><span class="k">詳細CTR</span><span class="v">${pct(k.opens, k.impressions)}</span><span class="s">詳細 ${k.opens || 0} / 表示 ${k.impressions || 0}</span></div>
      <div class="kpi"><span class="k">読了率</span><span class="v">${pct(k.reads, k.impressions)}</span><span class="s">読了 / 表示</span></div>
      <div class="kpi"><span class="k">リアクション率</span><span class="v">${pct(k.reactions, k.impressions)}</span><span class="s">リアクション / 表示</span></div>
      <div class="kpi"><span class="k">🤝 俺もある率</span><span class="v">${pct(k.same, k.impressions)}</span><span class="s">俺もある ${k.same || 0} / 表示</span></div>
      <div class="kpi"><span class="k">閲覧→投稿開始</span><span class="v">${pct(k.post_start_sessions, k.sessions)}</span><span class="s">${k.post_start_sessions || 0} セッション</span></div>
      <div class="kpi"><span class="k">投稿開始→完了</span><span class="v">${pct(k.post_complete_sessions, k.post_start_any)}</span><span class="s">完了 ${k.post_complete_sessions || 0} / 開始 ${k.post_start_any || 0}</span></div>
    </div>
    <div class="tabs chips" style="position:static;margin-inline:0;padding-inline:0">${tabs.map(([v, l]) => `<button class="chip" data-atab="${v}" aria-pressed="${S.adminTab === v}">${l} ${all.filter((f) => inTab(f, v)).length}</button>`).join("")}</div>
    ${S.adminTab === "dummy" && list.length ? `<div class="abtns" style="margin-bottom:10px"><button class="btn ghost sm" data-dummy="hide_dummies">ダミーをすべて非公開</button><button class="btn ghost sm" data-dummy="delete_dummies" id="del-dummy">ダミーを削除…</button></div>` : ""}
    <div class="alist">${list.map(adminItem).join("") || `<div class="empty">該当する投稿はありません。</div>`}</div>`;
  openIds.forEach((id) => { const d = document.querySelector(`details.aitem[data-aid="${CSS.escape(id)}"]`); if (d) d.open = true; });
  $("#nav").parentElement.hidden = true;
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
        <button class="btn sm ${f.status === "published" ? "ghost" : ""}" data-pub="${h(f.id)}" data-on="${f.status !== "published"}">${f.status === "published" ? "非公開にする" : "公開する"}</button>
        ${f.status === "published" ? `<a class="btn ghost sm" href="/failure/${encodeURIComponent(f.id)}" target="_blank" rel="noopener">表示を確認</a>` : ""}
      </div>
      ${f.moderation_note ? `<div class="note warn"><b>確認メモ</b><span>${h(f.moderation_note)}</span></div>` : ""}
      <div><div class="h5">原文</div>${raw ? `<dl class="kv">${rawRows.filter(([, k]) => raw[k]).map(([l, k]) => `<dt>${l}</dt><dd>${h(raw[k])}</dd>`).join("")}</dl>` : `<p class="mut">${f.is_dummy ? "ダミーデータのため原文はありません。" : "原文はありません。"}</p>`}</div>
      <div><div class="h5">編集文</div><div class="box">${h(f.edited_story || "")}</div></div>
      <div><div class="h5">PII検出</div>${(f.pii_removed || []).length ? `<div class="box">${f.pii_removed.map((x) => `「${h(x.from)}」→「${h(x.to)}」`).join("\n")}</div>` : `<p class="mut">検出なし</p>`}</div>
      <dl class="kv"><dt>カテゴリー</dt><dd>${h(f.category)} / ${h((f.subcategory || []).join(" / "))}</dd><dt>失ったもの</dt><dd>${h((f.loss_types || []).join("、"))}${f.loss_amount ? " · " + h(f.loss_amount) : ""}${f.loss_time ? " · " + h(f.loss_time) : ""}</dd><dt>現在</dt><dd>${h(f.current_status)}</dd><dt>属性</dt><dd>${h([f.age_group, f.occupation].filter(Boolean).join(" · ") || "—")}</dd></dl>
      <div class="abtns">
        <button class="btn sm" data-copy="tiktok_script" data-cid="${h(f.id)}">TikTok/Reels台本をコピー</button>
        <button class="btn sm" data-copy="instagram_carousel" data-cid="${h(f.id)}">カルーセル文をコピー</button>
        <button class="btn sm" data-copy="x_post" data-cid="${h(f.id)}">X投稿文をコピー</button>
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
document.addEventListener("click", async (e) => {
  const t = e.target.closest("button,a"); if (!t) return;
  const ds = t.dataset;
  if (ds.rx) { e.preventDefault(); return toggleReact(ds.fid, ds.rx, t); }
  if ("top" in ds) { e.preventDefault(); if (route().name !== "home") go("/"); else window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  if ("postEntry" in ds) S.step = -1;
  // 内部リンク
  if (t.tagName === "A" && t.getAttribute("href") && t.getAttribute("href").startsWith("/") && !t.target && !e.metaKey && !e.ctrlKey) {
    e.preventDefault(); return go(t.getAttribute("href"));
  }
  if (ds.filter) { S.filter = ds.filter; track("category_filter", "", { c: ds.filter }); return renderHome(); }
  if ("reload" in ds) { S.loaded = false; renderHome(); return loadFailures(); }
  if (ds.mood) {
    A.mood = +ds.mood; track("mood_answer", "", { v: A.mood });
    const m = $(".mood"); if (m) { m.innerHTML = `<div class="mood-head"><span>ありがとう。気楽に眺めていってください。</span></div>`; setTimeout(() => m.remove(), 1800); }
    return;
  }
  if ("moodX" in ds) { A.moodDismissed = true; track("mood_dismiss"); const m = $(".mood"); if (m) m.remove(); return; }
  if (ds.relief) return answerRelief(ds.relief);
  if ("reliefX" in ds) { $("#relief").hidden = true; if (!A.reliefDone) { A.reliefDone = true; track("relief_dismiss"); } return; }
  if ("back" in ds) { if (S.navCount > 0) history.back(); else go("/"); return; }
  if ("begin" in ds) { track("post_start"); S.step = 0; return renderPost(); }
  if ("resetDraft" in ds) { S.draft = {}; saveDraft(); return renderIntro(); }
  if ("stepBack" in ds) { S.step = S.step <= 0 ? -1 : S.step - 1; return renderPost(); }
  if ("stepNext" in ds) return nextStep();
  if (ds.jump) { const j = +ds.jump; if (j <= S.step || STEPS.slice(0, j).every(stepValid)) { S.step = j; renderPost(); } else toast("先に必須の質問に答えてください"); return; }
  if (ds.scale) { const st = STEPS[S.step]; S.draft[st.key] = +ds.scale; saveDraft(); renderPost(); return setTimeout(nextStep, 220); }
  if (ds.single) { const st = STEPS[S.step]; S.draft[st.key] = ds.single; saveDraft(); renderPost(); return setTimeout(nextStep, 220); }
  if (ds.loss) {
    let v = S.draft.loss_types || []; const o = ds.loss;
    if (o === "特になし") v = v.includes(o) ? [] : [o];
    else { v = v.filter((x) => x !== "特になし"); v = v.includes(o) ? v.filter((x) => x !== o) : [...v, o]; }
    if (!v.includes("お金")) delete S.draft.loss_amount;
    if (!v.includes("時間")) delete S.draft.loss_time;
    S.draft.loss_types = v; saveDraft(); return renderPost();
  }
  if (ds.set) {
    const optional = STEPS[S.step].type === "attrs";
    S.draft[ds.set] = optional && S.draft[ds.set] === ds.val ? undefined : ds.val;
    saveDraft(); return renderPost();
  }
  if ("regen" in ds) return generate();
  if ("edit" in ds) { S.step = 0; S.preview = null; return go("/post"); }
  if ("publish" in ds) return publish(t);
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
  if (r === "preview" || r === "thanks") history.replaceState(null, "", "/post");
  if (r === "post" && Object.keys(S.draft).length) S.step = -1;
}
render();
loadFailures();
})();
