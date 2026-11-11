/* ==========================================================
   inwoo.log 컴포넌트 — HTML 문자열을 돌려주는 함수
   - 스타일은 사이트와 같은 css/ds.css
   - 문자열 입력은 모두 esc()로 이스케이프한다. 의도한 마크업만 html 인자로 받는다.
   ========================================================== */

export const esc = (v = "") =>
  String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const NAV = [
  ["index.html", "Home"],
  ["profile.html", "Profile"],
  ["portfolio.html", "Portfolio"],
  ["how.html", "How I Work"],
  ["notes.html", "Dev Notes"],
];

/* ---------- 내비게이션 ---------- */
export function siteHeader({ current = "Home", dark = true } = {}) {
  return `<header class="site-header${dark ? " site-header--dark" : ""}">
  <div class="site-header__inner">
    <a class="wordmark" href="index.html" aria-label="inwoo.log 홈">inwoo<span>.log</span></a>
    <button type="button" class="nav-toggle" aria-label="메뉴 열기" aria-expanded="false" onclick="document.body.classList.toggle('nav-open')">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" aria-label="주요 메뉴">
      <ul>${NAV.map(([href, label]) => `<li><a href="${href}"${label === current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul>
    </nav>
  </div>
</header>`;
}

export function siteFooter() {
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <p>inwoo.log — 장인우의 기획·개발 기록 · © 2026</p>
    <ul>
      <li><a href="mailto:roseprincess0331@gmail.com">이메일</a></li>
      <li><a href="https://github.com/inwoo-jang" target="_blank" rel="noopener">GitHub</a></li>
    </ul>
  </div>
</footer>`;
}

export function crumb(items = []) {
  return `<nav class="crumb" aria-label="현재 위치">${items
    .map(([label, href], i) => (href && i < items.length - 1 ? `<a href="${href}">${esc(label)}</a>` : `<span>${esc(label)}</span>`))
    .join(' <span aria-hidden="true">/</span> ')}</nav>`;
}

export function pager({ prev, next } = {}) {
  return `<nav class="pager" aria-label="다른 글">
  ${prev ? `<a href="${prev.href}"><small>← 이전</small><strong>${esc(prev.label)}</strong></a>` : "<span></span>"}
  ${next ? `<a class="pager__next" href="${next.href}"><small>다음 →</small><strong>${esc(next.label)}</strong></a>` : ""}
</nav>`;
}

/* ---------- 기본 요소 ---------- */
export function button({ label = "버튼", href = "#", variant = "default" } = {}) {
  const cls = { default: "btn", primary: "btn btn--primary", quiet: "btn btn--quiet" }[variant] || "btn";
  return `<a class="${cls}" href="${href}">${esc(label)}</a>`;
}

export function linkArrow({ label = "더 보기", href = "#" } = {}) {
  return `<a class="link-arrow" href="${href}">${esc(label)}</a>`;
}

export function tags(items = []) {
  return `<ul class="tags" aria-label="태그">${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
}

/** 진행 상태 — live: 운영 적용·출시 / edu: 교육 실습 / 그 밖: 프로토타입·기획 단계·개인 사용 */
export function status({ label = "운영 적용", kind = "live" } = {}) {
  const cls = kind === "live" ? "status status--live" : kind === "edu" ? "status status--edu" : "status";
  return `<span class="${cls}">${esc(label)}</span>`;
}

export function chips({ items = [], pressed = 0, label = "분류" } = {}) {
  return `<ul class="chips" role="group" aria-label="${esc(label)}">${items
    .map((it, i) => {
      const [text, count] = Array.isArray(it) ? it : [it];
      return `<li><button type="button" class="chip-btn" aria-pressed="${i === pressed}">${esc(text)}${count != null ? `<small>${count}</small>` : ""}</button></li>`;
    })
    .join("")}</ul>`;
}

export function search({ label = "검색", placeholder = "제목·요약·태그로 찾기" } = {}) {
  return `<div class="search"><label class="visually-hidden" for="q">${esc(label)}</label><input id="q" type="search" placeholder="${esc(placeholder)}" autocomplete="off"></div>`;
}

/* 사이트와 같은 크기·아이콘을 쓰는 보기 전환. 동작은 호출하는 화면에서 연결한다. */
export function viewSwitch({ variant = "gray", selected = "cards", second = "list", controls = "", label = "보기 방식" } = {}) {
  const grid = Array.from({ length: 9 }, (_, i) => `<rect x="${3 + (i % 3) * 7}" y="${3 + Math.floor(i / 3) * 7}" width="4" height="4" rx="1"/>`).join("");
  const icons = {
    cards: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">${grid}</svg>`,
    list: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M9 5h12M9 12h12M9 19h12"/><path d="M3 5h1M3 12h1M3 19h1" stroke-width="3"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/><path d="M12 6v15M6 9h3M6 12h3M15 9h3M15 12h3"/></svg>',
  };
  const labels = { cards: "카드로 보기", list: "리스트로 보기", book: "연습장으로 넘겨 보기" };
  const modifier = { outline: " view-switch--outline", minimal: " view-switch--minimal", white: " view-switch--white", black: " view-switch--black" }[variant] || "";
  const modes = ["cards", second === "book" ? "book" : "list"];
  return `<div class="view-switch${modifier}" role="group" aria-label="${esc(label)}">${modes.map((mode) => `<button type="button" class="view-switch__button" data-mode="${mode}" aria-label="${labels[mode]}" title="${labels[mode]}" aria-pressed="${selected === mode}"${controls ? ` aria-controls="${esc(controls)}"` : ""}>${icons[mode]}</button>`).join("")}</div>`;
}

/* ---------- 소개 ---------- */
export function hero({ name, role, title, summary = [], actions = [], profile }) {
  return `<section class="hero" aria-labelledby="hero-title">
  <div>
    <p class="hero__name"><b>${esc(name)}</b>${esc(role)}</p>
    <h1 class="hero__title" id="hero-title">${esc(title)}</h1>
    <ul class="hero__summary">${summary.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    <div class="hero__actions">${actions.map(button).join("")}</div>
  </div>
  ${profile ? profileCard(profile) : ""}
</section>`;
}

export function profileCard({ initial = "프로필", rows = [] } = {}) {
  return `<aside class="profile-card" aria-label="요약 정보">
  <h2 class="profile-card__head">Profile</h2>
  <dl>${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
</aside>`;
}

export function figures(items = []) {
  return `<div class="figures">${items
    .map((f) => `<p class="figure-num"><span class="figure-num__value">${esc(f.value)}</span><span class="figure-num__label">${esc(f.label)}</span>${f.scope ? `<span class="figure-num__scope">${esc(f.scope)}</span>` : ""}</p>`)
    .join("")}</div>`;
}

export function quote({ text, cite }) {
  return `<blockquote class="quote"><p>“${esc(text)}”</p><cite>${esc(cite)}</cite></blockquote>`;
}

export function contact({ title = "새로운 기회를 기다립니다", desc = "", email = "roseprincess0331@gmail.com" } = {}) {
  return `<section class="contact" aria-label="연락">
  <div><h2>${esc(title)}</h2><p>${esc(desc)}</p></div>
  <div class="hero__actions">
    <a class="btn btn--primary" href="mailto:${esc(email)}">이메일 보내기</a>
    <a class="btn btn--quiet" href="https://github.com/inwoo-jang" target="_blank" rel="noopener">GitHub</a>
  </div>
</section>`;
}

/* ---------- 프로젝트 ---------- */
export function projectCard(p) {
  const thumb = p.image
    ? `<div class="card__thumb"><img src="${esc(p.image)}" alt="${esc(p.imageAlt || "")}" loading="lazy"></div>`
    : `<div class="card__thumb card__thumb--text"><strong>${esc(p.headline || p.title)}</strong>${p.headlineScope ? `<span>${esc(p.headlineScope)}</span>` : ""}</div>`;
  return `<li class="card">
  ${thumb}
  <div class="card__body">
    <p class="card__top"><span>${esc(p.kind)} · ${esc(p.period)}</span>${status(p.status)}</p>
    <h3 class="card__title"><a href="${esc(p.href || "#")}">${esc(p.title)}</a></h3>
    <p class="card__result">${esc(p.result)}</p>
    <p class="card__role">${esc(p.role)}</p>
    ${tags(p.tags || [])}
  </div>
</li>`;
}

export function projectCards(list = []) {
  return `<ul class="cards">${list.map(projectCard).join("")}</ul>`;
}

/** 프로젝트 상세 머리의 사실 줄 — 기간 · 소속 · 내 역할 · 구현 · 상태 */
export function facts(rows = []) {
  return `<dl class="facts">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
}

export function shot({ src, alt, caption, notes = [] } = {}) {
  const img = src
    ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">`
    : `<div class="empty" role="img" aria-label="${esc(alt || "스크린샷 자리")}">스크린샷 자리 — 공개 가능한 화면을 확인한 뒤 넣습니다</div>`;
  return `<figure class="shot">${img}<figcaption>${esc(caption || "")}</figcaption>${
    notes.length ? `<ol class="shot-notes">${notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ol>` : ""
  }</figure>`;
}

/* ---------- 프로필 ---------- */
export function timeline(items = []) {
  return `<ol class="timeline">${items
    .map((t) => `<li class="timeline__item"><span class="timeline__when">${esc(t.when)}</span><div class="timeline__what"><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p></div></li>`)
    .join("")}</ol>`;
}

/* ---------- 글 ---------- */
export function sectionHead({ no, title, lead }) {
  return `<span class="section__no">${esc(no)}</span><h2>${esc(title)}</h2>${lead ? `<p class="section__lead">${esc(lead)}</p>` : ""}`;
}

export function flow(steps = []) {
  return `<ol class="flow">${steps
    .map((s) => `<li class="flow__step${s.parallel ? " flow__step--parallel" : ""}"><span class="flow__title">${esc(s.title)}</span>${s.desc ? `<span class="flow__desc">${esc(s.desc)}</span>` : ""}</li>`)
    .join("")}</ol>`;
}

export function table({ head = [], rows = [], caption, spec = false, keyCol } = {}) {
  return `<div class="table-wrap"><table class="table${spec ? " table--spec" : ""}">${caption ? `<caption>${esc(caption)}</caption>` : ""}
<thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead>
<tbody>${rows
    .map((r) => `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map((c, i) => `<td${keyCol === i + 1 ? ' class="is-key"' : ""}>${esc(c)}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
}

export function split({ left, right }) {
  const col = (c) => `<div class="split__col"><span class="split__head">${esc(c.head)}</span><ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`;
  return `<div class="split">${col(left)}${col(right)}</div>`;
}

export function noteBox({ label, text }) {
  return `<div class="note-box"><span class="note-box__label">${esc(label)}</span><p>${esc(text)}</p></div>`;
}

export function toc({ items = [], current } = {}) {
  return `<nav class="toc" aria-label="이 글의 목차"><p class="toc__title">목차</p><ol>${items
    .map((i) => `<li${i.sub ? ' class="toc__sub"' : ""}><a href="#${esc(i.id)}"${i.id === current ? ' aria-current="true"' : ""}>${esc(i.label)}</a></li>`)
    .join("")}</ol></nav>`;
}

/* ---------- 글 목록 · Dev Notes ---------- */
export function entry({ date, title, href = "#", summary, tags: t = [], category, categories: related = [] } = {}) {
  const palette = category?.color;
  const categoryAttrs = palette ? ` data-category="${esc(category.id)}" style="--note-ink:${esc(palette.ink)};--note-soft:${esc(palette.soft)};--tape:${esc(palette.tape)}"` : "";
  const allCategories = related.length ? related : category ? [category] : [];
  const tapes = allCategories.length ? `<div class="note-tapes" role="img" aria-label="${esc('분류: ' + allCategories.map((c) => c.label).join(', '))}">${allCategories.map((c) => `<span class="note-tape" style="--tape:${esc(c.color.tape)}" title="${esc(c.label)}" aria-hidden="true"></span>`).join("")}</div>` : "";
  const badges = allCategories.map((c) => `<span class="note-category" style="--note-ink:${esc(c.color.ink)};--note-soft:${esc(c.color.soft)};--tape:${esc(c.color.tape)}">${esc(c.label)}</span>`).join("");
  return `<li class="entry"${categoryAttrs}>${tapes}<div class="entry__meta"><span class="entry__date">${esc(date)}</span><div class="entry__categories">${badges}</div></div><div class="entry__body"><h3 class="entry__title"><a href="${esc(href)}">${esc(title)}</a></h3><p class="entry__summary">${esc(summary)}</p>${tags(t)}</div></li>`;
}

export function entries(list = []) {
  return `<ol class="entries">${list.map(entry).join("")}</ol>`;
}

/** 글 정보 표시 — 글 유형 · 도구 · 대상 버전 · OS · 샘플 여부 */
export function docFlags({ items = [], sample = false } = {}) {
  return `<ul class="doc-flags">${items.map((i) => `<li>${esc(i)}</li>`).join("")}${sample ? '<li class="is-sample">샘플 — 실제 사용 기록 아님</li>' : ""}</ul>`;
}

export function emptyState({ text = "조건에 맞는 글이 없습니다. 다른 키워드나 ‘전체’로 찾아보세요." } = {}) {
  return `<p class="empty" role="status">${esc(text)}</p>`;
}

/* ---------- 레이아웃 ---------- */
export const page = (inner) => `<div class="page">${inner}</div>`;
export const pageHead = ({ eyebrow, title, lead, meta = [] }) =>
  `<header class="page-head"><p class="eyebrow">${esc(eyebrow)}</p><h1 class="display">${esc(title)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ""}${
    meta.length ? `<p class="meta">${meta.map((m) => `<span>${esc(m)}</span>`).join("")}</p>` : ""
  }</header>`;
