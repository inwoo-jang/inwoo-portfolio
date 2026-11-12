/* ==========================================================
   script/notes.js — Dev Notes
   - 목록: notes/index.json (tools/build-notes-index.mjs 로 생성)
   - 본문: notes/<slug>.md 를 읽어 script/markdown.js 로 안전하게 렌더링
   - 주소: (없음)·#list → 목록 / #n-<slug> → 노트 상세
   ========================================================== */
(function () {
  var root = document.querySelector("[data-notes]");
  if (!root) { return; }

  var REPO_BLOB = "https://github.com/inwoo-jang/inwoo-portfolio/blob/main/";
  var categories = [];
  var seriesList = [];

  var listEl = root.querySelector("[data-notes-list]");
  var gridEl = root.querySelector("[data-notes-grid]");
  var countEl = root.querySelector("[data-notes-count]");
  var catBox = root.querySelector("[data-note-cats]");
  var guideEl = root.querySelector("[data-note-category-guide]");
  var searchEl = root.querySelector("#note-search");
  var readerEl = root.querySelector("[data-note-reader]");
  var viewSwitch = document.querySelector("[data-notes-view-switch]");
  var viewButtons = document.querySelectorAll("[data-notes-view]");

  var notes = [];
  var state = { category: "all", query: "" };
  var lastOpened = null;
  var currentRoute = null;
  var cache = {};
  var pending = {};

  /* 페이지 언어가 영어(lang="en")면 영어 문구를 쓴다 */
  var EN = document.documentElement.lang === "en";
  function T(ko, en) { return EN ? en : ko; }

  function setLayout(layout) {
    layout = layout === "list" ? "list" : "cards";
    gridEl.dataset.layout = layout;
    viewButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.notesView === layout));
    });
  }

  var savedLayout = "cards";
  try { savedLayout = localStorage.getItem("inwoo-notes-view"); } catch (e) { /* 저장소 없이도 전환 가능 */ }
  setLayout(savedLayout);
  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var layout = button.dataset.notesView;
      setLayout(layout);
      try { localStorage.setItem("inwoo-notes-view", layout); } catch (e) { /* 현재 페이지에서만 유지 */ }
    });
  });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text != null) { node.textContent = text; }
    return node;
  }

  function categoryOf(id) {
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id === id) { return categories[i]; }
    }
    return { id: id, label: id, description: "" };
  }

  function applyCategory(node, category) {
    node.dataset.category = category.id;
    if (!category.color) { return; }
    node.style.setProperty("--note-ink", category.color.ink);
    node.style.setProperty("--note-soft", category.color.soft);
    node.style.setProperty("--tape", category.color.tape);
  }

  function categoryBadge(category, tag) {
    var badge = el(tag || "span", "note-category", category.label);
    applyCategory(badge, category);
    return badge;
  }

  function categoriesOf(note) {
    return note.categories && note.categories.length ? note.categories : [note.category];
  }

  function pad2(n) { return n < 10 ? "0" + n : String(n); }

  function seriesOf(note) {
    if (!note.series) { return null; }
    for (var i = 0; i < seriesList.length; i++) {
      if (seriesList[i].id === note.series.id) { return seriesList[i]; }
    }
    return null;
  }

  /* 카드·상세 상단의 작은 시리즈 라벨 — “AX FIELD NOTES · 01” */
  function seriesTag(note, className) {
    var s = seriesOf(note);
    if (!s) { return null; }
    var tag = el("p", className, s.label + " · " + pad2(note.series.order));
    tag.setAttribute("aria-label", T("시리즈 ", "Series ") + s.title + " " + note.series.order + T("회", ""));
    return tag;
  }

  function categoryTapes(note) {
    var tapes = el("div", "note-tapes");
    var labels = categoriesOf(note).map(function (id) { return categoryOf(id).label; });
    tapes.setAttribute("role", "img");
    tapes.setAttribute("aria-label", T("분류: ", "Categories: ") + labels.join(", "));
    categoriesOf(note).forEach(function (id) {
      var category = categoryOf(id);
      var tape = el("span", "note-tape");
      applyCategory(tape, category);
      tape.title = category.label;
      tape.setAttribute("aria-hidden", "true");
      tapes.appendChild(tape);
    });
    return tapes;
  }

  function formatDate(iso) {
    return iso ? iso.replace(/-/g, ".") : "";
  }

  function formatNoteDate(note) {
    var start = formatDate(note.date);
    if (!note.dateEnd || note.dateEnd === note.date) { return start; }
    var end = formatDate(note.dateEnd);
    return start + "–" + (note.date.slice(0, 4) === note.dateEnd.slice(0, 4) ? end.slice(5) : end);
  }

  /* ---------- 목록 ---------- */

  function renderCategories() {
    catBox.textContent = "";
    var opts = [{ id: "all", label: T("전체", "All") }].concat(categories);
    opts.forEach(function (c) {
      var count = c.id === "all" ? notes.length
        : notes.filter(function (n) { return categoriesOf(n).indexOf(c.id) >= 0; }).length;
      var li = el("li");
      var btn = el("button", "chip-btn");
      applyCategory(btn, c);
      btn.type = "button";
      btn.dataset.value = c.id;
      btn.setAttribute("aria-pressed", String(state.category === c.id));
      btn.appendChild(document.createTextNode(c.label));
      btn.appendChild(el("small", null, String(count)));
      btn.setAttribute("aria-label", c.label + T(", 글 " + count + "개", ", " + count + (count === 1 ? " note" : " notes")));
      li.appendChild(btn);
      if (c.description) { btn.title = c.description; }
      btn.addEventListener("click", function () {
        setCategory(c.id);
        renderList();
      });
      catBox.appendChild(li);
    });
  }

  function renderCategoryGuide() {
    if (!guideEl) { return; }
    guideEl.textContent = "";
    categories.forEach(function (category) {
      var item = el("li");
      item.appendChild(categoryBadge(category));
      item.appendChild(el("p", null, category.description));
      guideEl.appendChild(item);
    });
  }

  function matches(note) {
    if (state.category !== "all" && categoriesOf(note).indexOf(state.category) < 0) { return false; }
    var q = state.query.trim().toLowerCase();
    if (!q) { return true; }
    var categoryLabels = categoriesOf(note).map(function (id) { return categoryOf(id).label; }).join(" ");
    var s = seriesOf(note);
    var hay = [note.title, note.summary, note.tags.join(" "), categoryLabels, s ? s.label + " " + s.title : ""]
      .join(" ").toLowerCase();
    return q.split(/\s+/).every(function (word) { return hay.indexOf(word) >= 0; });
  }

  function tagList(n) {
    var ul = el("ul", "tags");
    ul.setAttribute("aria-label", T("기술·키워드", "Tech and keywords"));
    n.tags.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    if (n.sample) { ul.appendChild(el("li", null, T("작성 예정", "Coming soon"))); }
    return ul;
  }

  function noteCard(n) {
    var li = el("li", "entry");
    applyCategory(li, categoryOf(n.category));
    li.appendChild(categoryTapes(n));
    var time = el("time", "entry__date", formatNoteDate(n));
    time.dateTime = n.date;
    if (n.dateType === "class") { time.setAttribute("aria-label", T("수업 ", "Class ") + formatNoteDate(n)); }
    var meta = el("div", "entry__meta");
    meta.appendChild(time);
    var badges = el("div", "entry__categories");
    categoriesOf(n).forEach(function (id) { badges.appendChild(categoryBadge(categoryOf(id))); });
    meta.appendChild(badges);
    li.appendChild(meta);
    var body = el("div", "entry__body");
    var stag = seriesTag(n, "entry__series");
    if (stag) { body.appendChild(stag); }
    var h = el("h3", "entry__title");
    var a = el("a", null, n.title);
    a.href = "#n-" + n.slug;
    h.appendChild(a);
    body.appendChild(h);
    body.appendChild(el("p", "entry__summary", n.summary));
    body.appendChild(tagList(n));
    li.appendChild(body);
    return li;
  }

  var emptyEl = el("div", "notes-empty");
  emptyEl.hidden = true;
  emptyEl.setAttribute("role", "status");
  gridEl.parentNode.insertBefore(emptyEl, gridEl.nextSibling);

  function setCategory(id) {
    state.category = id;
    catBox.querySelectorAll(".chip-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.value === id));
    });
  }

  function renderEmpty() {
    emptyEl.textContent = "";
    var hasQuery = !!state.query.trim();
    var inCategory = state.category !== "all";
    var title = hasQuery
      ? T("‘" + state.query.trim() + "’에 맞는 노트가 없습니다", "No notes match ‘" + state.query.trim() + "’")
      : T("‘" + categoryOf(state.category).label + "’에 등록된 글은 아직 없습니다", "No notes in ‘" + categoryOf(state.category).label + "’ yet");
    emptyEl.appendChild(el("p", "notes-empty__title", title));
    emptyEl.appendChild(el("p", "notes-empty__hint", hasQuery
      ? (inCategory ? T("‘" + categoryOf(state.category).label + "’ 분류 안에서 찾았습니다. 검색어를 바꾸거나 전체에서 찾아보세요.", "Searched within ‘" + categoryOf(state.category).label + "’. Try another term or search all notes.")
                    : T("제목·요약·분류·태그에서 찾았습니다. 다른 검색어를 넣어 보세요.", "Searched titles, summaries, categories and tags. Try another term."))
      : categoryOf(state.category).description));
    var reset = el("button", "btn btn--quiet", T("검색·분류 초기화", "Clear search and filter"));
    reset.type = "button";
    reset.addEventListener("click", function () {
      state.query = ""; searchEl.value = "";
      setCategory("all");
      renderList();
      searchEl.focus();
    });
    emptyEl.appendChild(reset);
  }

  function renderList() {
    var list = notes.filter(matches);
    gridEl.textContent = "";
    list.forEach(function (n) { gridEl.appendChild(noteCard(n)); });
    gridEl.hidden = !list.length;
    emptyEl.hidden = !!list.length;

    if (list.length) {
      countEl.textContent = T("노트 " + list.length + "개", list.length + (list.length === 1 ? " note" : " notes"));
    } else {
      countEl.textContent = T("노트 0개", "0 notes");
      renderEmpty();
    }
  }

  /* ---------- 상세 ---------- */

  function loadMarkdown(note) {
    if (cache[note.slug]) { return Promise.resolve(cache[note.slug]); }
    if (pending[note.slug]) { return pending[note.slug]; }
    var url = note.file + (note.revision ? "?v=" + encodeURIComponent(note.revision) : "");
    pending[note.slug] = fetch(url, { cache: note.revision ? "default" : "no-cache" }).then(function (res) {
      if (!res.ok) { throw new Error(res.status); }
      return res.text();
    }).then(function (text) {
      cache[note.slug] = text;
      delete pending[note.slug];
      return text;
    }).catch(function (error) {
      delete pending[note.slug];
      throw error;
    });
    return pending[note.slug];
  }

  function prefetchNote(event) {
    if (navigator.connection && (navigator.connection.saveData || /(^|-)2g$/.test(navigator.connection.effectiveType))) { return; }
    var link = event.target.closest('a[href^="#n-"]');
    if (!link) { return; }
    var slug = link.hash.slice(3);
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].slug === slug) { loadMarkdown(notes[i]).catch(function () {}); return; }
    }
  }
  root.addEventListener("pointerover", prefetchNote);
  root.addEventListener("focusin", prefetchNote);

  function relatedBlock(note) {
    var items = (note.related || []).map(function (slug) {
      for (var i = 0; i < notes.length; i++) { if (notes[i].slug === slug) { return notes[i]; } }
      return null;
    }).filter(Boolean);
    if (!items.length) { return null; }
    var nav = el("nav", "related-notes");
    nav.setAttribute("aria-labelledby", "related-notes-title");
    var h = el("h2", "related-notes__title", T("관련 노트", "Related notes"));
    h.id = "related-notes-title";
    nav.appendChild(h);
    var ul = el("ul", "related-notes__list");
    items.forEach(function (n) {
      var li = el("li");
      var a = el("a", null, n.title);
      a.href = "#n-" + n.slug;
      li.appendChild(a);
      var time = el("time", "related-notes__date", formatNoteDate(n));
      time.dateTime = n.date;
      li.appendChild(time);
      ul.appendChild(li);
    });
    nav.appendChild(ul);
    return nav;
  }

  /* 상세의 시리즈 목차 — 영문 라벨 · 한국어 제목 · 현재/전체 회차 · 목차 · 이전/다음.
     게시되지 않은 회차는 링크 없이 보여 준다(없는 글의 주소를 만들지 않는다). */
  function seriesBlock(note) {
    var s = seriesOf(note);
    if (!s) { return null; }
    var nav = el("nav", "series-nav");
    nav.setAttribute("aria-labelledby", "series-nav-title");
    var head = el("div", "series-nav__head");
    head.appendChild(el("p", "series-nav__label", T("시리즈", "Series")));
    var h = el("h2", "series-nav__title", s.title);
    h.id = "series-nav-title";
    head.appendChild(h);
    head.appendChild(el("p", "series-nav__count",
      pad2(note.series.order) + " / " + pad2(s.total) + T(" · 총 " + s.total + "편", " · " + s.total + " in total")));
    nav.appendChild(head);

    var ol = el("ol", "series-nav__list");
    s.items.forEach(function (item) {
      var li = el("li");
      var no = el("span", "series-nav__no", pad2(item.order));
      if (item.slug === note.slug) {
        li.className = "is-current";
        li.appendChild(no);
        var cur = el("span", "series-nav__name", item.title);
        cur.setAttribute("aria-current", "page");
        li.appendChild(cur);
      } else if (item.slug) {
        var a = el("a", "series-nav__name", item.title);
        a.href = "#n-" + item.slug;
        li.appendChild(no);
        li.appendChild(a);
      } else {
        li.className = "is-planned";
        li.appendChild(no);
        var planned = el("span", "series-nav__name", item.title + " ");
        planned.appendChild(el("span", "series-nav__soon", T("준비 중", "Coming soon")));
        li.appendChild(planned);
      }
      ol.appendChild(li);
    });
    nav.appendChild(ol);

    var published = s.items.filter(function (i) { return i.slug; });
    var idx = -1;
    published.forEach(function (i, k) { if (i.slug === note.slug) { idx = k; } });
    var pager = el("div", "series-nav__pager");
    if (idx > 0) {
      var prev = el("a", "series-nav__prev");
      prev.href = "#n-" + published[idx - 1].slug;
      prev.appendChild(el("small", null, T("← 이전 글", "← Previous")));
      prev.appendChild(el("span", null, published[idx - 1].title));
      pager.appendChild(prev);
    }
    if (idx >= 0 && idx < published.length - 1) {
      var next = el("a", "series-nav__next");
      next.href = "#n-" + published[idx + 1].slug;
      next.appendChild(el("small", null, T("다음 글 →", "Next →")));
      next.appendChild(el("span", null, published[idx + 1].title));
      pager.appendChild(next);
    }
    if (pager.children.length) { nav.appendChild(pager); }
    return nav;
  }

  function renderReader(note) {
    readerEl.textContent = "";
    readerEl.dataset.noteSlug = note.slug;
    applyCategory(readerEl, categoryOf(note.category));

    var bar = el("div", "reader-view__bar");
    var back = el("a", null, T("← 노트 목록", "← All notes"));
    back.href = "#list";
    bar.appendChild(back);
    var badges = el("div", "note-categories");
    categoriesOf(note).forEach(function (id) { badges.appendChild(categoryBadge(categoryOf(id))); });
    bar.appendChild(badges);
    readerEl.appendChild(bar);

    var head = el("header");
    var rtag = seriesTag(note, "reader-view__series");
    if (rtag) { head.appendChild(rtag); }
    var title = el("h1", null, note.title);
    title.id = "note-title";
    title.tabIndex = -1;
    head.appendChild(title);
    var meta = el("p", "meta");
    var time = el("time", null, (note.dateType === "class" ? T("수업 ", "Class ") : T("작성 ", "Written ")) + formatNoteDate(note));
    time.dateTime = note.date;
    meta.appendChild(time);
    if (note.updated) {
      meta.appendChild(document.createTextNode(" · "));
      var updated = el("time", null, T("업데이트 ", "Updated ") + formatDate(note.updated));
      updated.dateTime = note.updated;
      meta.appendChild(updated);
    }
    head.appendChild(meta);
    var flags = el("ul", "doc-flags");
    flags.style.marginTop = "var(--s4)";
    note.tags.forEach(function (t) { flags.appendChild(el("li", null, t)); });
    if (note.sample) { flags.appendChild(el("li", "is-sample", T("작성 예정 — 목차만 정리한 글", "Coming soon — outline only"))); }
    head.appendChild(flags);
    readerEl.appendChild(head);

    var prose = el("div", "md");
    prose.style.marginTop = "var(--s6)";
    prose.setAttribute("aria-busy", "true");
    prose.appendChild(el("p", "count", T("노트를 불러오는 중…", "Loading note…")));
    readerEl.appendChild(prose);

    var seriesNav = seriesBlock(note);
    if (seriesNav) { readerEl.appendChild(seriesNav); }

    var related = relatedBlock(note);
    if (related) { readerEl.appendChild(related); }

    var foot = el("p", "reader-view__actions");
    var back2 = el("a", "btn btn--quiet", T("← 목록으로", "← Back to list"));
    back2.href = "#list";
    foot.appendChild(back2);
    var src = el("a", "btn btn--quiet", T("GitHub에서 원본 보기 ↗", "View source on GitHub ↗"));
    src.href = REPO_BLOB + note.file;
    src.target = "_blank";
    src.rel = "noopener noreferrer";
    foot.appendChild(src);
    readerEl.appendChild(foot);

    loadMarkdown(note).then(function (text) {
      if (currentRoute !== "n-" + note.slug) { return; }
      // renderMarkdown은 모든 텍스트를 이스케이프하고 허용한 태그만 만든다 (script/markdown.js)
      prose.innerHTML = window.renderMarkdown(text, { idPrefix: note.slug + "-" });
      prose.removeAttribute("aria-busy");
    }).catch(function () {
      prose.textContent = "";
      prose.appendChild(el("p", "count", T("노트를 불러오지 못했습니다. 잠시 후 다시 시도하거나 GitHub에서 원본을 확인해 주세요.", "Couldn’t load this note. Try again in a moment, or read the source on GitHub.")));
      prose.removeAttribute("aria-busy");
    });
  }

  /* ---------- 라우팅 ---------- */

  function showList(restoreFocus) {
    readerEl.hidden = true;
    listEl.hidden = false;
    if (viewSwitch) { viewSwitch.hidden = false; }
    document.title = T("Dev Notes — 장인우 · Inwoo.log", "Dev Notes — Inwoo Jang · Inwoo.log");
    if (restoreFocus && lastOpened) {
      var link = gridEl.querySelector('a[href="#n-' + lastOpened + '"]');
      if (link) {
        link.focus({ preventScroll: true });
        link.closest(".entry").scrollIntoView({ block: "center" });
      }
    }
  }

  function showNote(note) {
    renderReader(note);
    listEl.hidden = true;
    readerEl.hidden = false;
    if (viewSwitch) { viewSwitch.hidden = true; }
    lastOpened = note.slug;
    document.title = note.title + " — Notes · Inwoo.log";
    root.scrollIntoView({ block: "start" });
    var title = document.getElementById("note-title");
    if (title) { title.focus({ preventScroll: true }); }
  }

  function route() {
    var hash = decodeURIComponent(location.hash.slice(1));
    if (hash === currentRoute) { return; }
    var prev = currentRoute;
    currentRoute = hash;
    if (hash.indexOf("n-") === 0) {
      var slug = hash.slice(2);
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].slug === slug) { showNote(notes[i]); return; }
      }
      // 노트 본문 안 제목 앵커(#n-<slug>-<제목>)는 이미 열린 노트 안에서만 쓰인다
    }
    showList(prev !== null && prev.indexOf("n-") === 0);
  }

  var guideToggle = root.querySelector("[data-notes-guide-toggle]");
  var guidePanel = root.querySelector("#notes-guide");
  if (guideToggle && guidePanel) {
    var setGuide = function (open) {
      guidePanel.hidden = !open;
      guideToggle.setAttribute("aria-expanded", String(open));
    };
    guideToggle.addEventListener("click", function () { setGuide(guidePanel.hidden); });
    guidePanel.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setGuide(false); guideToggle.focus(); }
    });
  }

  searchEl.addEventListener("input", function () {
    state.query = searchEl.value;
    renderList();
  });

  function loadIndex() {
    var embedded = document.getElementById("notes-data");
    if (embedded) {
      try { return Promise.resolve(JSON.parse(embedded.textContent)); } catch (e) { /* Fall back to the JSON file. */ }
    }
    return fetch(T("notes/index.json", "notes/en/index.json"), { cache: "no-cache" }).then(function (res) {
      if (!res.ok) { throw new Error(res.status); }
      return res.json();
    });
  }

  loadIndex()
    .then(function (data) {
      categories = (data && data.categories) || [];
      seriesList = (data && data.series) || [];
      notes = (data && data.notes) || [];
      renderCategories();
      renderCategoryGuide();
      renderList();
      window.addEventListener("hashchange", route);
      route();
    })
    .catch(function () {
      countEl.textContent = T("노트 목록을 불러오지 못했습니다. 페이지를 새로고침해 주세요.", "Couldn’t load the note list. Please refresh the page.");
    });
})();
