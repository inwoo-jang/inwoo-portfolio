/* ==========================================================
   script/toc.js — 긴 글의 목차에 지금 읽는 위치를 표시한다.
   [data-toc] 안의 a[href="#id"]와 본문의 같은 id를 연결하고,
   화면 위쪽 기준선을 지난 마지막 제목을 현재 위치로 본다.
   (섹션 링크는 섹션 안의 첫 제목 위치로 판단한다)
   JavaScript가 없어도 목차 링크는 그대로 동작한다.
   ========================================================== */
(function () {
  var toc = document.querySelector("[data-toc]");
  if (!toc) { return; }

  var items = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]')).map(function (a) {
    var el = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
    if (el && el.tagName === "SECTION") { el = el.querySelector("h2") || el; }
    return { link: a, el: el };
  }).filter(function (item) { return item.el; });

  var OFFSET = 120;   // 고정 헤더 높이 + 여유
  var ticking = false;

  function update() {
    ticking = false;
    var current = items[0];
    for (var i = 0; i < items.length; i++) {
      if (items[i].el.getBoundingClientRect().top - OFFSET <= 0) { current = items[i]; }
    }
    // 페이지 끝에 닿으면 마지막 항목 (마지막 섹션은 기준선까지 올라오지 못할 수 있다)
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = items[items.length - 1];
    }
    items.forEach(function (item) {
      if (item === current) { item.link.setAttribute("aria-current", "true"); }
      else { item.link.removeAttribute("aria-current"); }
    });
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
