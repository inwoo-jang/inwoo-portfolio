#!/usr/bin/env node
/* ==========================================================
   tools/test-notes-index.mjs — 노트 인덱스 생성기의 핵심 계약 검사
   사용: node tools/test-notes-index.mjs
   - 임시 폴더에 작은 노트 묶음을 만들고 build-notes-index.mjs를 실행해 결과를 확인한다.
   - 실제 notes/ 파일은 건드리지 않는다.
   검사하는 계약
   1. 분류: 대표(category) 포함 중복 없는 집합, 대표가 맨 앞, 3개 초과·알 수 없는 분류는 오류
   2. 시리즈: series·seriesOrder 짝, 존재하는 ID, 기획 회차와 일치, 같은 언어 안 회차 중복은 오류
   3. 시리즈 목차: 게시된 회차만 slug(링크)가 있고, 게시 편수는 실제 글 수
   4. 언어별 독립: 한국어 1편과 영어 1편은 중복 오류가 아니다
   ========================================================== */
import { mkdtemp, mkdir, writeFile, readFile, copyFile, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const builder = join(repo, "tools", "build-notes-index.mjs");
let failures = 0;

async function fixture(notesByLang) {
  const root = await mkdtemp(join(tmpdir(), "notes-test-"));
  for (const [lang, notes] of Object.entries(notesByLang)) {
    const dir = lang === "ko" ? join(root, "notes") : join(root, "notes", lang);
    await mkdir(dir, { recursive: true });
    const src = lang === "ko" ? join(repo, "notes") : join(repo, "notes", lang);
    await copyFile(join(src, "categories.json"), join(dir, "categories.json"));
    await copyFile(join(src, "series.json"), join(dir, "series.json"));
    for (const [slug, fm] of Object.entries(notes)) {
      const lines = Object.entries({ title: slug, date: "2026-11-01", summary: "s", sample: "false", ...fm })
        .map(([k, v]) => `${k}: ${v}`);
      await writeFile(join(dir, slug + ".md"), `---\n${lines.join("\n")}\n---\n\n본문\n`);
    }
    const page = lang === "ko" ? "notes.html" : `notes.${lang}.html`;
    await writeFile(join(root, page), '<html>\n  <script src="script/notes.js"></script>\n</html>\n');
  }
  return root;
}

function build(root, lang) {
  try {
    execFileSync("node", [builder, ...(lang === "ko" ? [] : [lang])], { env: { ...process.env, NOTES_ROOT: root }, stdio: "pipe" });
    return { ok: true };
  } catch (e) {
    return { ok: false, message: String(e.stderr) };
  }
}

async function check(name, fn) {
  try { await fn(); console.log("ok   " + name); }
  catch (e) { failures++; console.log("FAIL " + name + "\n     " + e.message.split("\n").join("\n     ")); }
}

async function expectError(name, notes, pattern) {
  await check(name, async () => {
    const root = await fixture({ ko: notes });
    const r = build(root, "ko");
    await rm(root, { recursive: true, force: true });
    assert.equal(r.ok, false, "오류가 나야 하는데 통과했다");
    assert.match(r.message, pattern);
  });
}

await check("분류: 대표 포함 중복 없는 집합, 대표가 맨 앞", async () => {
  const root = await fixture({ ko: {
    a: { category: "ax" },
    b: { category: "planning", categories: "[ai, planning, ai]" },
    c: { category: "ax", categories: "[ax, planning]" }
  } });
  assert.equal(build(root, "ko").ok, true);
  const data = JSON.parse(await readFile(join(root, "notes", "index.json"), "utf8"));
  const by = Object.fromEntries(data.notes.map((n) => [n.slug, n.categories]));
  assert.deepEqual(by.a, ["ax"]);
  assert.deepEqual(by.b, ["planning", "ai"]);
  assert.deepEqual(by.c, ["ax", "planning"]);
  await rm(root, { recursive: true, force: true });
});

await expectError("분류: 대표 포함 4개면 오류",
  { a: { category: "ax", categories: "[planning, ai, data]" } }, /3개 이하/);
await expectError("분류: 알 수 없는 분류면 오류",
  { a: { category: "ax", categories: "[nope]" } }, /알 수 없는 분류 nope/);
await expectError("시리즈: seriesOrder 없이 series만 있으면 오류",
  { a: { category: "ax", series: "domain-ax" } }, /함께 적는다/);
await expectError("시리즈: 없는 시리즈 ID면 오류",
  { a: { category: "ax", series: "nope", seriesOrder: "1" } }, /series.json에 없음/);
await expectError("시리즈: 기획에 없는 회차면 오류",
  { a: { category: "ax", series: "domain-ax", seriesOrder: "8" } }, /기획 회차에 8회가 없음/);
await expectError("시리즈: 0이나 정수가 아닌 회차는 오류",
  { a: { category: "ax", series: "domain-ax", seriesOrder: "1.5" } }, /1 이상의 정수/);
await expectError("시리즈: 같은 언어 안 회차 중복은 오류",
  { a: { category: "ax", series: "domain-ax", seriesOrder: "1" }, b: { category: "ax", series: "domain-ax", seriesOrder: "1" } }, /겹침/);

await check("시리즈 목차: 1·3편만 게시되면 2편은 링크 없이, 게시 편수 2", async () => {
  const root = await fixture({ ko: {
    one: { category: "ax", series: "domain-ax", seriesOrder: "1" },
    three: { category: "ax", series: "domain-ax", seriesOrder: "3" },
    plain: { category: "planning" }
  } });
  assert.equal(build(root, "ko").ok, true);
  const s = JSON.parse(await readFile(join(root, "notes", "index.json"), "utf8")).series[0];
  assert.equal(s.published, 2);
  assert.equal(s.total, 7);
  assert.deepEqual(s.items.filter((i) => i.slug).map((i) => [i.order, i.slug]), [[1, "one"], [3, "three"]]);
  assert.equal(s.items.find((i) => i.order === 2).slug, undefined);
  await rm(root, { recursive: true, force: true });
});

await check("언어별 독립: 한국어 1편과 영어 1편은 각각 정상", async () => {
  const root = await fixture({
    ko: { x: { category: "ax", series: "domain-ax", seriesOrder: "1" } },
    en: { x: { category: "ax", series: "domain-ax", seriesOrder: "1" } }
  });
  assert.equal(build(root, "ko").ok, true);
  assert.equal(build(root, "en").ok, true);
  const en = JSON.parse(await readFile(join(root, "notes", "en", "index.json"), "utf8"));
  assert.equal(en.series[0].published, 1);
  await rm(root, { recursive: true, force: true });
});

console.log(failures ? `\n${failures}개 실패` : "\n모두 통과");
process.exit(failures ? 1 : 0);
