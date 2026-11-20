import page from "../../../index.html?raw";
import "./selected-work.css";

export default {
  id: "portfolio-proposal",
  title: "페이지/개편 시안",
  parameters: { layout: "fullscreen" },
};

function preview(layout, comparisonTitle) {
  const doc = new DOMParser().parseFromString(page, "text/html");
  const works = doc.querySelector("#works");
  const notes = doc.querySelector("#notes-title").closest(".page");
  notes.replaceChildren(notes.querySelector("section"));

  const main = document.createElement("main");
  main.className = "project-preview";
  main.append(works, notes);

  // Storybook runs separately from the portfolio, whose pages own these links.
  const site = ["localhost", "127.0.0.1"].includes(location.hostname)
    ? "http://" + location.hostname + ":8080/"
    : "https://inwoo-jang.github.io/inwoo-portfolio/";
  main.querySelectorAll("a[href]").forEach(link => {
    link.href = new URL(link.getAttribute("href"), site).href;
  });

  if (layout === "rows") {
    works.querySelectorAll(".work__did").forEach(description => description.remove());
  }
  if (layout === "tabs") addKeywordTabs(works);
  if (layout && layout !== "bookmark") {
    works.classList.remove("works--bookmark");
    works.classList.add("preview-" + layout);
  }
  if (comparisonTitle) {
    works.id = "works-" + layout;
    const heading = works.querySelector(".works__label");
    heading.id = "title-" + layout;
    heading.textContent = comparisonTitle;
    works.setAttribute("aria-labelledby", heading.id);
    works.querySelector(".home-section-more").remove();
    return works;
  }
  return main;
}

function addKeywordTabs(works) {
  const grid = works.querySelector(".works__grid");
  const tabs = document.createElement("div");
  tabs.className = "keyword-tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "역량별 대표 프로젝트");
  const panels = Array.from(grid.querySelectorAll(".work__body"));
  const buttons = [];

  function select(index) {
    buttons.forEach((button, i) => {
      button.setAttribute("aria-selected", String(i === index));
      button.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
  }

  panels.forEach((panel, index) => {
    const keyword = panel.querySelector(".work__meta strong");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = keyword.textContent;
    keyword.remove();
    button.id = "keyword-" + index;
    panel.id = "project-" + index;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", button.id);
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", panel.id);
    button.addEventListener("click", () => select(index));
    button.addEventListener("keydown", event => {
      const count = buttons.length;
      const next = { ArrowLeft: (index + count - 1) % count, ArrowRight: (index + 1) % count, Home: 0, End: count - 1 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next);
      buttons[next].focus();
    });
    tabs.append(button);
    buttons.push(button);
  });
  const card = document.createElement("div");
  card.className = "keyword-project";
  card.append(tabs, ...panels);
  grid.replaceWith(card);
  select(0);
}

export const SelectedWork = { name: "현재 홈 · 세 카드", render: () => preview() };
export const NavyKeywords = { name: "네이비 바탕의 블루 키워드", render: () => preview("navy") };
export const Bookmark = { name: "책갈피", render: () => preview("bookmark") };
export const Underline = { name: "블루 밑줄", render: () => preview("underline") };
export const IndexColumn = { name: "왼쪽 색인", render: () => preview("index-column") };
export const CompareKeywords = {
  name: "키워드 시안 모아보기",
  render: () => {
    const main = document.createElement("main");
    main.className = "keyword-comparison";
    for (const [layout, title] of [["bookmark", Bookmark.name], ["underline", Underline.name], ["index-column", IndexColumn.name]]) {
      main.append(preview(layout, title));
    }
    return main;
  },
};
export const KeywordRows = { name: "키워드와 성과를 한 줄에", render: () => preview("rows") };
export const KeywordTabs = { name: "키워드로 골라 읽기", render: () => preview("tabs") };
