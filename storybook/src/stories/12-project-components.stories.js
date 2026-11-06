import * as C from "../components.js";
import { PROJECTS } from "../data.js";

export default { title: "컴포넌트/프로젝트" };

const base = PROJECTS[0];

export const 카드 = {
  name: "프로젝트 카드",
  args: {
    title: base.title, kind: base.kind, period: base.period, statusLabel: base.status.label, statusKind: base.status.kind,
    headline: base.headline, headlineScope: base.headlineScope, result: base.result, role: base.role, image: "",
  },
  argTypes: {
    statusKind: { control: "inline-radio", options: ["live", "edu", "other"] },
    image: { control: "select", options: ["", "media/portfolio/quiket-card.png", "media/portfolio/demo-triage.png", "media/portfolio/gwangyebu-uiflow.png"] },
  },
  render: (a) => `<ul class="cards" style="max-width:380px">${C.projectCard({ ...base, ...a, status: { label: a.statusLabel, kind: a.statusKind } })}</ul>`,
  parameters: { docs: { description: { story: "이미지가 없으면 대표 결과 한 줄을 썸네일 자리에 크게 보여 줍니다. 카드 전체가 링크." } } },
};

export const 카드목록 = {
  name: "카드 목록",
  parameters: { layout: "padded" },
  render: () => `<div style="max-width:1120px">${C.projectCards(PROJECTS.slice(0, 6))}</div>`,
};

export const 필터 = {
  name: "분류 필터",
  args: { pressed: 0 },
  render: (a) => `${C.chips({ items: [["전체", 18], ["실무", 6], ["교육", 4], ["팀", 3], ["개인", 5]], pressed: a.pressed, label: "분류" })}
<div style="height:12px"></div>${C.chips({ items: ["모든 유형", "Product", "Operations", "AI Engineering", "Frontend", "Backend"], label: "유형" })}`,
};

export const 상세사실줄 = {
  name: "상세 · 사실 줄",
  render: () => `<div style="max-width:760px">${C.facts([["기간", "2026.01 – 02"], ["소속", "(주)지킴컴퍼니"], ["내 역할", "연동 정책 기획 · 데이터 대조"], ["구현", "개발팀"], ["상태", "운영 적용"]])}</div>`,
};

export const 스크린샷 = {
  name: "스크린샷 · 설명",
  render: () => `<div style="max-width:680px">${C.shot({ src: "media/portfolio/gwangyebu-uiflow.png", alt: "관계부 화면 흐름도", caption: "관계부 · 화면 11개의 이동 흐름 (교육 과제 설계 산출물)", notes: ["홈에서 다가오는 경조사를 확인", "인물 상세에서 주고받은 기록 조회", "장부에서 보낸 것·받은 것 합계"] })}
${C.shot({ alt: "공개 확인 전 스크린샷 자리", caption: "공개 가능한 화면이 없을 때의 자리 표시" })}</div>`,
};
