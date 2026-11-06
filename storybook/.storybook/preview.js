import "../../css/ds.css";

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    layout: "padded",
    viewport: {
      options: {
        mobile: { name: "모바일 390", styles: { width: "390px", height: "844px" }, type: "mobile" },
        tablet: { name: "태블릿 820", styles: { width: "820px", height: "1180px" }, type: "tablet" },
        laptop: { name: "노트북 1366", styles: { width: "1366px", height: "860px" }, type: "desktop" },
      },
    },
    options: {
      storySort: { order: ["소개", "기초 요소", "컴포넌트", ["내비게이션", "소개", "프로젝트", "프로필", "글", "Dev Notes"], "페이지"] },
    },
  },
};
export default preview;
