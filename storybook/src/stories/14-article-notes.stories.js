import exampleNote from "../../../notes/rag-citation-rules.md?raw";
import * as C from "../components.js";
import NOTE_INDEX from "../../../notes/index.json";
import "../../../script/markdown.js";   // window.renderMarkdown: 노트 본문과 같은 렌더러

const categoryStyle = (c) => `--note-ink:${c.color.ink};--note-soft:${c.color.soft};--tape:${c.color.tape}`;
const seriesLabel = (n) => { const s = n.series && (NOTE_INDEX.series || []).find((x) => x.id === n.series.id); return s ? `${s.label} · ${String(n.series.order).padStart(2, "0")}` : ""; };
const noteCards = NOTE_INDEX.notes.map((n) => ({ ...n, series: seriesLabel(n), date: n.date.replace(/-/g, ".") + (n.dateEnd ? "–" + n.dateEnd.replace(/-/g, ".").slice(n.date.slice(0, 4) === n.dateEnd.slice(0, 4) ? 5 : 0) : ""), href: `notes.html#n-${n.slug}`, category: NOTE_INDEX.categories.find((c) => c.id === n.category), categories: (n.categories || [n.category]).map((id) => NOTE_INDEX.categories.find((c) => c.id === id)) }));
const categoryFilters = () => `<ul class="chips" data-note-cats><li><button class="chip-btn" type="button" data-value="all" aria-pressed="true">전체<small>${NOTE_INDEX.notes.length}</small></button></li>${NOTE_INDEX.categories.map((c) => `<li><button class="chip-btn" type="button" data-value="${c.id}" aria-pressed="false" title="${c.description}" style="${categoryStyle(c)}">${c.label}<small>${NOTE_INDEX.notes.filter((n) => (n.categories || [n.category]).includes(c.id)).length}</small></button></li>`).join("")}</ul>`;

export default { title: "컴포넌트/글" };

export const 섹션제목 = {
  name: "섹션 제목",
  render: () => `<section class="section" style="max-width:760px">${C.sectionHead({ no: "03", title: "협업: 상대가 다음 일을 할 수 있게 넘기기", lead: "같은 기획도 받는 사람에 따라 필요한 정보가 다릅니다." })}</section>`,
};

export const 흐름도 = {
  render: () => `<div style="max-width:680px">${C.flow([
    { title: "해결할 문제와 타깃 사용자 정의" },
    { title: "PRD 작성", desc: "기능 목록을 포함합니다" },
    { title: "DB 스키마 검토와 큰 화면 와이어프레임", desc: "두 작업을 함께 진행합니다", parallel: true },
  ])}</div>`,
};

export const 표 = {
  render: () => `<div style="max-width:680px">${C.table({ head: ["상대", "넘기는 것"], rows: [["디자이너", "화면 ID와 삭제·추가·변경 내용"], ["개발자", "입출력, API·DB 명칭, 정책과 예외"], ["대표", "핵심 기능과 결정해야 할 쟁점"]], caption: "지킴컴퍼니에서 기획자로 일할 때 기준" })}</div>`,
};

export const 명세표 = {
  name: "명세 표",
  render: () => `<div style="max-width:680px">${C.table({ spec: true, keyCol: 1, head: ["QUIZ-01 문항 생성", "내용"], rows: [["입력", "자료 범위 · 문제 수 · 난이도"], ["정책", "선택한 자료 범위 안에서만 출제"], ["예외", "생성 요청이 실패하면 오류 안내와 재시도를 제공"]], caption: "공개용으로 재구성한 예시: 예외 행만 강조" })}</div>`,
};

export const 두칸비교 = {
  name: "두 칸 비교",
  render: () => `<div style="max-width:680px">${C.split({ left: { head: "AI 코딩 도구", items: ["태스크 구현", "통과 기준 1차 확인"] }, right: { head: "나", items: ["로컬 화면에서 2차 확인", "기준 미달이면 수정 태스크"] } })}</div>`,
};

export const 메모상자 = { name: "메모 상자", render: () => `<div style="max-width:680px">${C.noteBox({ label: "구현 범위", text: "Vue 3로 화면 10개를 구현하고 목업 API로 흐름을 확인했습니다. 서버와 DB는 설계 문서까지입니다." })}</div>` };

export const 목차 = {
  render: () => `<div style="max-width:240px">${C.toc({ current: "p2", items: [{ id: "p1", label: "01 기획" }, { id: "p2", label: "기획 프로세스", sub: true }, { id: "p3", label: "기능명세", sub: true }, { id: "p4", label: "02 개발" }] })}</div>`,
};

/* Dev Notes */
export const 노트목록 = {
  name: "Dev Notes · 목록",
  render: () => `<div style="max-width:880px">${C.search({})}<div style="height:16px"></div>${categoryFilters()}<div style="height:24px"></div>${C.entries(noteCards).replace('<ol class="entries">', '<ol class="entries" data-notes-grid>')}</div>`,
};

export const 분류와색상 = {
  name: "Dev Notes · 분류와 색상",
  render: () => `<div style="max-width:880px">${categoryFilters()}<ul class="notes-guide__grid">${NOTE_INDEX.categories.map((c) => `<li><span class="note-category" style="${categoryStyle(c)}">${c.label}</span><p>${c.description}</p></li>`).join("")}</ul></div>`,
};

export const 글정보 = {
  name: "Dev Notes · 글 정보 표시",
  args: { sample: true },
  render: (a) => C.docFlags({ items: ["도구 가이드", "VS Code", "macOS", "기본 단축키 기준"], sample: a.sample }),
};

/* 일반 글 · 다중 분류 · 첫 시리즈 글: 실제 index.json에서 하나씩 고른다 */
export const 카드종류 = {
  name: "Dev Notes · 카드 종류",
  render: () => {
    const plain = noteCards.find((n) => n.categories.length === 1 && !n.series);
    const multi = noteCards.find((n) => n.categories.length > 1 && !n.series);
    const first = noteCards.find((n) => n.series);
    return `<div style="max-width:880px">${C.entries([plain, multi, first].filter(Boolean)).replace('<ol class="entries">', '<ol class="entries" data-notes-grid>')}</div>`;
  },
};

/* 시리즈 목차: 실제 공개 상태(공개 1편 + 준비 중 회차)와, 1·3편이 공개된 경우 */
export const 시리즈목차 = {
  name: "Dev Notes · 시리즈 목차",
  render: () => {
    const s = (NOTE_INDEX.series || [])[0];
    if (!s) { return "<p>series.json에 시리즈가 없습니다.</p>"; }
    const current = s.items.find((i) => i.slug) || s.items[0];
    const real = C.seriesNav({ label: s.label, title: s.title, order: current.order, total: s.total, published: s.published, items: s.items });
    const items13 = s.items.map((i) => (i.order === 3 ? { ...i, slug: "example-3" } : i));
    const both = C.seriesNav({ label: s.label, title: s.title, order: current.order, total: s.total, published: s.published + 1, items: items13, next: items13.find((i) => i.order === 3).title });
    return `<div style="max-width:680px" class="reader-view">${real}<p style="margin:48px 0 0;font-size:13px;color:#6F7682">예시: 1·3편이 공개된 경우(3편은 가상의 주소)</p>${both}</div>`;
  },
};

export const 빈결과 = { name: "Dev Notes · 결과 없음", render: () => `<div style="max-width:680px">${C.emptyState({})}</div>` };

const exampleBody = exampleNote.replace(/^---[\s\S]*?\n---\n/, "");
const exampleTitle = NOTE_INDEX.notes.find((note) => note.slug === "rag-citation-rules").title;

export const 글구성 = {
  name: "Dev Notes · 글 구성",
  render: () => `<article class="reader-view" data-note-reader style="max-width:760px">
    <header><h1>${exampleTitle}</h1></header>
    <div class="md" style="margin-top:32px">${window.renderMarkdown(exampleBody, { idPrefix: "sb-" })}</div>
  </article>`,
};
