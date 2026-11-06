/* ==========================================================
   script/portfolio-quick.js — Quick View / Book View 전환
   - Quick View(기본): 프로젝트 카드 목록 + 분류·유형 필터 + 읽기 화면
   - Book View: 기존 책장·연습장(script/portfolio.js)을 그대로 보여준다
   - 읽기 화면의 "상세 기록"은 연습장 장(<article class="note__page">)을
     복제해 쓴다. 내용의 원본은 portfolio.html 한 곳뿐이다.

   주소(해시) 규칙
     (없음) · #list         → Quick View 목록
     #p-<id>                → Quick View 읽기 화면 (id = data-project-gallery 값)
     #skala · #team · #solo → Book View, 해당 책 (기존 링크 호환)
     #book                  → Book View
   ========================================================== */
(function () {
  var projects = window.PROJECTS || [];
  var types = window.PROJECT_TYPES || [];
  var quickPanel = document.querySelector('[data-view-panel="quick"]');
  var bookPanel = document.querySelector('[data-view-panel="book"]');
  if (!quickPanel || !bookPanel || !projects.length) { return; }

  var listEl = quickPanel.querySelector("[data-quick-list]");
  var gridEl = quickPanel.querySelector("[data-quick-grid]");
  var countEl = quickPanel.querySelector("[data-quick-count]");
  var readerEl = quickPanel.querySelector("[data-reader]");
  var switchBtns = document.querySelectorAll(".view-switch [data-view]");

  var BOOKS = {
    skala: { label: "SKALA", name: "SKALA 프로젝트" },
    team: { label: "Team", name: "팀에서 만든 것" },
    solo: { label: "Solo", name: "직접 만든 것" }
  };
  var BOOK_IDS = Object.keys(BOOKS);

  var filter = { book: "all", type: "all" };
  var lastOpenedId = null;

  /* ---------- 작은 도우미 ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text != null) { node.textContent = text; }
    return node;
  }

  function byId(id) {
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].id === id) { return projects[i]; }
    }
    return null;
  }

  /** 프로젝트 id → 연습장 장(article) */
  function articleOf(id) {
    var mount = document.querySelector('.note__page [data-project-gallery="' + id + '"]');
    return mount ? mount.closest(".note__page") : null;
  }

  /** 연습장 장(article) → { book, page } */
  function locate(article) {
    var wrap = article && article.closest(".note-wrap");
    return wrap ? { book: wrap.id, page: Number(article.getAttribute("data-page")) || 0 } : null;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- 필터 ---------- */

  function renderFilterButtons() {
    var groups = {
      book: [{ value: "all", label: "전체" }].concat(BOOK_IDS.map(function (id) {
        return { value: id, label: BOOKS[id].label };
      })),
      type: [{ value: "all", label: "전체" }].concat(types.map(function (t) {
        return { value: t, label: t };
      }))
    };

    Object.keys(groups).forEach(function (key) {
      var box = quickPanel.querySelector('[data-filter="' + key + '"]');
      if (!box) { return; }
      groups[key].forEach(function (opt) {
        var btn = el("button", "filter-btn", opt.label);
        btn.type = "button";
        btn.dataset.value = opt.value;
        btn.setAttribute("aria-pressed", String(filter[key] === opt.value));
        btn.addEventListener("click", function () {
          filter[key] = opt.value;
          box.querySelectorAll(".filter-btn").forEach(function (b) {
            b.setAttribute("aria-pressed", String(b.dataset.value === opt.value));
          });
          renderGrid();
        });
        box.appendChild(btn);
      });
    });
  }

  function visibleProjects() {
    return projects.filter(function (p) {
      return (filter.book === "all" || p.book === filter.book) &&
             (filter.type === "all" || p.types.indexOf(filter.type) >= 0);
    });
  }

  /* ---------- 카드 목록 ---------- */

  function bookBadge(bookId) {
    var badge = el("span", "book-badge book-badge--" + bookId, BOOKS[bookId].label);
    return badge;
  }

  function metricNode(m, className) {
    var box = el("div", className || "metric");
    box.appendChild(el("strong", "metric__value", m.value));
    box.appendChild(el("span", "metric__label", m.label));
    if (m.scope) { box.appendChild(el("span", "metric__scope", m.scope)); }
    return box;
  }

  function card(p) {
    var li = el("li", "pcard pcard--" + p.book);

    var kicker = el("p", "pcard__kicker");
    kicker.appendChild(bookBadge(p.book));
    kicker.appendChild(el("span", "pcard__scope", p.scope.replace(/^SKALA\s·\s/, "") + " · " + p.period));
    li.appendChild(kicker);

    var h = el("h3", "pcard__title");
    var link = el("a", "pcard__link", p.title);
    link.href = "#p-" + p.id;
    h.appendChild(link);
    li.appendChild(h);

    var typeRow = el("p", "pcard__types");
    typeRow.textContent = p.types.join(" · ");
    li.appendChild(typeRow);

    var facts = el("dl", "pcard__facts");
    [["문제", p.problem], ["역할", p.role]].forEach(function (pair) {
      var row = el("div", "pcard__fact");
      row.appendChild(el("dt", null, pair[0]));
      row.appendChild(el("dd", null, pair[1]));
      facts.appendChild(row);
    });
    li.appendChild(facts);

    if (p.metrics.length) {
      li.appendChild(metricNode(p.metrics[0], "metric metric--card"));
    } else if (p.resultNote) {
      var note = el("p", "pcard__result", p.resultNote);
      li.appendChild(note);
    }

    var tags = el("ul", "tag-row pcard__tags");
    tags.setAttribute("aria-label", "기술 스택");
    p.stack.slice(0, 4).forEach(function (t) { tags.appendChild(el("li", "tag", t)); });
    li.appendChild(tags);

    li.appendChild(el("span", "pcard__more", "자세히 보기 →")).setAttribute("aria-hidden", "true");
    return li;
  }

  function renderGrid() {
    var list = visibleProjects();
    gridEl.textContent = "";
    list.forEach(function (p) { gridEl.appendChild(card(p)); });
    countEl.textContent = list.length
      ? "프로젝트 " + list.length + "개"
      : "조건에 맞는 프로젝트가 없습니다. 필터를 ‘전체’로 바꿔 보세요.";
  }

  /* ---------- 읽기 화면 ---------- */

  /** 연습장 장을 복제해 읽기 화면용 본문으로 다듬는다 */
  function proseFrom(article) {
    var copy = article.cloneNode(true);
    copy.removeAttribute("hidden");
    // 머리(칩·제목·메타)와 태그·링크 줄은 요약 영역에서 따로 보여준다
    var firstMeta = copy.querySelector(":scope > .note__meta");
    if (firstMeta) { firstMeta.remove(); }
    copy.querySelectorAll(":scope > .chip, :scope > h3, :scope > .tag-row, :scope > .btn-row")
      .forEach(function (n) { n.remove(); });
    // 비어 있는 갤러리 자리 제거
    copy.querySelectorAll("[data-project-gallery]").forEach(function (g) {
      g.removeAttribute("data-project-gallery");
      if (g.hidden || !g.children.length) { g.remove(); }
    });
    var prose = el("div", "reader__prose");
    while (copy.firstChild) { prose.appendChild(copy.firstChild); }
    return prose;
  }

  /** 연습장 장 안의 링크 — 다른 장으로 가는 링크는 읽기 화면 주소로 바꾼다 */
  function linksFrom(article) {
    var out = [];
    article.querySelectorAll(".btn-row a").forEach(function (a) {
      var copy = a.cloneNode(true);
      if (copy.hasAttribute("data-open-book")) {
        var wrap = document.getElementById(copy.getAttribute("data-open-book"));
        var target = wrap && wrap.querySelector('.note__page[data-page="' + (copy.getAttribute("data-open-page") || 0) + '"] [data-project-gallery]');
        copy.removeAttribute("data-open-book");
        copy.removeAttribute("data-open-page");
        if (target) { copy.href = "#p-" + target.getAttribute("data-project-gallery"); }
      }
      out.push(copy);
    });
    return out;
  }

  function factRow(no, label) {
    var row = el("div", "reader__fact");
    var dt = el("dt");
    dt.appendChild(el("span", "reader__no", no));
    dt.appendChild(document.createTextNode(label));
    row.appendChild(dt);
    var dd = el("dd");
    row.appendChild(dd);
    return { row: row, dd: dd };
  }

  function pagerLink(p, dir) {
    var a = el("a", "reader__step reader__step--" + dir);
    a.href = "#p-" + p.id;
    a.appendChild(el("span", "reader__step-label", dir === "prev" ? "‹ 이전 프로젝트" : "다음 프로젝트 ›"));
    a.appendChild(el("span", "reader__step-title", p.title));
    return a;
  }

  function renderReader(p) {
    var article = articleOf(p.id);
    var order = visibleProjects();
    if (order.indexOf(p) < 0) { order = projects; }
    var index = order.indexOf(p);

    readerEl.textContent = "";

    /* 상단 막대 — 목록으로 · 위치 */
    var bar = el("div", "reader__bar");
    var back = el("a", "reader__back", "← 프로젝트 목록");
    back.href = "#list";
    bar.appendChild(back);
    bar.appendChild(el("span", "reader__pos", (index + 1) + " / " + order.length));
    readerEl.appendChild(bar);

    /* 머리 */
    var head = el("header", "reader__head");
    var kicker = el("p", "pcard__kicker");
    kicker.appendChild(bookBadge(p.book));
    kicker.appendChild(el("span", "pcard__scope", p.types.join(" · ")));
    head.appendChild(kicker);
    var title = el("h2", "reader__title", p.title);
    title.id = "reader-title";
    title.tabIndex = -1;
    head.appendChild(title);
    var meta = article && article.querySelector(".note__meta");
    head.appendChild(el("p", "reader__meta", meta ? meta.textContent.trim() : p.period));
    readerEl.appendChild(head);

    /* 요약 — 개요 → 문제 → 역할 → 설계·구현 → 결과 → 스택·링크 */
    var summary = el("section", "reader__summary");
    summary.setAttribute("aria-labelledby", "reader-summary-title");
    var sumTitle = el("h3", "reader__label", "요약");
    sumTitle.id = "reader-summary-title";
    summary.appendChild(sumTitle);
    var dl = el("dl", "reader__facts");

    var f1 = factRow("01", "프로젝트 개요"); f1.dd.textContent = p.overview; dl.appendChild(f1.row);
    var f2 = factRow("02", "해결하려는 문제"); f2.dd.textContent = p.problem; dl.appendChild(f2.row);
    var f3 = factRow("03", "담당 역할"); f3.dd.textContent = p.role; dl.appendChild(f3.row);

    var f4 = factRow("04", "핵심 설계·구현");
    var ul = el("ul", "reader__list");
    p.build.forEach(function (b) { ul.appendChild(el("li", null, b)); });
    f4.dd.appendChild(ul); dl.appendChild(f4.row);

    var f5 = factRow("05", "결과 및 검증");
    if (p.metrics.length) {
      var metrics = el("div", "metrics");
      p.metrics.forEach(function (m) { metrics.appendChild(metricNode(m)); });
      f5.dd.appendChild(metrics);
    }
    if (p.resultNote) { f5.dd.appendChild(el("p", "reader__note", p.resultNote)); }
    if (!p.metrics.length && !p.resultNote) { f5.dd.appendChild(el("p", "reader__note", "상세 기록을 참고해 주세요.")); }
    dl.appendChild(f5.row);

    var f6 = factRow("06", "기술 스택 · 관련 링크");
    var tags = el("ul", "tag-row");
    tags.setAttribute("aria-label", "기술 스택");
    p.stack.forEach(function (t) { tags.appendChild(el("li", "tag tag--sky", t)); });
    f6.dd.appendChild(tags);
    var links = article ? linksFrom(article) : [];
    if (links.length) {
      var row = el("p", "btn-row reader__links");
      links.forEach(function (a) { row.appendChild(a); });
      f6.dd.appendChild(row);
    }
    dl.appendChild(f6.row);

    summary.appendChild(dl);
    readerEl.appendChild(summary);

    /* 상세 기록 — 연습장 본문 */
    if (article) {
      var detail = el("section", "reader__detail");
      detail.setAttribute("aria-labelledby", "reader-detail-title");
      var detTitle = el("h3", "reader__label", "상세 기록");
      detTitle.id = "reader-detail-title";
      detail.appendChild(detTitle);
      detail.appendChild(proseFrom(article));
      readerEl.appendChild(detail);
    }

    /* 아래 — 이전·다음 프로젝트, 목록, 연습장에서 보기 */
    var pager = el("nav", "reader__pager");
    pager.setAttribute("aria-label", "프로젝트 이동");
    if (index > 0) { pager.appendChild(pagerLink(order[index - 1], "prev")); }
    else { pager.appendChild(el("span", "reader__step reader__step--empty")); }
    if (index < order.length - 1) { pager.appendChild(pagerLink(order[index + 1], "next")); }
    readerEl.appendChild(pager);

    var foot = el("p", "reader__foot");
    var back2 = el("a", "btn btn--mini", "← 목록으로");
    back2.href = "#list";
    foot.appendChild(back2);
    var where = locate(article);
    if (where) {
      var inBook = el("button", "btn btn--mini", "연습장(Book View)에서 보기");
      inBook.type = "button";
      inBook.addEventListener("click", function () {
        showView("book");
        if (window.portfolioBookshelf) { window.portfolioBookshelf.open(where.book, where.page); }
        var shelf = document.querySelector("[data-bookshelf]");
        if (shelf) { shelf.scrollIntoView({ block: "start" }); }
      });
      foot.appendChild(inBook);
    }
    readerEl.appendChild(foot);
  }

  /* ---------- 보기 전환 · 라우팅 ---------- */

  function showView(view) {
    var book = (view === "book");
    quickPanel.hidden = book;
    bookPanel.hidden = !book;
    switchBtns.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.view === view));
    });
  }

  function showList(restoreFocus) {
    showView("quick");
    readerEl.hidden = true;
    listEl.hidden = false;
    document.title = "포트폴리오 — 장인우 · Inwoo.log";
    if (restoreFocus && lastOpenedId) {
      var link = gridEl.querySelector('a[href="#p-' + lastOpenedId + '"]');
      if (link) {
        link.focus({ preventScroll: true });
        link.closest(".pcard").scrollIntoView({ block: "center" });
      }
    }
  }

  function showReader(p) {
    showView("quick");
    renderReader(p);
    listEl.hidden = true;
    readerEl.hidden = false;
    lastOpenedId = p.id;
    document.title = p.title + " — 포트폴리오 · Inwoo.log";
    quickPanel.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    var title = document.getElementById("reader-title");
    if (title) { title.focus({ preventScroll: true }); }
  }

  var currentRoute = null;

  function route() {
    var hash = decodeURIComponent(location.hash.slice(1));
    if (hash === currentRoute) { return; }
    var prevRoute = currentRoute;
    currentRoute = hash;

    if (BOOK_IDS.indexOf(hash) >= 0 || hash === "book") {
      showView("book");
      return;
    }
    if (hash.indexOf("p-") === 0) {
      var p = byId(hash.slice(2));
      if (p) { showReader(p); return; }
    }
    showList(prevRoute !== null && prevRoute.indexOf("p-") === 0);
  }

  switchBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.getAttribute("aria-pressed") === "true") { return; }
      if (btn.dataset.view === "book") {
        var id = window.portfolioBookshelf ? window.portfolioBookshelf.activeId() : "skala";
        location.hash = id;   // portfolio.js가 해시를 보고 해당 책을 펼친다
      } else {
        location.hash = "list";
      }
    });
  });

  // 책장(portfolio.js)이 책을 바꿀 때 replaceState로 해시를 바꾸므로 currentRoute를 맞춘다
  bookPanel.addEventListener("click", function () {
    var hash = location.hash.slice(1);
    if (BOOK_IDS.indexOf(hash) >= 0) { currentRoute = hash; }
  });

  window.addEventListener("hashchange", route);

  renderFilterButtons();
  renderGrid();
  route();
})();
