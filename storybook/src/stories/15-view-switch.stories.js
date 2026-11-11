import * as C from "../components.js";
import NOTE_INDEX from "../../../notes/index.json";

export default {
  title: "컴포넌트/보기 전환",
  parameters: { layout: "padded" },
};

const variants = [
  { id: "gray", title: "A · 연한 회색", description: "흰색 아이콘을 유지하고, 배경을 밝게 낮춘 시안입니다." },
  { id: "outline", title: "B · 얇은 테두리", description: "흰 바탕에 얇은 회색 선. 사이트의 필터·입력창과 같은 느낌입니다." },
  { id: "minimal", title: "C · 박스 없이", description: "외곽선을 없애고 선택한 아이콘에만 옅은 회색 바탕과 밑줄을 표시합니다." },
  { id: "white", title: "D · 화이트 바탕 / 블랙 선택", description: "현재 사이트 적용안. 흰 바탕에서 선택한 버튼만 검정으로 채웁니다. 선택한 버튼의 아이콘은 흰색입니다." },
  { id: "black", title: "E · 블랙 바탕 / 화이트 선택", description: "검정 바탕에서 선택한 버튼만 흰색으로 채웁니다. 선택한 버튼의 아이콘은 검정입니다." },
];

function interactive(html) {
  const root = document.createElement("div");
  root.innerHTML = html;
  root.querySelectorAll(".view-switch").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-mode]");
      if (!button) return;
      group.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      const targetId = button.getAttribute("aria-controls");
      const target = targetId && root.querySelector(`#${targetId}`);
      if (target) target.dataset.layout = button.dataset.mode;
    });
  });
  return root;
}

function sampleRow(variant) {
  return `<section style="padding:24px 0;border-bottom:1px solid var(--rule)">
    <h2 style="font-size:var(--fs-h3);margin-bottom:8px">${variant.title}</h2>
    <p style="font-size:var(--fs-small);color:var(--muted);margin-bottom:24px">${variant.description}</p>
    <div class="page-head__top"><p class="eyebrow">Portfolio</p>${C.viewSwitch({ variant: variant.id, second: "book", label: "프로젝트 보기 방식" })}</div>
    <div class="page-head__top" style="margin-bottom:0"><p class="eyebrow">Dev Notes</p>${C.viewSwitch({ variant: variant.id, label: "노트 보기 방식" })}</div>
  </section>`;
}

export const Comparison = {
  name: "5가지 시안 비교",
  render: () => interactive(`<div style="max-width:880px;margin:auto;padding:16px 0"><h1 style="font-size:var(--fs-h2)">보기 전환 시안</h1><p style="margin-top:12px;color:var(--muted);font-size:var(--fs-small)">모두 박스 높이 32px · 아이콘 15px. 아이콘을 눌러 선택 상태를 비교할 수 있습니다.</p>${variants.map(sampleRow).join("")}</div>`),
};

const individual = (id) => ({ render: () => interactive(`<div style="max-width:880px;margin:auto">${sampleRow(variants.find((v) => v.id === id))}</div>`) });
export const SoftGray = { name: "A · 연한 회색", ...individual("gray") };
export const Outline = { name: "B · 얇은 테두리", ...individual("outline") };
export const Minimal = { name: "C · 박스 없이", ...individual("minimal") };
export const White = { name: "D · 화이트 바탕 / 블랙 선택", ...individual("white") };
export const Black = { name: "E · 블랙 바탕 / 화이트 선택", ...individual("black") };

export const MonochromeComparison = {
  name: "화이트·블랙 비교",
  render: () => interactive(`<div style="max-width:880px;margin:auto;padding:16px 0"><h1 style="font-size:var(--fs-h2)">화이트와 블랙</h1><p style="margin-top:12px;color:var(--muted);font-size:var(--fs-small)">같은 크기로 바탕과 선택 색만 반전했습니다. 아이콘을 눌러 비교해 보세요.</p>${variants.filter((v) => v.id === "white" || v.id === "black").map(sampleRow).join("")}</div>`),
};

export const PageExample = {
  name: "Dev Notes에서 비교",
  args: { variant: "white" },
  argTypes: { variant: { options: variants.map((v) => v.id), control: "inline-radio", description: "보기 전환 스타일" } },
  render: ({ variant }) => {
    const notes = NOTE_INDEX.notes.slice(0, 3).map((note) => ({
      ...note, date: note.date.replace(/-/g, "."), href: `notes.html#n-${note.slug}`,
      category: NOTE_INDEX.categories.find((c) => c.id === note.category),
      categories: (note.categories || [note.category]).map((id) => NOTE_INDEX.categories.find((c) => c.id === id)),
    }));
    return interactive(`<div style="max-width:1072px;margin:auto;padding:24px 0">
      <header class="page-head page-head--wide"><div class="page-head__top"><p class="eyebrow">Dev Notes</p>${C.viewSwitch({ variant, label: "노트 보기 방식", controls: "preview-notes" })}</div>
      <h1 class="display">기획 판단과 AI 구현 기록</h1><p class="lead">어떤 문제에 AI를 적용하고, 어떤 기술을 선택할지 판단하는 기준을 정리합니다.</p></header>
      <p class="count">노트 3개 · 시안 확인용</p>${C.entries(notes).replace('<ol class="entries">', '<ol class="entries" id="preview-notes" data-notes-grid data-layout="cards">')}
    </div>`);
  },
};
