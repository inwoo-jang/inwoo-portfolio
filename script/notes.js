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

  var listEl = root.querySelector("[data-notes-list]");
  var gridEl = root.querySelector("[data-notes-grid]");
  var countEl = root.querySelector("[data-notes-count]");
  var catBox = root.querySelector("[data-note-cats]");
  var guideEl = root.querySelector("[data-note-category-guide]");
  var searchEl = root.querySelector("#note-search");
  var readerEl = root.querySelector("[data-note-reader]");

  var notes = [];
  var state = { category: "all", query: "" };
  var lastOpened = null;
  var currentRoute = null;
  var cache = {};

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

  function categoryTapes(note) {
    var tapes = el("div", "note-tapes");
    var labels = categoriesOf(note).map(function (id) { return categoryOf(id).label; });
    tapes.setAttribute("role", "img");
    tapes.setAttribute("aria-label", "분류: " + labels.join(", "));
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
    var opts = [{ id: "all", label: "전체" }].concat(categories);
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
      li.appendChild(btn);
      if (c.description) { btn.title = c.description; }
      btn.addEventListener("click", function () {
        state.category = c.id;
        catBox.querySelectorAll(".chip-btn").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.value === c.id));
        });
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
    var hay = [note.title, note.summary, note.tags.join(" "), categoryLabels]
      .join(" ").toLowerCase();
    return q.split(/\s+/).every(function (word) { return hay.indexOf(word) >= 0; });
  }

  function tagList(n) {
    var ul = el("ul", "tags");
    ul.setAttribute("aria-label", "기술·키워드");
    n.tags.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    if (n.sample) { ul.appendChild(el("li", null, "작성 예정")); }
    return ul;
  }

  function noteCard(n) {
    var li = el("li", "entry");
    applyCategory(li, categoryOf(n.category));
    li.appendChild(categoryTapes(n));
    var time = el("time", "entry__date", formatNoteDate(n));
    time.dateTime = n.date;
    if (n.dateType === "class") { time.setAttribute("aria-label", "수업 " + formatNoteDate(n)); }
    li.appendChild(time);
    var body = el("div", "entry__body");
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

  function renderList() {
    var list = notes.filter(matches);
    gridEl.textContent = "";
    list.forEach(function (n) { gridEl.appendChild(noteCard(n)); });

    if (list.length) {
      countEl.textContent = "노트 " + list.length + "개";
    } else if (state.category !== "all" && !state.query) {
      countEl.textContent = "‘" + categoryOf(state.category).label + "’에 등록된 글은 아직 없습니다. " + categoryOf(state.category).description + "에 관한 글을 모을 분류입니다.";
    } else {
      countEl.textContent = "검색 결과가 없습니다. 검색어를 바꾸거나 분류를 ‘전체’로 선택해 보세요.";
    }
  }

  /* ---------- 상세 ---------- */

  function loadMarkdown(note) {
    if (cache[note.slug]) { return Promise.resolve(cache[note.slug]); }
    return fetch(note.file, { cache: "no-cache" }).then(function (res) {
      if (!res.ok) { throw new Error(res.status); }
      return res.text();
    }).then(function (text) {
      cache[note.slug] = text;
      return text;
    });
  }

  function renderReader(note) {
    readerEl.textContent = "";
    applyCategory(readerEl, categoryOf(note.category));

    var bar = el("div", "reader-view__bar");
    var back = el("a", null, "← 노트 목록");
    back.href = "#list";
    bar.appendChild(back);
    var badges = el("div", "note-categories");
    categoriesOf(note).forEach(function (id) { badges.appendChild(categoryBadge(categoryOf(id))); });
    bar.appendChild(badges);
    readerEl.appendChild(bar);

    var head = el("header");
    var title = el("h1", null, note.title);
    title.id = "note-title";
    title.tabIndex = -1;
    head.appendChild(title);
    var meta = el("p", "meta");
    var time = el("time", null, (note.dateType === "class" ? "수업 " : "작성 ") + formatNoteDate(note));
    time.dateTime = note.date;
    meta.appendChild(time);
    head.appendChild(meta);
    var flags = el("ul", "doc-flags");
    flags.style.marginTop = "var(--s4)";
    note.tags.forEach(function (t) { flags.appendChild(el("li", null, t)); });
    if (note.sample) { flags.appendChild(el("li", "is-sample", "작성 예정 — 목차만 정리한 글")); }
    head.appendChild(flags);
    readerEl.appendChild(head);

    var prose = el("div", "md");
    prose.style.marginTop = "var(--s6)";
    prose.setAttribute("aria-busy", "true");
    prose.appendChild(el("p", "count", "노트를 불러오는 중…"));
    readerEl.appendChild(prose);

    var foot = el("p", "reader-view__actions");
    var back2 = el("a", "btn btn--quiet", "← 목록으로");
    back2.href = "#list";
    foot.appendChild(back2);
    var src = el("a", "btn btn--quiet", "GitHub에서 원본 보기 ↗");
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
      prose.appendChild(el("p", "count", "노트를 불러오지 못했습니다. 잠시 후 다시 시도하거나 GitHub에서 원본을 확인해 주세요."));
      prose.removeAttribute("aria-busy");
    });
  }

  /* ---------- 라우팅 ---------- */

  function showList(restoreFocus) {
    readerEl.hidden = true;
    listEl.hidden = false;
    document.title = "Dev Notes — 장인우 · Inwoo.log";
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

  searchEl.addEventListener("input", function () {
    state.query = searchEl.value;
    renderList();
  });

  fetch("notes/index.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) { throw new Error(res.status); }
      return res.json();
    })
    .then(function (data) {
      categories = (data && data.categories) || [];
      notes = (data && data.notes) || [];
      renderCategories();
      renderCategoryGuide();
      renderList();
      window.addEventListener("hashchange", route);
      route();
    })
    .catch(function () {
      countEl.textContent = "노트 목록을 불러오지 못했습니다. 페이지를 새로고침해 주세요.";
    });
})();
