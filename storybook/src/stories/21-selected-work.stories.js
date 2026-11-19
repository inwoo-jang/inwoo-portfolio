import page from "../proposals/selected-work.html?raw";
import "../proposals/selected-work.css";

export default {
  id: "portfolio-proposal",
  title: "페이지/개편 시안",
  parameters: { layout: "fullscreen" },
};

export const SelectedWork = {
  name: "장인우 포트폴리오 · 대표 작업",
  render: () => page,
};
