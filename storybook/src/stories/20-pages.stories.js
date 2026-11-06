/* ==========================================================
   페이지 — 실제 사이트 HTML을 그대로 띄운다 (스토리와 페이지가 어긋나지 않게).
   css·script·media·notes 폴더는 .storybook/main.js의 staticDirs로 제공되고,
   iframe의 <base href="/">로 상대 경로가 그대로 동작한다.
   ========================================================== */
import home from "../../../index.html?raw";
import profile from "../../../profile.html?raw";
import portfolio from "../../../portfolio.html?raw";
import how from "../../../how.html?raw";
import notes from "../../../notes.html?raw";

export default { title: "페이지", parameters: { layout: "fullscreen" } };

const frame = (html, hash = "") => {
  const doc = html.replace("<head>", '<head><base href="/">');
  const iframe = document.createElement("iframe");
  iframe.title = "페이지 미리보기";
  iframe.style.cssText = "display:block;width:100%;height:100vh;border:0";
  iframe.srcdoc = hash ? doc.replace("</body>", `<script>location.hash=${JSON.stringify(hash)}</script></body>`) : doc;
  return iframe;
};

export const Home = { render: () => frame(home) };
export const Profile = { render: () => frame(profile) };
export const Portfolio_QuickView = { name: "Portfolio · Quick View", render: () => frame(portfolio) };
export const Portfolio_상세 = { name: "Portfolio · 프로젝트 상세", render: () => frame(portfolio, "#p-order-sync") };
export const Portfolio_BookView = { name: "Portfolio · Book View", render: () => frame(portfolio, "#work") };
export const HowIWork = { name: "How I Work", render: () => frame(how) };
export const DevNotes = { name: "Dev Notes · 목록", render: () => frame(notes) };
export const DevNotes_상세 = { name: "Dev Notes · 상세", render: () => frame(notes, "#n-vscode-tips") };
