import * as C from "../components.js";
import { HERO, PROJECTS, NOTES, TIMELINE, SKILLS } from "../data.js";

/* ===================== 내비게이션 ===================== */
export default { title: "컴포넌트/내비게이션", parameters: { layout: "fullscreen" } };

export const 헤더 = {
  args: { current: "How I Work", dark: true },
  argTypes: { current: { control: "select", options: ["Home", "Profile", "Portfolio", "How I Work", "Dev Notes"] }, dark: { control: "boolean" } },
  render: (a) => C.siteHeader(a),
  parameters: { docs: { description: { story: "로고 끝 커서(_)가 유일한 장식 모션. 모바일에서는 햄버거 메뉴." } } },
};

export const 헤더_모바일 = {
  name: "헤더 · 모바일",
  args: { current: "Portfolio" },
  render: (a) => C.siteHeader(a),
  globals: { viewport: { value: "mobile", isRotated: false } },
};

export const 위치표시 = {
  name: "위치 표시(브레드크럼)",
  render: () => `<div style="padding:24px">${C.crumb([["홈", "index.html"], ["Portfolio", "portfolio.html"], ["의약품 도매몰 주문·박스 상태 연동"]])}</div>`,
};

export const 앞뒤글 = {
  name: "앞뒤 글",
  render: () => `<div style="padding:24px;max-width:760px">${C.pager({ prev: { href: "#", label: "급여명세서 서비스 기획" }, next: { href: "#", label: "퀴켓 — AI 퀴즈 학습 앱" } })}</div>`,
};

export const 푸터 = { render: () => C.siteFooter() };
