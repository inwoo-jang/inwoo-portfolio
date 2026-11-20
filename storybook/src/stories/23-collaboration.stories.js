import source from "../../../how.html?raw";
import "./collaboration.css";

export default {
  id: "collaboration-layouts",
  title: "컴포넌트/협업 섹션",
  parameters: { layout: "fullscreen" },
};

const original = new DOMParser().parseFromString(source, "text/html").querySelector("#collab");
const handoffs = [...original.querySelectorAll("tbody tr")].map(row => ({
  role: row.cells[0].textContent,
  note: row.cells[1].textContent,
}));
const cases = [...original.querySelectorAll(".plain-list li")].map(item => {
  const label = item.querySelector("strong").textContent;
  return { label: label.replace(/\.$/, ""), body: item.textContent.slice(label.length).replace(/^[:\s]+/, "") };
});
const headlines = [
  "첫 아이디어 회의 이후, 회의는 30분 안에",
  "결정한 것, 남은 질문, 바로 할 일",
  "발표 직전, 어떤 화면을 남길지 정할 때",
  "급여 기능을 배포한 뒤에도 손으로 계산하던 이유",
];
const contexts = ["퀴켓", "회의 기록", "EDU:UP", "지킴컴퍼니"];
const handoffTitle = "지킴컴퍼니에서 상대별로 전달한 내용";
const layouts = { sheet: "상대별 전달표", files: "펼쳐보는 사례", reader: "협업 기록집" };

function roleList() {
  return `<dl class="co-roles">${handoffs.map(({role, note}) =>
    `<div><dt>${role}</dt><dd>${note}</dd></div>`).join("")}</dl>`;
}

function sheet() {
  return `<h3>${handoffTitle}</h3>${roleList()}
    <h3>실제 협업 사례</h3><dl class="co-rows">${cases.map(({label, body}) =>
      `<div><dt>${label}</dt><dd>${body}</dd></div>`).join("")}</dl>`;
}

function files() {
  return `<div class="co-files">${cases.map(({body}, i) =>
    `<details ${i === 0 ? "open" : ""}><summary><span><small>${contexts[i]}</small><b>${headlines[i]}</b></span></summary>
      <p>${body}</p></details>`).join("")}
    <details><summary><span><small>전달 자료</small><b>${handoffTitle}</b></span></summary>${roleList()}</details></div>`;
}

function reader(area) {
  const entries = [
    ...cases.map(({label, body}, i) => ({label, title: headlines[i], content: `<p>${body}</p>`, context: contexts[i]})),
    { label: "상대별 전달 자료", title: handoffTitle, content: roleList(), context: "전달 자료" },
  ];
  area.innerHTML = `<div class="co-reader"><fieldset class="co-index"><legend>협업 기록 목차</legend>
    ${entries.map(({label}, i) => `<label><input type="radio" name="co-entry" value="${i}" ${i === 0 ? "checked" : ""}><span>${label}</span></label>`).join("")}
    </fieldset><article class="co-page" aria-live="polite"></article></div>`;
  const page = area.querySelector(".co-page");
  function select(i) {
    const entry = entries[i];
    page.innerHTML = `<small>${entry.context}</small><h3>${entry.title}</h3>${entry.content}`;
  }
  area.querySelector(".co-index").onchange = event => select(Number(event.target.value));
  select(0);
}

function preview(initial, compare = false) {
  const root = document.createElement("main");
  root.className = "co-preview";
  if (compare) {
    root.innerHTML = `<fieldset class="co-switch"><legend>협업 섹션 시안 비교</legend>${Object.entries(layouts).map(([key, name]) =>
      `<label><input type="radio" name="co-layout" value="${key}" ${key === initial ? "checked" : ""}><span>${name}</span></label>`).join("")}</fieldset>`;
  }
  const section = document.createElement("section");
  section.innerHTML = `<h2>협업</h2><p class="co-lead">${original.querySelector(".section__lead").textContent}</p><div class="co-content"></div>`;
  root.append(section);
  const area = section.querySelector(".co-content");
  function show(layout) {
    if (layout === "reader") reader(area);
    else area.innerHTML = layout === "sheet" ? sheet() : files();
  }
  if (compare) root.querySelector(".co-switch").onchange = event => show(event.target.value);
  show(initial);
  return root;
}

export const Compare = { name: "세 가지 시안 비교", render: () => preview("files", true) };
export const Handoff = { name: layouts.sheet, render: () => preview("sheet") };
export const CaseFiles = { name: layouts.files, render: () => preview("files") };
export const Casebook = { name: layouts.reader, render: () => preview("reader") };
