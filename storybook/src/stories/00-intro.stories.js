import { esc } from "../components.js";

export default { title: "소개/이 디자인의 기준", parameters: { layout: "padded" } };

const wrap = (html) => `<div style="max-width:760px">${html}</div>`;

export const 읽는사람 = {
  name: "읽는 사람과 30초",
  render: () => wrap(`
<p class="eyebrow">inwoo.log 디자인 시스템</p>
<h1 class="display">인사담당자가 30초 안에<br>더 보고 싶어지게</h1>
<p class="lead">이 사이트를 여는 사람은 지원서를 수십 장 넘기는 인사담당자와 현업 팀장입니다. 첫 화면에서 아래 다섯 가지가 바로 보여야 다음 페이지를 엽니다.</p>
<ol class="flow">
  <li class="flow__step"><span class="flow__title">누구인지</span><span class="flow__desc">이름 · 직무 · 한 줄 헤드라인</span></li>
  <li class="flow__step"><span class="flow__title">무엇을 해 봤는지</span><span class="flow__desc">숫자와 결과가 있는 요약 3줄</span></li>
  <li class="flow__step"><span class="flow__title">근거</span><span class="flow__desc">대표 프로젝트 3개 — 상태(운영 적용·출시)와 내 역할이 카드에 보임</span></li>
  <li class="flow__step"><span class="flow__title">어떻게 일하는지</span><span class="flow__desc">기획 · 개발 · 협업 각 한 줄</span></li>
  <li class="flow__step"><span class="flow__title">연락</span><span class="flow__desc">첫 화면과 맨 아래 두 곳</span></li>
</ol>`),
};

export const 원칙 = {
  name: "원칙 · AI 티 줄이기",
  render: () => wrap(`
<h2 style="font-size:var(--fs-h2);margin-bottom:var(--s4)">원칙</h2>
<ul>
  <li><strong>가독성이 먼저</strong> — 흰 바탕, 본문 대비 13:1, 보조 글자도 7:1. 본문 17px · 줄 간격 1.78.</li>
  <li><strong>결과가 먼저</strong> — 카드·목록은 “무엇이 바뀌었나”를 첫 줄에, 역할 경계(구현 담당)는 바로 아래에.</li>
  <li><strong>하나씩</strong> — 서체 Pretendard 하나, 강조색 남색 하나, 모션은 로고 끝 커서(_) 하나.</li>
  <li><strong>정직한 표시</strong> — 상태(운영 적용 · 출시 · 베타 · 교육 · 프로토타입)와 범위(팀 결과 · 목표 · 추정)를 숫자 옆에.</li>
</ul>
<div class="split">
  <div class="split__col"><span class="split__head">쓰지 않는다</span><ul>
    <li>베이지 바탕 + 회갈색 글자 (흐려 보임)</li><li>파스텔 여러 색 알약 태그</li><li>영문 대문자 모노 라벨</li><li>서체 3종 혼용, 그림자 카드, 그라데이션</li><li>문단마다 형광펜</li></ul></div>
  <div class="split__col"><span class="split__head">대신 쓴다</span><ul>
    <li>흰 바탕 + 진한 글자</li><li>회색 글자 태그 “·” 구분</li><li>한글 제목 + 남색 번호</li><li>얇은 선 · 표 · 큰 숫자</li><li>핵심 구절 한 곳만 밑줄 강조</li></ul></div>
</div>`),
};

export const 메모 = {
  name: "작성 규칙",
  render: () => wrap(`
<h2 style="font-size:var(--fs-h2);margin-bottom:var(--s4)">문장 작성 규칙</h2>
<ul>
  <li>회사 업무(기획·운영)와 교육·개인 프로젝트(구현)를 문장마다 구분합니다.</li>
  <li>팀 결과에는 “팀 결과”, 목표·추정치에는 “목표”·“추정”을 붙입니다.</li>
  <li>${esc("코드는 AI 코딩 도구를 활용해 작성한다는 사실을 숨기지 않습니다.")}</li>
  <li>내부 프로젝트·고객 정보·내부 정책 수치는 싣지 않습니다.</li>
</ul>`),
};
