#!/usr/bin/env node
/* ==========================================================
   tools/build-notes-index.mjs — notes/*.md 의 front matter를 읽어
   notes/index.json(노트 목록)을 만든다. 외부 패키지 없이 Node만 쓴다.

   사용: node tools/build-notes-index.mjs
   - GitHub Pages는 폴더 목록을 제공하지 않으므로, 브라우저(notes.js)는
     이 index.json으로 목록을 그리고 본문은 .md 파일을 직접 읽어 렌더링한다.
   - 밑줄(_)로 시작하는 파일(_template.md 등)은 건너뛴다.
   ========================================================== */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const notesDir = join(root, "notes");
const CATEGORIES = ["tools", "ai", "backend", "infra", "testing", "troubleshooting"];

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
  if (meta.category && !CATEGORIES.includes(meta.category)) {
    problems.push(`${file}: category는 ${CATEGORIES.join(" · ")} 중 하나`);
  }
  notes.push({
    slug,
    file: `notes/${file}`,
    title: meta.title || slug,
    category: meta.category || "troubleshooting",
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    date: meta.date || "",
    summary: meta.summary || "",
    sample: meta.sample === true
  });
}

if (problems.length) {
  console.error("노트 확인 필요:\n- " + problems.join("\n- "));
  process.exit(1);
}

notes.sort((a, b) => (b.date.localeCompare(a.date)) || a.title.localeCompare(b.title, "ko"));
await writeFile(join(notesDir, "index.json"), JSON.stringify({ notes }, null, 2) + "\n");
console.log(`notes/index.json — 노트 ${notes.length}개`);
