import * as C from "../components.js";
import { TIMELINE, SKILLS, NOTES } from "../data.js";

export default { title: "컴포넌트/프로필" };

export const 경력타임라인 = { name: "경력 타임라인", render: () => `<div style="max-width:760px">${C.timeline(TIMELINE)}</div>` };

export const 기술표 = {
  name: "기술 — 어디에 썼는지",
  render: () => `<div style="max-width:760px">${C.table({ head: ["영역", "기술", "어디에 썼는지"], rows: SKILLS, caption: "기술 이름보다 쓴 곳을 함께 보여 줍니다." })}</div>`,
};
