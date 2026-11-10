import * as C from "../components.js";
import { HERO } from "../data.js";

export default { title: "컴포넌트/소개" };

export const 히어로 = {
  name: "첫 화면(히어로)",
  args: { title: HERO.title, role: HERO.role, summary1: HERO.summary[0], summary2: HERO.summary[1] },
  render: (a) => `<div style="max-width:1120px">${C.hero({ ...HERO, title: a.title, role: a.role, summary: [a.summary1, a.summary2] })}</div>`,
  parameters: { docs: { description: { story: "이름·직무 → 헤드라인 → 업무 방식 소개 → 행동 버튼. 오른쪽에 경력·연락 요약." } } },
};

export const 요약카드 = {
  name: "요약 카드",
  render: () => `<div style="max-width:360px">${C.profileCard(HERO.profile)}</div>`,
};

export const 버튼 = {
  args: { label: "대표 프로젝트 보기", variant: "primary" },
  argTypes: { variant: { control: "inline-radio", options: ["primary", "default", "quiet"] } },
  render: (a) => `${C.button(a)} &nbsp; ${C.linkArrow({ label: "전체 프로젝트 20개" })}`,
};

export const 수치 = {
  render: () => C.figures([
    { value: "약 1시간 → 10분", label: "담당자의 주문 수기 입력 업무(하루)", scope: "해당 업무 한정 · 본인 확인 기록" },
    { value: "2026.07.10", label: "퀴켓 App Store 출시", scope: "7인 팀 결과" },
    { value: "320팀 중 24위", label: "데이콘 최종 순위", scope: "팀 결과" },
  ]),
};

export const 인용 = {
  render: () => C.quote({ text: "구현 중에 판단해야 할 것들이 문서에 정리되어 있어 편하다.", cite: "지킴컴퍼니에서 함께 일한 개발자와 디자이너" }),
};

export const 연락 = {
  render: () => C.contact({ desc: "서비스 기획 · IT 기획 · AX 직무로 이야기 나누고 싶습니다." }),
};
