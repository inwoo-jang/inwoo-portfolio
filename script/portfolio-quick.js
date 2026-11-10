/* ==========================================================
   script/portfolio-quick.js — Quick View / Book View 전환
   - Quick View(기본): 프로젝트 카드 + 분류·유형 필터 + 읽기 화면
   - Book View: 기존 책장·연습장(script/portfolio.js)
   - 마크업은 디자인 시스템(css/ds.css, storybook/src/components.js)과 같다
   - 읽기 화면의 “상세 기록”은 연습장 장(<article class="note__page">)을
     복제해 쓴다. 내용의 원본은 portfolio.html 한 곳뿐이다.

   주소(해시) 규칙
     (없음) · #list                → Quick View 목록
     #p-<id>                       → 읽기 화면 (id = data-project-gallery 값)
     #work · #skala · #team · #solo → Book View, 해당 책 (기존 링크 호환)
     #book                         → Book View
   ========================================================== */
(function () {
  var projects = window.PROJECTS || [];
  var types = window.PROJECT_ROLES || [];
  var quickPanel = document.querySelector('[data-view-panel="quick"]');
  var bookPanel = document.querySelector('[data-view-panel="book"]');
  if (!quickPanel || !bookPanel || !projects.length) { return; }

  var listEl = quickPanel.querySelector("[data-quick-list]");
  var gridEl = quickPanel.querySelector("[data-quick-grid]");
  var countEl = quickPanel.querySelector("[data-quick-count]");
  var readerEl = quickPanel.querySelector("[data-reader]");
  var pageHead = document.querySelector("[data-page-head]");
  var switchBtns = document.querySelectorAll(".view-switch [data-view]");

  var BOOKS = {
    work: { label: "실무", name: "실무 — 지킴컴퍼니" },
    skala: { label: "교육", name: "SKALA 교육 과정" },
    team: { label: "팀", name: "팀에서 만든 것" },
    solo: { label: "개인", name: "직접 만든 것" }
  };
  var BOOK_IDS = Object.keys(BOOKS);

  var filter = { book: "all", type: "all" };
  var lastOpenedId = null;

  /* ---------- 도우미 ---------- */

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

  function articleOf(id) {
    var mount = document.querySelector('.note__page [data-project-gallery="' + id + '"]');
    return mount ? mount.closest(".note__page") : null;
  }

  function locate(article) {
    var wrap = article && article.closest(".note-wrap");
    return wrap ? { book: wrap.id, page: Number(article.getAttribute("data-page")) || 0 } : null;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function statusEl(p) {
    var kind = p.statusKind || "other";
    var cls = kind === "live" ? "status status--live" : kind === "edu" ? "status status--edu" : "status";
    return el("span", cls, p.status || "");
  }

  function tagsEl(items) {
    var ul = el("ul", "tags");
    ul.setAttribute("aria-label", "기술·키워드");
    items.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    return ul;
  }

  /* ---------- 필터 ---------- */

  function renderFilterButtons() {
    var counts = { all: projects.length };
    BOOK_IDS.forEach(function (id) {
      counts[id] = projects.filter(function (p) { return p.book === id; }).length;
    });
    var groups = {
      book: [{ value: "all", label: "전체", count: counts.all }].concat(BOOK_IDS.map(function (id) {
        return { value: id, label: BOOKS[id].label, count: counts[id] };
      })),
      type: [{ value: "all", label: "모든 역할" }].concat(types.map(function (t) {
        return { value: t, label: t, count: projects.filter(function (p) { return (p.roles || []).indexOf(t) >= 0; }).length };
      }))
    };

    Object.keys(groups).forEach(function (key) {
      var box = quickPanel.querySelector('[data-filter="' + key + '"]');
      if (!box) { return; }
      groups[key].forEach(function (opt) {
        var li = el("li");
        var btn = el("button", "chip-btn", opt.label);
        btn.type = "button";
        btn.dataset.value = opt.value;
        if (opt.count != null) { btn.appendChild(el("small", null, String(opt.count))); }
        btn.setAttribute("aria-pressed", String(filter[key] === opt.value));
        btn.addEventListener("click", function () {
          filter[key] = opt.value;
          box.querySelectorAll(".chip-btn").forEach(function (b) {
            b.setAttribute("aria-pressed", String(b.dataset.value === opt.value));
          });
          renderGrid();
        });
        li.appendChild(btn);
        box.appendChild(li);
      });
    });
  }

  function visibleProjects() {
    return projects.filter(function (p) {
      return (filter.book === "all" || p.book === filter.book) &&
             (filter.type === "all" || (p.roles || []).indexOf(filter.type) >= 0);
    });
  }

  /* ---------- 카드 ---------- */

  function card(p) {
    var li = el("li", "card");

    var thumb;
    if (p.image) {
      thumb = el("div", "card__thumb");
      var img = el("img");
      img.src = p.image; img.alt = p.imageAlt || ""; img.loading = "lazy";
      thumb.appendChild(img);
    } else {
      thumb = el("div", "card__thumb card__thumb--text");
      var m = !p.headline && p.metrics && p.metrics[0];
      thumb.appendChild(el("strong", null, m ? m.value : p.headline || p.title));
      thumb.appendChild(el("span", null, m ? (m.label + (m.scope ? " · " + m.scope : "")) : (p.headlineScope || "")));
    }
    li.appendChild(thumb);

    var body = el("div", "card__body");
    var top = el("p", "card__top");
    top.appendChild(el("span", null, BOOKS[p.book].label + " · " + p.period));
    top.appendChild(statusEl(p));
    body.appendChild(top);

    var h = el("h3", "card__title");
    var link = el("a", null, p.title);
    link.href = "#p-" + p.id;
    h.appendChild(link);
    body.appendChild(h);
    if (p.roles && p.roles.length) { body.appendChild(rolesEl(p.roles)); }

    body.appendChild(el("p", "card__result", p.build[0]));
    body.appendChild(el("p", "card__role", p.role));
    body.appendChild(tagsEl(p.stack.slice(0, 4)));
    li.appendChild(body);
    return li;
  }

  /* 내 역할 키워드 — 기획 · PM · 엔지니어링 구분 */
  function rolesEl(roles) {
    var ul = el("ul", "roles");
    ul.setAttribute("aria-label", "내 역할");
    roles.forEach(function (r) { ul.appendChild(el("li", null, r)); });
    return ul;
  }

  /* 먼저 볼 프로젝트 — 프로젝트명 → 핵심 판단 → 결과·현재 상태 */
  function renderFeatured() {
    var box = quickPanel.querySelector("[data-featured-grid]");
    if (!box) { return; }
    (window.FEATURED || []).forEach(function (f, i) {
      var p = byId(f.id);
      if (!p) { return; }
      var li = el("li", "pick");
      var top = el("p", "pick__top");
      top.appendChild(el("span", "pick__no", String(i + 1).padStart(2, "0")));
      top.appendChild(el("span", null, BOOKS[p.book].label + " · " + p.period));
      top.appendChild(statusEl(p));
      li.appendChild(top);
      var h = el("h3", "pick__title");
      var a = el("a", null, p.title);
      a.href = "#p-" + p.id;
      h.appendChild(a);
      li.appendChild(h);
      var dl = el("dl", "pick__lines");
      [["판단", f.decision], ["결과", f.result]].forEach(function (pair) {
        var row = el("div");
        row.appendChild(el("dt", null, pair[0]));
        row.appendChild(el("dd", null, pair[1]));
        dl.appendChild(row);
      });
      li.appendChild(dl);
      li.appendChild(el("p", "pick__split", f.split));
      box.appendChild(li);
    });
  }

  function renderGrid() {
    var list = visibleProjects();
    gridEl.textContent = "";
    list.forEach(function (p) { gridEl.appendChild(card(p)); });
    countEl.textContent = list.length
      ? list.length + "개 표시 중"
      : "조건에 맞는 프로젝트가 없습니다. 필터를 ‘전체’로 바꿔 보세요.";
  }

  /* ---------- 읽기 화면 ---------- */

  /* 연습장 장의 이미지 갤러리를 복제해 ‘화면과 자료’로 먼저 보여 준다 */
  function galleryFrom(article) {
    var mount = article.querySelector("[data-project-gallery]");
    if (!mount || mount.hidden || !mount.children.length) { return null; }
    var copy = mount.cloneNode(true);
    copy.removeAttribute("data-project-gallery");
    copy.removeAttribute("hidden");
    copy.className = "reader-gallery";
    return copy;
  }

  function proseFrom(article) {
    var copy = article.cloneNode(true);
    copy.removeAttribute("hidden");
    var firstMeta = copy.querySelector(":scope > .note__meta");
    if (firstMeta) { firstMeta.remove(); }
    copy.querySelectorAll(":scope > .chip, :scope > h3, :scope > .tag-row, :scope > .btn-row")
      .forEach(function (n) { n.remove(); });
    // 이미지는 위의 ‘화면과 자료’에서 보여 주므로 본문에서는 뺀다
    copy.querySelectorAll("[data-project-gallery]").forEach(function (g) { g.remove(); });
    // 요약과 메타에서 이미 말한 ‘담당 역할’ 단락은 읽기 화면에서 생략(연습장에는 그대로 둔다)
    copy.querySelectorAll(":scope > h4").forEach(function (h4) {
      if (h4.textContent.trim() !== "담당 역할") { return; }
      var next = h4.nextElementSibling;
      while (next && next.tagName !== "H4" && !next.classList.contains("tag-row")) {
        var after = next.nextElementSibling; next.remove(); next = after;
      }
      h4.remove();
    });
    // 연습장의 소제목(h4)은 읽기 화면에서 한 단계 위(h3)로
    copy.querySelectorAll("h4").forEach(function (h4) {
      var h3 = el("h3"); h3.innerHTML = h4.innerHTML; h4.replaceWith(h3);
    });
    var prose = el("div", "reader-view__prose");
    while (copy.firstChild) { prose.appendChild(copy.firstChild); }
    return prose;
  }

  function linksFrom(article) {
    var out = [];
    article.querySelectorAll(".btn-row a").forEach(function (a) {
      var copy = a.cloneNode(true);
      copy.className = "btn btn--quiet";
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

  function heading(text) { return el("h2", null, text); }

  function renderReader(p) {
    var article = articleOf(p.id);
    var order = visibleProjects();
    if (order.indexOf(p) < 0) { order = projects; }
    var index = order.indexOf(p);

    readerEl.textContent = "";

    var bar = el("div", "reader-view__bar");
    var back = el("a", null, "← 프로젝트 목록");
    back.href = "#list";
    bar.appendChild(back);
    bar.appendChild(el("span", "count", (index + 1) + " / " + order.length));
    readerEl.appendChild(bar);

    var head = el("header");
    head.appendChild(el("p", "eyebrow", BOOKS[p.book].name));
    var title = el("h1", null, p.title);
    title.id = "reader-title";
    title.tabIndex = -1;
    head.appendChild(title);
    if (p.overview) { head.appendChild(el("p", "reader-view__lede", p.overview)); }

    // 기간 · 팀 · 내 역할 · 현재 상태 — 역할은 여기서 한 번만 말한다
    var facts = el("dl", "facts");
    [["기간", p.period], ["팀·구분", p.scope], ["내 역할", p.role]].forEach(function (pair) {
      var d = el("div");
      d.appendChild(el("dt", null, pair[0]));
      d.appendChild(el("dd", null, pair[1]));
      facts.appendChild(d);
    });
    var sd = el("div");
    sd.appendChild(el("dt", null, "현재 상태"));
    var dd = el("dd"); dd.appendChild(statusEl(p)); sd.appendChild(dd);
    facts.appendChild(sd);
    head.appendChild(facts);
    readerEl.appendChild(head);

    /* 문제 · 내 판단 · 확인한 결과 */
    var summary = el("dl", "reader-summary");
    function summaryRow(label, node) {
      var row = el("div", "reader-summary__row");
      row.appendChild(el("dt", null, label));
      var dd = el("dd");
      if (typeof node === "string") { dd.textContent = node; } else { dd.appendChild(node); }
      row.appendChild(dd);
      summary.appendChild(row);
    }
    function figures() {
      var fg = el("div", "figures");
      p.metrics.forEach(function (m) {
        var f = el("p", "figure-num");
        f.appendChild(el("span", "figure-num__value", m.value));
        f.appendChild(el("span", "figure-num__label", m.label));
        if (m.scope) { f.appendChild(el("span", "figure-num__scope", m.scope)); }
        fg.appendChild(f);
      });
      return fg;
    }
    var S = p.summary;
    summaryRow("문제", S ? S.problem : p.problem);
    if (S) {
      summaryRow("내 판단", S.decision);
    } else {
      var ul = el("ul", "reader-summary__list");
      p.build.forEach(function (x) { ul.appendChild(el("li", null, x)); });
      summaryRow("내 판단", ul);
    }
    var resultText = S && S.result ? S.result : p.resultNote;
    if (p.metrics.length || resultText) {
      var rs = el("div");
      if (p.metrics.length) { rs.appendChild(figures()); }
      if (resultText) { rs.appendChild(el("p", "reader-summary__note", resultText)); }
      summaryRow("확인한 결과", rs);
    }
    readerEl.appendChild(summary);

    // 화면과 자료 — 실제 화면 · 팀 산출물 · 예시 데이터 · 설명도는 캡션에 구분해 적는다
    var gallery = article ? galleryFrom(article) : null;
    if (gallery) {
      readerEl.appendChild(heading("화면과 자료"));
      readerEl.appendChild(gallery);
    }

    if (article) {
      readerEl.appendChild(heading("상세 과정"));
      readerEl.appendChild(proseFrom(article));
    }

    // 기술 · 관련 자료 · 관련 프로젝트
    var links = article ? linksFrom(article) : [];
    var related = (p.related || []).map(byId).filter(Boolean);
    readerEl.appendChild(heading("기술과 관련 자료"));
    var linkRow = el("div", "reader-summary__links");
    linkRow.appendChild(tagsEl(p.stack));
    if (links.length) {
      var row = el("p", "reader-view__actions");
      row.style.marginTop = "var(--s3)";
      links.forEach(function (a) { row.appendChild(a); });
      linkRow.appendChild(row);
    }
    if (related.length) {
      var rel = el("p", "reader-related");
      rel.appendChild(el("span", null, "관련 프로젝트 "));
      related.forEach(function (r, i) {
        if (i) { rel.appendChild(document.createTextNode(" · ")); }
        var ra = el("a", null, r.title); ra.href = "#p-" + r.id; rel.appendChild(ra);
      });
      linkRow.appendChild(rel);
    }
    readerEl.appendChild(linkRow);

    var pager = el("nav", "pager");
    pager.setAttribute("aria-label", "프로젝트 이동");
    if (index > 0) {
      var prev = el("a"); prev.href = "#p-" + order[index - 1].id;
      prev.appendChild(el("small", null, "← 이전 프로젝트"));
      prev.appendChild(el("strong", null, order[index - 1].title));
      pager.appendChild(prev);
    } else { pager.appendChild(el("span")); }
    if (index < order.length - 1) {
      var next = el("a", "pager__next"); next.href = "#p-" + order[index + 1].id;
      next.appendChild(el("small", null, "다음 프로젝트 →"));
      next.appendChild(el("strong", null, order[index + 1].title));
      pager.appendChild(next);
    }
    readerEl.appendChild(pager);

    var foot = el("p", "reader-view__actions");
    var back2 = el("a", "btn btn--quiet", "← 목록으로");
    back2.href = "#list";
    foot.appendChild(back2);
    var where = locate(article);
    if (where) {
      var inBook = el("button", "btn btn--quiet", "연습장(Book View)에서 보기");
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

  var viewSwitch = document.querySelector("[data-view-switch]");

  function showList(restoreFocus) {
    showView("quick");
    if (viewSwitch) { viewSwitch.hidden = false; }
    readerEl.hidden = true;
    listEl.hidden = false;
    if (pageHead) { pageHead.hidden = false; }
    document.title = "포트폴리오 — 장인우 · inwoo.log";
    if (restoreFocus && lastOpenedId) {
      var link = quickPanel.querySelector('[data-quick-list] a[href="#p-' + lastOpenedId + '"]');
      if (link) {
        link.focus({ preventScroll: true });
        link.closest(".card, .pick").scrollIntoView({ block: "center" });
      }
    }
  }

  function showReader(p) {
    showView("quick");
    renderReader(p);
    listEl.hidden = true;
    readerEl.hidden = false;
    if (pageHead) { pageHead.hidden = true; }
    if (viewSwitch) { viewSwitch.hidden = true; }
    lastOpenedId = p.id;
    document.title = p.title + " — 포트폴리오 · inwoo.log";
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
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
      if (pageHead) { pageHead.hidden = false; }
      if (viewSwitch) { viewSwitch.hidden = false; }
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
        var id = window.portfolioBookshelf ? window.portfolioBookshelf.activeId() : "work";
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

  renderFeatured();
  renderFilterButtons();
  renderGrid();
  route();
})();
