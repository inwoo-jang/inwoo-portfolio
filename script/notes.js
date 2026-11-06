/* ==========================================================
   script/notes.js — Engineering Notes
   - 목록: notes/index.json (tools/build-notes-index.mjs 로 생성)
   - 본문: notes/<slug>.md 를 읽어 script/markdown.js 로 안전하게 렌더링
   - 주소: (없음)·#list → 목록 / #n-<slug> → 노트 상세
   ========================================================== */
(function () {
  var root = document.querySelector("[data-notes]");
  if (!root) { return; }

  var REPO_BLOB = "https://github.com/inwoo-jang/inwoo-portfolio/blob/main/";
  var CATEGORIES = [
    { id: "tools", label: "Tools & IDE", desc: "Kiro · VS Code · Git · GitHub" },
    { id: "ai", label: "AI Engineering", desc: "RAG · LangGraph · MCP · Agent" },
    { id: "backend", label: "Backend & Database", desc: "Java · Spring · Python · PostgreSQL" },
    { id: "infra", label: "Infrastructure & DevOps", desc: "Docker · Kubernetes · CI/CD · AWS" },
    { id: "testing", label: "Testing & Security", desc: "Playwright · Vitest · Agent 보안" },
    { id: "troubleshooting", label: "Troubleshooting", desc: "실제 오류 원인과 해결 기록" }
  ];

  var listEl = root.querySelector("[data-notes-list]");
  var gridEl = root.querySelector("[data-notes-grid]");
  var countEl = root.querySelector("[data-notes-count]");
  var catBox = root.querySelector("[data-note-cats]");
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
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) { return CATEGORIES[i]; }
    }
    return { id: id, label: id, desc: "" };
  }

  function formatDate(iso) {
    return iso ? iso.replace(/-/g, ".") : "";
  }

  /* ---------- 목록 ---------- */

  function renderCategories() {
    catBox.textContent = "";
    var opts = [{ id: "all", label: "전체" }].concat(CATEGORIES);
    opts.forEach(function (c) {
      var count = c.id === "all" ? notes.length
        : notes.filter(function (n) { return n.category === c.id; }).length;
      var btn = el("button", "filter-btn");
      btn.type = "button";
      btn.dataset.value = c.id;
      btn.setAttribute("aria-pressed", String(state.category === c.id));
      btn.appendChild(document.createTextNode(c.label + " "));
      var num = el("span", "filter-btn__count", String(count));
      btn.appendChild(num);
      if (c.desc) { btn.title = c.desc; }
      btn.addEventListener("click", function () {
        state.category = c.id;
        catBox.querySelectorAll(".filter-btn").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.value === c.id));
        });
        renderList();
      });
      catBox.appendChild(btn);
    });
  }

  function matches(note) {
    if (state.category !== "all" && note.category !== state.category) { return false; }
    var q = state.query.trim().toLowerCase();
    if (!q) { return true; }
    var hay = [note.title, note.summary, note.tags.join(" "), categoryOf(note.category).label]
      .join(" ").toLowerCase();
    return q.split(/\s+/).every(function (word) { return hay.indexOf(word) >= 0; });
  }

  function noteCard(n) {
    var li = el("li", "ncard");
    var top = el("p", "ncard__kicker");
    top.appendChild(el("span", "ncard__cat", categoryOf(n.category).label));
    if (n.sample) { top.appendChild(el("span", "badge-sample", "샘플")); }
    li.appendChild(top);

    var h = el("h3", "ncard__title");
    var a = el("a", "ncard__link", n.title);
    a.href = "#n-" + n.slug;
    h.appendChild(a);
    li.appendChild(h);

    li.appendChild(el("p", "ncard__summary", n.summary));

    var foot = el("div", "ncard__foot");
    var tags = el("ul", "tag-row");
    tags.setAttribute("aria-label", "태그");
    n.tags.forEach(function (t) { tags.appendChild(el("li", "tag", t)); });
    foot.appendChild(tags);
    var time = el("time", "ncard__date", formatDate(n.date));
    time.dateTime = n.date;
    foot.appendChild(time);
    li.appendChild(foot);
    return li;
  }

  function renderList() {
    var list = notes.filter(matches);
    gridEl.textContent = "";
    list.forEach(function (n) { gridEl.appendChild(noteCard(n)); });

    if (list.length) {
      countEl.textContent = "노트 " + list.length + "개";
    } else if (state.category !== "all" && !state.query) {
      countEl.textContent = "‘" + categoryOf(state.category).label + "’ 카테고리에는 아직 작성한 노트가 없습니다.";
    } else {
      countEl.textContent = "검색 결과가 없습니다. 다른 키워드나 ‘전체’ 카테고리로 찾아보세요.";
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

    var bar = el("div", "reader__bar");
    var back = el("a", "reader__back", "← 노트 목록");
    back.href = "#list";
    bar.appendChild(back);
    bar.appendChild(el("span", "reader__pos", categoryOf(note.category).label));
    readerEl.appendChild(bar);

    var head = el("header", "reader__head");
    var kicker = el("p", "ncard__kicker");
    kicker.appendChild(el("span", "ncard__cat", categoryOf(note.category).label));
    if (note.sample) { kicker.appendChild(el("span", "badge-sample", "샘플")); }
    head.appendChild(kicker);
    var title = el("h2", "reader__title", note.title);
    title.id = "note-title";
    title.tabIndex = -1;
    head.appendChild(title);
    var meta = el("p", "reader__meta");
    var time = el("time", null, formatDate(note.date));
    time.dateTime = note.date;
    meta.appendChild(document.createTextNode("작성 "));
    meta.appendChild(time);
    head.appendChild(meta);
    var tags = el("ul", "tag-row");
    tags.setAttribute("aria-label", "태그");
    note.tags.forEach(function (t) { tags.appendChild(el("li", "tag tag--sky", t)); });
    head.appendChild(tags);
    readerEl.appendChild(head);

    var prose = el("div", "reader__prose md");
    prose.setAttribute("aria-busy", "true");
    prose.appendChild(el("p", "reader__note", "노트를 불러오는 중…"));
    readerEl.appendChild(prose);

    var foot = el("p", "reader__foot");
    var back2 = el("a", "btn btn--mini", "← 목록으로");
    back2.href = "#list";
    foot.appendChild(back2);
    var src = el("a", "btn btn--mini", "GitHub에서 원본 보기 ↗");
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
      prose.appendChild(el("p", "reader__note", "노트를 불러오지 못했습니다. 잠시 후 다시 시도하거나 GitHub에서 원본을 확인해 주세요."));
      prose.removeAttribute("aria-busy");
    });
  }

  /* ---------- 라우팅 ---------- */

  function showList(restoreFocus) {
    readerEl.hidden = true;
    listEl.hidden = false;
    document.title = "Engineering Notes — 장인우 · Inwoo.log";
    if (restoreFocus && lastOpened) {
      var link = gridEl.querySelector('a[href="#n-' + lastOpened + '"]');
      if (link) {
        link.focus({ preventScroll: true });
        link.closest(".ncard").scrollIntoView({ block: "center" });
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
      notes = (data && data.notes) || [];
      renderCategories();
      renderList();
      window.addEventListener("hashchange", route);
      route();
    })
    .catch(function () {
      countEl.textContent = "노트 목록을 불러오지 못했습니다. (로컬 파일로 열었다면 `python3 -m http.server` 같은 로컬 서버에서 열어 주세요.)";
    });
})();
