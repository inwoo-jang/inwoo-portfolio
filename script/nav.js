/* ==========================================================
   script/nav.js — 모바일 햄버거 메뉴
   ========================================================== */

var navToggle = document.getElementById("navToggle");
var siteNav = document.getElementById("siteNav");
var NAV_EN = document.documentElement.lang === "en";

function closeNav() {
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", NAV_EN ? "Open menu" : "메뉴 열기");
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? (NAV_EN ? "Close menu" : "메뉴 닫기") : (NAV_EN ? "Open menu" : "메뉴 열기"));
  });

  // 메뉴에서 링크를 고르면 닫는다
  siteNav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      closeNav();
    }
  });

  // 화면이 다시 넓어지면 열림 상태를 정리한다
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
      closeNav();
    }
  });
}

/* 언어 전환 — 같은 페이지의 다른 언어로 가되, 지금 보고 있는 위치(#해시)는 그대로 가져간다 */
document.querySelectorAll("[data-lang-link]").forEach(function (a) {
  a.addEventListener("click", function () {
    if (location.hash) { a.href = a.getAttribute("href").split("#")[0] + location.hash; }
  });
});
