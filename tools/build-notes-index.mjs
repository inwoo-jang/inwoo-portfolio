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

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
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
  const meta = parseFrontMatter(await readFile(join(notesDir, file), "utf8"));
  const slug = file.replace(/\.md$/, "");
  if (!meta) { problems.push(`${file}: front matter 없음`); continue; }
  for (const key of ["title", "category", "date", "summary"]) {
    if (!meta[key]) problems.push(`${file}: ${key} 없음`);
  }
  if (!/^[a-z0-9-]+$/.test(slug)) problems.push(`${file}: 파일명은 영문 소문자·숫자·하이픈만`);
  if (meta.category && !categoryIds.has(meta.category)) {
    problems.push(`${file}: category는 ${[...categoryIds].join(" · ")} 중 하나`);
  }
  if (meta.categories != null && !Array.isArray(meta.categories)) {
    problems.push(`${file}: categories는 [planning, data] 형태의 배열`);
  }
  const noteCategories = [...new Set([meta.category, ...(Array.isArray(meta.categories) ? meta.categories : [])].filter(Boolean))];
  for (const id of noteCategories) {
    if (!categoryIds.has(id)) problems.push(`${file}: 알 수 없는 분류 ${id}`);
  }
  notes.push({
    slug,
    file: `${filePrefix}${file}`,
    title: meta.title || slug,
    category: meta.category || "tools",
    categories: noteCategories,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    date: meta.date || "",
    ...(meta.date_end ? { dateEnd: meta.date_end } : {}),
    ...(meta.date_type ? { dateType: meta.date_type } : {}),
    summary: meta.summary || "",
    sample: meta.sample === true,
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

if (problems.length) {
  console.error("노트 확인 필요:\n- " + problems.join("\n- "));
  process.exit(1);
}

// 완성 글을 먼저, 샘플은 뒤로. 같은 묶음 안에서는 최신순
notes.sort((a, b) => (Number(a.sample) - Number(b.sample)) || (b.date.localeCompare(a.date)) || a.title.localeCompare(b.title, lang || "ko"));
await writeFile(join(notesDir, "index.json"), JSON.stringify({ categories, notes }, null, 2) + "\n");
console.log(`${filePrefix}index.json — 노트 ${notes.length}개`);
