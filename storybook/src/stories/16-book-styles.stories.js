// 포트폴리오 Book View 시안 — 책장(표지)과 펼친 책을 시안별로 비교한다.
// 실제 사이트에는 아직 적용하지 않은 비교용 시안이다.

export default { title: "컴포넌트/책 시안" };

const BOOKS = [
  { no: "01", title: "At Work", ko: "실무", meta: "7장 · 2024–2026", tone: "#1E2126" },
  { no: "02", title: "SKALA Projects", ko: "교육", meta: "4장 · 2026.08–09", tone: "#1B3554" },
  { no: "03", title: "With a Team", ko: "팀", meta: "3장 · 2026", tone: "#2C4652" },
  { no: "04", title: "Built Myself", ko: "개인", meta: "6장 · 2026", tone: "#5A5047" },
];

const CHAPTER = {
  chip: "01 · 실무 · 기획·검증",
  title: "의약품 도매몰 주문·박스 상태 연동",
  meta: "2026.01 – 02 · (주)지킴컴퍼니 · 본인: 연동 정책 기획·데이터 대조 · 구현: 개발팀 · 운영 적용",
  body: `
    <p>약국의 실물 처방전을 수거·스캔해 보관하는 서비스입니다. 주문은 외부 의약품 도매몰에서 들어옵니다.</p>
    <h4>문제 정의</h4>
    <p>운영 담당자가 도매몰 주문을 Excel로 내려받아 어드민에 직접 입력하고 있었습니다. 도매몰은 주문·상품 단위, 내부 운영은 박스 단위로 관리했습니다.</p>
    <h4>내가 정한 정책</h4>
    <ul>
      <li>주문번호와 상품 순번으로 처리 대상을 식별하고 내부 박스와 연결</li>
      <li>부분 수거·수거 연기를 별도 상태로 구분</li>
    </ul>`,
};

const CSS = `
.bk { font-family: Pretendard Variable, Pretendard, system-ui, sans-serif; color: #2B2F36; }
.bk-note { margin: 0 0 20px; font-size: 13px; color: #545B66; line-height: 1.7; max-width: 760px; }
.bk-note b { color: #111418; }
.bk-shelf { display: flex; justify-content: center; align-items: flex-end; gap: 22px; padding: 28px 16px 0; margin-bottom: 36px; }
.bk-book { position: relative; width: 150px; aspect-ratio: 3 / 4; display: flex; flex-direction: column; box-sizing: border-box; cursor: pointer; text-align: left; border: 0; font: inherit; transition: transform .2s ease; }
.bk-book.is-on { transform: translateY(-10px); }
.bk-spread { position: relative; max-width: 980px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; }
.bk-page { padding: 44px 44px 36px; min-height: 420px; box-sizing: border-box; }
.bk-page h3 { margin: 0 0 14px; font-size: 26px; line-height: 1.3; letter-spacing: -0.03em; color: #111418; }
.bk-page h4 { margin: 22px 0 6px; font-size: 15px; color: #1B4F8F; }
.bk-page p, .bk-page li { font-size: 15px; line-height: 1.8; margin: 0 0 8px; }
.bk-page ul { padding-left: 18px; margin: 0; }
.bk-chip { margin: 0 0 18px; font-size: 12px; letter-spacing: .06em; color: #545B66; }
.bk-meta { font-size: 13px; line-height: 1.75; color: #545B66; }
.bk-folio { position: absolute; bottom: 14px; font-size: 11px; letter-spacing: .08em; color: #8A9099; }
.bk-folio--l { left: 44px; } .bk-folio--r { right: 44px; }
@media (max-width: 760px) {
  .bk-shelf { gap: 10px; } .bk-book { width: 23%; }
  .bk-spread { grid-template-columns: 1fr; } .bk-page { padding: 28px 22px; min-height: 0; }
  .bk-folio { display: none; }
}

/* ---------- 현재 (비교용) ---------- */
.v0 .bk-book { padding: 22px 16px 16px 26px; border-radius: 3px 6px 6px 3px; color: #D9C9A3;
  background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px),
              linear-gradient(160deg, color-mix(in srgb, var(--tone) 70%, white 18%), var(--tone));
  box-shadow: inset 0 0 0 9px var(--tone), inset 0 0 0 10px rgba(217,201,163,.62), 0 12px 24px rgba(17,20,24,.26); }
.v0 .bk-no { font-size: 11px; letter-spacing: .14em; border-bottom: 1px solid rgba(217,201,163,.6); width: 26px; padding-bottom: 6px; }
.v0 .bk-title { margin-top: 12px; font-size: 21px; font-weight: 700; color: #EFE5CC; line-height: 1.12; }
.v0 .bk-meta-c { margin-top: auto; font-size: 11px; color: rgba(217,201,163,.7); }
.v0 .bk-spread { box-shadow: 0 10px 0 2px #17191D, 0 30px 50px rgba(17,20,24,.22);
  background: linear-gradient(to right, #F1ECE1 0%, #FBF9F4 5%, #FBF9F4 44%, #DCD4C4 49.7%, #CFC6B4 50%, #DCD4C4 50.3%, #FBF9F4 56%, #FBF9F4 95%, #F1ECE1 100%); }

/* ---------- A. 종이 표지 ---------- */
.va .bk-book { padding: 20px 16px 16px 22px; background: #F7F4EE; border-radius: 2px;
  box-shadow: 0 1px 0 rgba(17,20,24,.06), 0 8px 18px rgba(17,20,24,.10); color: #111418; }
.va .bk-book::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--tone); }
.va .bk-no { font-size: 11px; font-weight: 600; letter-spacing: .12em; color: #545B66; }
.va .bk-title { margin-top: 10px; font-size: 20px; font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; }
.va .bk-ko { margin-top: 6px; font-size: 12px; color: #545B66; }
.va .bk-meta-c { margin-top: auto; padding-top: 8px; border-top: 1px solid #DDD7CC; font-size: 11px; color: #545B66; }
.va .bk-book.is-on { box-shadow: 0 1px 0 rgba(17,20,24,.06), 0 16px 26px rgba(17,20,24,.16); }
.va .bk-shelf { border-bottom: 1px solid #C9C2B6; padding-bottom: 0; }
.va .bk-spread { background: #FFFFFF; border: 1px solid #E4DED3; box-shadow: 0 18px 36px rgba(17,20,24,.08); }
.va .bk-spread::after { content: ""; position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: #E4DED3; }

/* ---------- B. 무광 단색 ---------- */
.vb .bk-book { padding: 20px 16px 16px; background: var(--tone); border-radius: 3px; color: #F4F1EA;
  box-shadow: 0 10px 20px rgba(17,20,24,.18); }
.vb .bk-book::before { content: ""; position: absolute; left: 8px; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,.14); }
.vb .bk-no { font-size: 11px; font-weight: 600; letter-spacing: .12em; color: rgba(244,241,234,.6); padding-left: 6px; }
.vb .bk-title { margin-top: 10px; padding-left: 6px; font-size: 20px; font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; }
.vb .bk-meta-c { margin-top: auto; padding-left: 6px; font-size: 11px; color: rgba(244,241,234,.6); }
.vb .bk-book:not(.is-on) { opacity: .88; }
.vb .bk-shelf { border-bottom: 6px solid #2B2F36; }
.vb .bk-spread { background: #FAF8F3; border-radius: 3px; box-shadow: 0 6px 0 -1px #E6E0D4, 0 12px 0 -2px var(--cover, #1E2126), 0 24px 40px rgba(17,20,24,.12); }
.vb .bk-spread::after { content: ""; position: absolute; top: 0; bottom: 0; left: calc(50% - 18px); width: 36px;
  background: linear-gradient(to right, transparent, rgba(17,20,24,.05) 45%, rgba(17,20,24,.09) 50%, rgba(17,20,24,.05) 55%, transparent); pointer-events: none; }

/* ---------- C. 책등 책장 ---------- */
.vc .bk-shelf { gap: 6px; align-items: flex-end; border-bottom: 6px solid #2B2F36; padding-bottom: 0; }
.vc .bk-book { width: 58px; aspect-ratio: auto; height: var(--h, 220px); padding: 12px 0; align-items: center; background: var(--tone); color: #F4F1EA; border-radius: 2px 2px 0 0;
  box-shadow: inset -3px 0 0 rgba(0,0,0,.18), inset 3px 0 0 rgba(255,255,255,.06); }
.vc .bk-no { font-size: 11px; font-weight: 600; color: rgba(244,241,234,.6); }
.vc .bk-title { margin-top: 12px; writing-mode: vertical-rl; white-space: nowrap; font-size: 15px; font-weight: 700; letter-spacing: .02em; }
.vc .bk-meta-c { margin-top: auto; writing-mode: vertical-rl; white-space: nowrap; font-size: 10px; color: rgba(244,241,234,.55); }
.vc .bk-book.is-on { transform: translateY(-14px); }
.vc .bk-book.is-on::after { content: ""; position: absolute; left: 50%; bottom: -20px; width: 18px; height: 2px; transform: translateX(-50%); background: #1B4F8F; }
.vc .bk-spread { background: #FAF8F3; border-radius: 3px; box-shadow: 0 6px 0 -1px #E6E0D4, 0 24px 40px rgba(17,20,24,.12); }
.vc .bk-spread::after { content: ""; position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: #DDD6C8; }
@media (max-width: 760px) { .vc .bk-book { width: 50px; } }
`;

function shelf(variant, active = 0) {
  const heights = ["262px", "300px", "276px", "254px"];
  return `<div class="bk-shelf">${BOOKS.map((b, i) => `
    <button type="button" class="bk-book${i === active ? " is-on" : ""}" style="--tone:${b.tone};--h:${heights[i]}">
      <span class="bk-no">${b.no}</span>
      <span class="bk-title">${b.title}</span>
      ${variant === "va" ? `<span class="bk-ko">${b.ko}</span>` : ""}
      <span class="bk-meta-c">${b.meta}</span>
    </button>`).join("")}</div>`;
}

function spread() {
  return `<div class="bk-spread">
    <div class="bk-page">
      <p class="bk-chip">${CHAPTER.chip}</p>
      <h3>${CHAPTER.title}</h3>
      <p class="bk-meta">${CHAPTER.meta}</p>
      <span class="bk-folio bk-folio--l">AT WORK · 1</span>
    </div>
    <div class="bk-page">${CHAPTER.body}<span class="bk-folio bk-folio--r">2</span></div>
  </div>`;
}

function view(variant, note) {
  return `<style>${CSS}</style>
  <div class="bk ${variant}">
    <p class="bk-note">${note}</p>
    ${shelf(variant)}
    ${spread()}
  </div>`;
}

export const 현재 = {
  name: "현재 (비교용)",
  render: () => view("v0", "<b>지금 사이트에 적용된 모습.</b> 천 결 질감, 금박 테두리, 그라데이션, 가운데 골 그림자가 겹쳐 그래픽처럼 보인다."),
};

export const A_종이표지 = {
  name: "A. 종이 표지",
  render: () => view("va", "<b>흰 종이 표지 + 글자.</b> 색은 왼쪽 책등 띠에만 둔다. 펼친 책은 흰 종이 두 면과 가운데 1px 선, 아래 쪽번호. 가장 차분하고 문서 같은 느낌."),
};

export const B_무광단색 = {
  name: "B. 무광 단색",
  render: () => view("vb", "<b>사이트 톤의 단색 표지.</b> 그라데이션·질감·금박 없이 색면과 글자만. 펼친 책은 아이보리 종이에 아주 옅은 가운데 그늘, 아래로 표지 색이 살짝 보인다."),
};

export const C_책등책장 = {
  name: "C. 책등 책장",
  render: () => view("vc", "<b>책등이 보이게 꽂힌 책장.</b> 실제 책장처럼 높이가 조금씩 다르고, 고른 책이 위로 뽑힌다. 표지 대신 세로 제목으로 읽는다. 모바일에서도 네 권이 한 줄에 들어간다."),
};
