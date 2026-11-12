#!/usr/bin/env node
/* ==========================================================
   tools/build-notes-index.mjs — notes/*.md 의 front matter를 읽어
   notes/index.json(노트 목록)을 만든다. 외부 패키지 없이 Node만 쓴다.

   사용: node tools/build-notes-index.mjs        → notes/index.json
         node tools/build-notes-index.mjs en     → notes/en/index.json (영어판)
   - GitHub Pages는 폴더 목록을 제공하지 않으므로, 브라우저(notes.js)는
     이 index.json으로 목록을 그리고 본문은 .md 파일을 직접 읽어 렌더링한다.
   - 밑줄(_)로 시작하는 파일(_template.md 등)은 건너뛴다.
   ========================================================== */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

// NOTES_ROOT: 검사 스크립트(tools/test-notes-index.mjs)가 임시 폴더로 바꿔 쓴다
const root = process.env.NOTES_ROOT || join(dirname(fileURLToPath(import.meta.url)), "..");
const lang = process.argv[2] === "en" ? "en" : "";
const notesDir = lang ? join(root, "notes", lang) : join(root, "notes");
const filePrefix = lang ? `notes/${lang}/` : "notes/";
const categories = JSON.parse(await readFile(join(notesDir, "categories.json"), "utf8"));
const categoryIds = new Set();
for (const category of categories) {
  if (!/^[a-z][a-z0-9-]*$/.test(category.id) || categoryIds.has(category.id)
      || !category.label || !category.description
      || !["ink", "soft", "tape"].every((key) => /^#[0-9A-Fa-f]{6}$/.test(category.color?.[key]))) {
    throw new Error(`categories.json의 분류 정의를 확인하세요: ${category.id}`);
  }
  categoryIds.add(category.id);
}

// 시리즈 — 순서가 있는 연속 글. 중앙 설정(series.json)에 라벨·제목·기획 회차를 둔다.
// 카테고리와 시리즈는 1:1이 아니다. 글은 front matter의 series·seriesOrder로 연결한다.
let seriesList = [];
try { seriesList = JSON.parse(await readFile(join(notesDir, "series.json"), "utf8")); } catch (e) { seriesList = []; }
const seriesById = new Map();
for (const series of seriesList) {
  if (!/^[a-z][a-z0-9-]*$/.test(series.id || "") || seriesById.has(series.id) || !series.label || !series.title
      || !Array.isArray(series.planned)) {
    throw new Error(`series.json의 시리즈 정의를 확인하세요: ${series.id}`);
  }
  const orders = series.planned.map((p) => p.order);
  if (orders.some((o) => !Number.isInteger(o) || o < 1) || new Set(orders).size !== orders.length) {
    throw new Error(`series.json ${series.id}: planned 회차(order)는 겹치지 않는 1 이상의 정수`);
  }
  seriesById.set(series.id, series);
}

/** "---" 사이의 key: value 줄을 읽는다. 값이 [a, b] 면 배열로. */
function parseFrontMatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    let value = m[2].trim();
    if (/^\[.*\]$/.test(value)) {
      value = value.slice(1, -1).split(",").map((v) => v.trim()).filter(Boolean);
    } else if (value === "true" || value === "false") {
      value = value === "true";
    }
    data[m[1]] = value;
  }
  return data;
}

const files = (await readdir(notesDir)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
const notes = [];
const problems = [];

for (const file of files) {
  const source = await readFile(join(notesDir, file), "utf8");
  const meta = parseFrontMatter(source);
  const slug = file.replace(/\.md$/, "");
  if (!meta) { problems.push(`${file}: front matter 없음`); continue; }
  for (const key of ["title", "category", "date", "summary"]) {
    if (!meta[key]) problems.push(`${file}: ${key} 없음`);
  }
  if (!/^[a-z0-9-]+$/.test(slug)) problems.push(`${file}: 파일명은 영문 소문자·숫자·하이픈만`);
  if (meta.category && !categoryIds.has(meta.category)) {
    problems.push(`${file}: category는 ${[...categoryIds].join(" · ")} 중 하나`);
  }
  // category = 대표 분류(카드 색). categories = 보는 사람이 찾을 만한 분류 전체(테이프 여러 장).
  // 기술·산업 키워드는 tags로 표현한다.
  if (meta.categories != null && !Array.isArray(meta.categories)) {
    problems.push(`${file}: categories는 [planning, ai] 형태의 배열`);
  }
  const noteCategories = [...new Set([meta.category, ...(Array.isArray(meta.categories) ? meta.categories : [])].filter(Boolean))];
  for (const id of noteCategories) {
    if (!categoryIds.has(id)) problems.push(`${file}: 알 수 없는 분류 ${id}`);
  }
  // 대표 분류를 포함해 서로 다른 분류 3개 이하
  if (noteCategories.length > 3) problems.push(`${file}: 분류는 대표 포함 3개 이하 (지금 ${noteCategories.length}개)`);
  let series = null;
  if (meta.series != null || meta.seriesOrder != null) {
    const order = Number(meta.seriesOrder);
    const def = seriesById.get(meta.series);
    if (meta.series == null || meta.seriesOrder == null) problems.push(`${file}: series와 seriesOrder는 함께 적는다`);
    else if (!def) problems.push(`${file}: series ${meta.series}가 series.json에 없음`);
    else if (!/^\d+$/.test(String(meta.seriesOrder)) || order < 1) problems.push(`${file}: seriesOrder는 1 이상의 정수`);
    else if (def.planned.length && !def.planned.some((p) => p.order === order)) problems.push(`${file}: ${meta.series}의 기획 회차에 ${order}회가 없음`);
    else series = { id: meta.series, order };
  }
  notes.push({
    slug,
    file: `${filePrefix}${file}`,
    revision: createHash("sha256").update(source).digest("hex").slice(0, 16),
    title: meta.title || slug,
    category: meta.category || "tools",
    categories: noteCategories,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    date: meta.date || "",
    ...(meta.updated ? { updated: meta.updated } : {}),
    ...(meta.date_end ? { dateEnd: meta.date_end } : {}),
    ...(meta.date_type ? { dateType: meta.date_type } : {}),
    summary: meta.summary || "",
    sample: meta.sample === true,
    ...(series ? { series } : {}),
    related: Array.isArray(meta.related) ? meta.related : []
  });
}

// 관련 노트: 한쪽에만 적어도 양쪽에 표시한다. 없는 슬러그·자기 자신은 오류
const bySlug = new Map(notes.map((n) => [n.slug, n]));
for (const note of notes) {
  for (const target of note.related) {
    if (target === note.slug) problems.push(`${note.slug}.md: related에 자기 자신`);
    else if (!bySlug.has(target)) problems.push(`${note.slug}.md: related의 ${target} 노트가 없음`);
  }
}
if (!problems.length) {
  for (const note of notes) {
    for (const target of note.related) {
      const other = bySlug.get(target);
      if (!other.related.includes(note.slug)) other.related.push(note.slug);
    }
  }
}

// 시리즈 회차 중복 검사
const seen = new Map();
for (const note of notes) {
  if (!note.series) continue;
  const key = note.series.id + "#" + note.series.order;
  if (seen.has(key)) problems.push(`${note.slug}.md: ${note.series.id} ${note.series.order}회차가 ${seen.get(key)}.md와 겹침`);
  else seen.set(key, note.slug);
}

if (problems.length) {
  console.error("노트 확인 필요:\n- " + problems.join("\n- "));
  process.exit(1);
}

// 완성 글을 먼저, 샘플은 뒤로. 같은 묶음 안에서는 최신순
notes.sort((a, b) => (Number(a.sample) - Number(b.sample)) || (b.date.localeCompare(a.date)) || a.title.localeCompare(b.title, lang || "ko"));
// 시리즈 목차: 기획 회차와 게시된 글을 합친다. 게시되지 않은 회차는 slug 없이(링크 없이) 둔다.
const series = seriesList.map((s) => {
  const published = notes.filter((n) => n.series && n.series.id === s.id);
  const byOrder = new Map(published.map((n) => [n.series.order, n]));
  const orders = [...new Set([...s.planned.map((p) => p.order), ...byOrder.keys()])].sort((a, b) => a - b);
  const items = orders.map((order) => {
    const note = byOrder.get(order);
    const plan = s.planned.find((p) => p.order === order);
    return note ? { order, title: note.title, slug: note.slug } : { order, title: plan.title };
  });
  return { id: s.id, label: s.label, title: s.title, description: s.description || "", total: items.length,
    published: published.length, items };
});
const data = { categories, series, notes };
await writeFile(join(notesDir, "index.json"), JSON.stringify(data, null, 2) + "\n");
// Embed metadata so opening a note does not wait for a separate index request.
// Escape HTML-sensitive characters even though this is a non-executable JSON block.
const embedded = JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (char) =>
  "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
const pagePath = join(root, lang ? "notes.en.html" : "notes.html");
let page = await readFile(pagePath, "utf8");
const block = `<script type="application/json" id="notes-data">${embedded}</script>`;
if (/<script type="application\/json" id="notes-data">[\s\S]*?<\/script>/.test(page)) {
  page = page.replace(/<script type="application\/json" id="notes-data">[\s\S]*?<\/script>/, () => block);
} else {
  page = page.replace('  <script src="script/notes.js"></script>', () => `  ${block}\n  <script src="script/notes.js"></script>`);
}
await writeFile(pagePath, page);
console.log(`${filePrefix}index.json — 노트 ${notes.length}개`);
