import howPage from "../../../how.html?raw";
import "./planning-entry.css";

export default {
  id: "planning-entry",
  title: "컴포넌트/기획 문서 열기",
  parameters: { layout: "fullscreen" },
};

const how = new DOMParser().parseFromString(howPage, "text/html");
const samples = [...how.querySelectorAll("[data-doc-source] .doc-sample")];
const titles = samples.map(sample => sample.dataset.docLabel);
const variants = {
  footnote: {
    name: "본문 각주",
    html: '<button class="pe-footnote" data-page="0">제가 쓰는 기획 문서 펼쳐보기 <span aria-hidden="true">↗</span></button>',
  },
  attachment: {
    name: "첨부 파일",
    html: `<button class="planning-attachment" data-page="0">${how.querySelector("[data-doc-open]").innerHTML}</button>`,
  },
  index: {
    name: "문서 색인",
    html: `<nav class="pe-index" aria-label="기획 문서 색인">
      ${titles.map((title, i) => `<button data-page="${i}">${title}</button>`).join("")}</nav>`,
  },
  excerpt: {
    name: "PRD 발췌",
    html: `<figure class="pe-excerpt"><blockquote>“읽으면 다 아는 기분임.”</blockquote>
      <figcaption>퀴켓 PRD · 대학생 페르소나의 주요 불편함</figcaption>
      <button data-page="0">이 불편함을 어떤 요구사항으로 옮겼는지 읽기</button></figure>`,
  },
  wireframe: {
    name: "와이어프레임 미리보기",
    html: `<button class="pe-wire" data-page="4"><span class="pe-wire-images" aria-hidden="true">
      <img src="/media/portfolio/wireframe-2.png" alt=""><img src="/media/portfolio/wireframe-3.png" alt=""></span>
      <span><small>퀴켓 · 와이어프레임</small><b>퀴즈 풀이와 해설 화면 펼쳐보기</b></span></button>`,
  },
};

function attachViewer(root) {
  const dialog = how.querySelector("#planning-docs").cloneNode(true);
  const body = dialog.querySelector(".doc-viewer__body");
  const position = dialog.querySelector("[data-doc-position]");
  const back = dialog.querySelector("[data-doc-prev]");
  const next = dialog.querySelector("[data-doc-next]");
  const pages = samples.map(sample => sample.cloneNode(true));
  body.append(...pages);
  // Storybook serves the project assets, while the full portfolio owns case-study URLs.
  body.querySelectorAll('[href^="media/"], [src^="media/"]').forEach(el => {
    const attr = el.hasAttribute("src") ? "src" : "href";
    el.setAttribute(attr, "/" + el.getAttribute(attr));
  });
  body.querySelectorAll('a[href^="portfolio.html"]').forEach(link => {
    link.href = "https://inwoo-jang.github.io/inwoo-portfolio/" + link.getAttribute("href");
  });
  root.append(dialog);
  let active;
  let opener;
  function select(index) {
    active = index;
    pages.forEach((page, i) => { page.hidden = i !== index; });
    position.textContent = `${index + 1} / ${pages.length} · ${titles[index]}`;
    back.disabled = index === 0;
    next.textContent = index === pages.length - 1 ? next.dataset.doneLabel : next.dataset.nextLabel;
    body.scrollTop = 0;
  }
  for (const button of root.querySelectorAll("button[data-page]")) {
    button.type = "button";
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", dialog.id);
    button.addEventListener("click", () => {
      opener = button;
      select(Number(button.dataset.page));
      dialog.showModal();
    });
  }
  back.onclick = () => select(active - 1);
  next.onclick = () => active === pages.length - 1 ? dialog.close() : select(active + 1);
  dialog.querySelector("[data-doc-close]").onclick = () => dialog.close();
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => opener.focus({ preventScroll: true }));
}

function preview(key) {
  const root = document.createElement("main");
  root.className = "pe-demo";
  if (key) {
    const flow = how.querySelector("#flow");
    root.append(flow.querySelector("h2").cloneNode(true), flow.querySelector(".flow").cloneNode(true));
    root.insertAdjacentHTML("beforeend", variants[key].html);
  } else {
    root.innerHTML = '<h1>기획 문서 열기</h1>' + Object.values(variants).map(v =>
      `<section class="pe-example"><h2>${v.name}</h2>${v.html}</section>`).join("");
  }
  attachViewer(root);
  return root;
}

export const Compare = { name: "다섯 시안 모아보기", render: () => preview() };
export const Footnote = { name: variants.footnote.name, render: () => preview("footnote") };
export const Attachment = { name: variants.attachment.name, render: () => preview("attachment") };
export const Index = { name: variants.index.name, render: () => preview("index") };
export const Excerpt = { name: variants.excerpt.name, render: () => preview("excerpt") };
export const Wireframe = { name: variants.wireframe.name, render: () => preview("wireframe") };
