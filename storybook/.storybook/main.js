/** inwoo.log Storybook — 사이트(정적 HTML)와 같은 css/ds.css·media를 그대로 쓴다. */
export default {
  stories: ["../src/**/*.stories.js"],
  framework: { name: "@storybook/html-vite", options: {} },
  // 사이트의 이미지 폴더를 /media 로 제공 → 컴포넌트에서 "media/..." 경로를 그대로 쓴다
  staticDirs: [
    { from: "../../media", to: "/media" },
    { from: "../../css", to: "/css" },
    { from: "../../script", to: "/script" },
    { from: "../../notes", to: "/notes" },
  ],
  async viteFinal(config) {
    config.server = { ...(config.server || {}), fs: { allow: ["..", "../.."] } };
    return config;
  },
};
