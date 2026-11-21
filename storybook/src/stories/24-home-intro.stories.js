import homeSource from "../../../index.html?raw";
import "./home-intro.css";

export default {
  id: "home-intro-styles",
  title: "컴포넌트/홈 소개 스타일",
  parameters: { layout: "fullscreen" },
};

const home = new DOMParser().parseFromString(homeSource, "text/html");
const heading = home.querySelector(".intro__heading");
const name = (heading.querySelector(".intro__name-text") || heading.querySelector(".intro__who")).textContent.trim();
const roles = [...heading.querySelectorAll(".intro__kw")].map(el => el.textContent);
const summary = heading.querySelector(".intro__lead").textContent;
const profile = home.querySelector(".intro-profile").outerHTML;
const variants = {
  poster: { number: "01", name: "타이포 포스터", note: "세 직무를 큰 글자로 쌓고, 핵심 단어에만 밑줄을 더했습니다. 기존 다크 홈에 자연스럽게 연결되는 방향입니다." },
  index: { number: "02", name: "직무 인덱스", note: "직무를 번호와 구분선으로 정돈했습니다. B2B 제품 기획 · 업무 자동화 · AI 서비스 개발을 같은 비중으로 보여줍니다." },
  paper: { number: "03", name: "에디토리얼 페이퍼", note: "기존 홈의 차콜 배경·흰 글자·블루 포인트를 유지했습니다. 큰 이름 → 직무 → 업무 방식으로 읽히는 에디토리얼 구성입니다." },
  flow: { number: "04", name: "업무 흐름", note: "화면과 업무 흐름을 함께 본다는 소개를 세 단계의 연결로 표현했습니다. 기획·자동화·개발의 관계를 강조합니다." },
};

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function introduction(key) {
  if (key === "index") {
    return `<p class="hi-name">${name}<span>기획과 개발</span></p>
      <h1 class="hi-index-title">${roles.map((role, i) => `<span><small>0${i + 1}</small><b>${role}</b>${arrow}</span>`).join("")}</h1>
      <p class="hi-summary">${summary}</p>`;
  }
  if (key === "paper") {
    return `<p class="hi-paper-kicker">기획 · 자동화 · 개발</p><p class="hi-paper-name">${name}<span aria-hidden="true">.</span></p>
      <h1 class="hi-paper-title">${roles.map(role => `<span>${role}</span>`).join("")}</h1>
      <p class="hi-summary">${summary}</p>`;
  }
  if (key === "flow") {
    return `<p class="hi-name">${name}<span>기획과 개발</span></p>
      <h1 class="hi-flow-title">${roles.map((role, i) => `<span><small>0${i + 1}</small><b>${role}</b>${i < 2 ? arrow : '<svg class="hi-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'}</span>`).join("")}</h1>
      <p class="hi-summary">${summary}</p>`;
  }
  return `<p class="hi-name">${name}<span>기획과 개발</span></p>
    <h1 class="hi-poster-title"><span>B2B <em>제품 기획</em></span><span><em>업무 자동화</em></span><span>AI <em>서비스 개발</em></span></h1>
    <p class="hi-summary">${summary}</p>`;
}

function renderHero(key) {
  return `<section class="hi-hero hi-hero--${key}" aria-label="장인우 소개">
    <div class="hi-hero-inner"><div class="hi-copy">${introduction(key)}</div><div class="hi-profile">${profile}</div></div>
    <div class="hi-bottom" aria-hidden="true"><span>INWOO.LOG</span><span>기획에서 구현, 검증까지</span></div>
  </section>`;
}

function preview(initial = "paper", compare = false) {
  const root = document.createElement("main");
  root.className = "hi-preview";
  root.innerHTML = `<header class="hi-preview-head"><p>INWOO.LOG · DESIGN STUDY</p><h2>홈 소개 스타일</h2>
    <p>같은 소개, 네 가지 강조 방식. 시안을 바꾸거나 모바일 폭으로 비교해 보세요.</p></header>
    <div class="hi-controls">${compare ? `<fieldset class="hi-variant-switch"><legend class="visually-hidden">소개 스타일</legend>${Object.entries(variants).map(([key, v]) =>
      `<label><input type="radio" name="intro-style" value="${key}" ${key === initial ? "checked" : ""}><span><small>${v.number}</small> ${v.name}</span></label>`).join("")}</fieldset>` : `<p class="hi-single-title">${variants[initial].number} · ${variants[initial].name}</p>`}
      <fieldset class="hi-size-switch"><legend class="visually-hidden">미리보기 너비</legend><label><input type="radio" name="intro-size" value="desktop" checked><span>데스크톱</span></label><label><input type="radio" name="intro-size" value="mobile"><span>모바일</span></label></fieldset></div>
    <p class="hi-design-note" aria-live="polite"></p><div class="hi-stage" data-size="desktop"></div>`;
  const stage = root.querySelector(".hi-stage");
  const note = root.querySelector(".hi-design-note");
  function select(key) {
    stage.innerHTML = renderHero(key);
    // 프로필 링크는 실제 포트폴리오로 연결한다.
    stage.querySelectorAll('a[href^="profile.html"]').forEach(link => {
      link.href = "https://inwoo-jang.github.io/inwoo-portfolio/" + link.getAttribute("href");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
    note.textContent = variants[key].note;
  }
  root.querySelector(".hi-variant-switch")?.addEventListener("change", event => select(event.target.value));
  root.querySelector(".hi-size-switch").addEventListener("change", event => { stage.dataset.size = event.target.value; });
  select(initial);
  return root;
}

export const Compare = { name: "네 가지 시안 비교", render: () => preview("paper", true) };
export const Poster = { name: "01 · 타이포 포스터", render: () => preview("poster") };
export const Index = { name: "02 · 직무 인덱스", render: () => preview("index") };
export const Paper = { name: "03 · 에디토리얼 페이퍼", render: () => preview("paper") };
export const Flow = { name: "04 · 업무 흐름", render: () => preview("flow") };
