/* ==========================================================
   script/portfolio.js — 추가 실습
   연습장 넘기기. 내용은 HTML에 모두 적혀 있고,
   이 파일은 어떤 장을 보여줄지와 넘기는 방향만 정한다.

   스프링이 왼쪽에 있으므로 종이는 왼쪽으로 젖혀진다.
   - 다음 장 : 지금 장이 왼쪽으로 넘어가면서 아래 장이 드러남
   - 이전 장 : 넘어갔던 장이 오른쪽으로 되돌아옴
   ========================================================== */

var notebooks = document.querySelectorAll("[data-note]");

/**
 * 연습장 하나를 동작하게 만든다.
 * @param {HTMLElement} note
 */
function initNotebook(note) {
  var pages = note.querySelectorAll(".note__page");
  var countEl = note.querySelector(".note__count");
  var body = note.querySelector(".note__body");
  var backEl = note.querySelector("[data-back]");
  var prevEl = note.querySelector("[data-prev]");
  var nextEl = note.querySelector("[data-next]");
  var current = 0;
  var busy = false;

  /**
   * 표지에선 이전 버튼, 마지막 장에선 다음 버튼을 비활성화한다.
   * 책장에 꽂힌 연습장(data-chain-prev / data-chain-next)은
   * 끝에서 비활성화하는 대신 "이전 책 / 다음 책" 버튼으로 바뀐다.
   */
  function updateNav() {
    var toPrevBook = (current === 0) && note.hasAttribute("data-chain-prev");
    var toNextBook = (current === pages.length - 1) && note.hasAttribute("data-chain-next");

    if (prevEl) {
      prevEl.disabled = (current === 0) && !toPrevBook;
      setNavLabel(prevEl, toPrevBook, "이전 장", "이전 책", "‹", "‹ 이전 책");
    }
    if (nextEl) {
      nextEl.disabled = (current === pages.length - 1) && !toNextBook;
      setNavLabel(nextEl, toNextBook, "다음 장", "다음 책", "›", "다음 책 ›");
    }
  }

  /** 넘기기 버튼의 글자·설명을 "장" 또는 "책" 기준으로 맞춘다. */
  function setNavLabel(btn, toBook, pageLabel, bookLabel, pageText, bookText) {
    btn.classList.toggle("note__nav--book", toBook);
    btn.setAttribute("aria-label", toBook ? bookLabel : pageLabel);
    btn.textContent = toBook ? bookText : pageText;
  }

  /**
   * 표지에서 앞으로, 마지막 장에서 뒤로 넘기려 할 때 — 책장에 알린다.
   * @param {string} direction "next" | "prev"
   */
  function reachEdge(direction) {
    var attr = (direction === "next") ? "data-chain-next" : "data-chain-prev";
    if (busy || !note.hasAttribute(attr)) { return; }
    note.dispatchEvent(new CustomEvent("note:edge", {
      bubbles: true,
      detail: { direction: direction }
    }));
  }

  /** 페이지 번호 · 목록으로 · 넘기기 버튼을 지금 장에 맞춘다. */
  function syncUi() {
    countEl.textContent = (current === 0)
      ? ""
      : current + " / " + (pages.length - 1);

    // 표지에서는 "목록으로"를 감춘다
    backEl.hidden = (current === 0);
    updateNav();
  }

  /** 넘기는 중에 붙은 클래스를 떼고 원래 자리로 돌린다. */
  function cleanUp(page) {
    page.classList.remove("is-flipping-out", "is-flipping-in");
    page.hidden = true;
  }

  /**
   * 지정한 장을 펼친다.
   * @param {number} index
   * @param {string} direction "next" | "prev"
   */
  function openPage(index, direction) {
    if (index === pages.length && direction === "next") { reachEdge("next"); return; }
    if (index === -1 && direction === "prev") { reachEdge("prev"); return; }
    if (busy || index < 0 || index >= pages.length || index === current) {
      return;
    }

    var from = pages[current];
    var to = pages[index];

    busy = true;
    current = index;

    to.hidden = false;
    to.classList.remove("is-flipping-out", "is-flipping-in");

    if (direction === "next") {
      // 지금 장이 왼쪽으로 넘어간다. 아래에서 다음 장이 드러난다.
      from.classList.add("is-flipping-out");
    } else {
      // 넘어가 있던 장이 오른쪽으로 되돌아온다.
      from.hidden = true;
      to.classList.add("is-flipping-in");
    }

    var moving = (direction === "next") ? from : to;

    var done = function () {
      moving.removeEventListener("animationend", done);
      if (direction === "next") {
        cleanUp(from);
      } else {
        to.classList.remove("is-flipping-in");
      }
      busy = false;
    };

    moving.addEventListener("animationend", done);

    // 모션 최소화 설정에서는 애니메이션이 사실상 없으므로 바로 정리한다.
    setTimeout(function () {
      if (busy) { done(); }
    }, 700);

    syncUi();
  }

  /**
   * 애니메이션 없이 바로 그 장을 펼친다 — 다른 책에서 넘어올 때 쓴다.
   * @param {number} index
   */
  function jumpTo(index) {
    index = Math.max(0, Math.min(pages.length - 1, index));
    for (var p = 0; p < pages.length; p++) {
      pages[p].classList.remove("is-flipping-out", "is-flipping-in");
      pages[p].hidden = (p !== index);
    }
    busy = false;
    current = index;
    syncUi();
  }

  // 목차 클릭 · 목록으로 돌아가기
  note.addEventListener("click", function (event) {
    var tocBtn = event.target.closest(".toc__btn");
    if (tocBtn) {
      openPage(Number(tocBtn.dataset.goto), "next");
      return;
    }

    if (event.target.closest("[data-back]")) {
      openPage(0, "prev");
      return;
    }

    if (event.target.closest("[data-prev]")) {
      openPage(current - 1, "prev");
      return;
    }

    if (event.target.closest("[data-next]")) {
      openPage(current + 1, "next");
    }
  });

  /* ----------------------------------------------------------
     종이 자체가 버튼 — 오른쪽 절반을 누르면 다음 장,
     왼쪽 절반을 누르면 이전 장. 커서도 방향 손가락으로 바뀐다.
     ---------------------------------------------------------- */

  /** 마우스 위치가 연습장 전체 기준 오른쪽 절반인가 */
  function isRightHalf(event) {
    var rect = note.getBoundingClientRect();
    return (event.clientX - rect.left) > rect.width / 2;
  }

  // 연습장 전체가 버튼 — 센터 기준 오른쪽 절반=다음 장, 왼쪽 절반=이전 장
  note.addEventListener("click", function (event) {
    // 목차·넘기기 버튼·링크 클릭은 각자 동작에 맡긴다
    if (event.target.closest("button, a")) { return; }

    if (isRightHalf(event)) {
      openPage(current + 1, "next");
    } else {
      openPage(current - 1, "prev");
    }
  });

  // 넘길 수 있는 방향일 때만 손가락 커서를 보여준다
  note.addEventListener("mousemove", function (event) {
    var overControl = !!event.target.closest("button, a");
    var right = isRightHalf(event);

    note.classList.toggle("zone-next",
      !overControl && right &&
      (current < pages.length - 1 || note.hasAttribute("data-chain-next")));
    note.classList.toggle("zone-prev",
      !overControl && !right &&
      (current > 0 || note.hasAttribute("data-chain-prev")));
  });

  note.addEventListener("mouseleave", function () {
    note.classList.remove("zone-next", "zone-prev");
  });

  // 방향키로 넘기기
  note.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      openPage(current + 1, "next");
    } else if (event.key === "ArrowLeft") {
      openPage(current - 1, "prev");
    }
  });

  // 첫 화면 정리
  jumpTo(0);

  // 버튼이 없어도 키보드(← →)로 넘길 수 있게 초점을 받을 수 있게 한다
  note.setAttribute("tabindex", "0");

  return {
    jumpTo: jumpTo,
    refresh: syncUi,
    lastIndex: function () { return pages.length - 1; }
  };
}

var notebookApis = [];
for (var n = 0; n < notebooks.length; n++) {
  notebookApis.push(initNotebook(notebooks[n]));
}

/* ==========================================================
   책장 (portfolio.html) — 위에 꽂힌 책을 누르면 아래에 그 책이 펼쳐진다.
   한 번에 한 권만 펼치고, 마지막 장에서 다음으로 넘기면 다음 책 표지로,
   표지에서 이전으로 넘기면 앞 책의 마지막 장으로 이어진다.
   책장이 없는 페이지(how.html)에서는 아무것도 하지 않는다.
   ========================================================== */
(function initBookshelf() {
  var shelf = document.querySelector("[data-bookshelf]");
  if (!shelf) { return; }

  var spines = shelf.querySelectorAll("[data-book]");
  var books = [];   // { id, wrap, note, api, spine }

  for (var i = 0; i < spines.length; i++) {
    var id = spines[i].getAttribute("data-book");
    var wrap = document.getElementById(id);
    var note = wrap && wrap.querySelector("[data-note]");
    var api = note && notebookApis[Array.prototype.indexOf.call(notebooks, note)];
    if (!api) { continue; }
    books.push({ id: id, wrap: wrap, note: note, api: api, spine: spines[i] });
  }
  if (!books.length) { return; }

  // 앞뒤로 이어지는 책이 있으면 끝 장에서 "다음 책 / 이전 책"으로 넘어가게 표시
  for (var b = 0; b < books.length; b++) {
    if (b > 0) { books[b].note.setAttribute("data-chain-prev", ""); }
    if (b < books.length - 1) { books[b].note.setAttribute("data-chain-next", ""); }
    books[b].api.refresh();
  }

  var active = -1;

  function indexOfId(id) {
    for (var k = 0; k < books.length; k++) {
      if (books[k].id === id) { return k; }
    }
    return -1;
  }

  /**
   * 책 한 권을 펼친다.
   * @param {number} index 몇 번째 책
   * @param {number} page  펼칠 장 (0 = 표지)
   * @param {Object} [opts] { focusNote, updateHash }
   */
  function openBook(index, page, opts) {
    opts = opts || {};
    if (index < 0 || index >= books.length) { return; }

    var book = books[index];
    for (var k = 0; k < books.length; k++) {
      var on = (k === index);
      books[k].wrap.hidden = !on;
      books[k].spine.setAttribute("aria-pressed", on ? "true" : "false");
      books[k].spine.classList.toggle("is-active", on);
      if (on) {
        books[k].spine.setAttribute("aria-current", "true");
      } else {
        books[k].spine.removeAttribute("aria-current");
      }
    }

    book.api.jumpTo(page);

    if (active !== index) {
      // 책이 바뀔 때만 살짝 올라오는 효과 (모션 최소화 설정에선 꺼진다)
      book.wrap.classList.remove("is-entering");
      void book.wrap.offsetWidth;
      book.wrap.classList.add("is-entering");
    }
    active = index;

    if (opts.updateHash && history.replaceState) {
      history.replaceState(null, "", "#" + book.id);
    }
    if (opts.focusNote) {
      book.note.focus({ preventScroll: true });
    }
  }

  books.forEach(function (book, index) {
    book.wrap.addEventListener("animationend", function () {
      book.wrap.classList.remove("is-entering");
    });

    // 책장에서 책을 고르면 그 책 표지를 펼친다
    book.spine.addEventListener("click", function () {
      openBook(index, 0, { updateHash: true });
    });

    // 끝 장에서 더 넘기면 옆 책으로
    book.note.addEventListener("note:edge", function (event) {
      var hadFocus = book.note.contains(document.activeElement);
      if (event.detail.direction === "next") {
        openBook(index + 1, 0, { updateHash: true, focusNote: hadFocus });
      } else {
        var prev = books[index - 1];
        openBook(index - 1, prev ? prev.api.lastIndex() : 0,
                 { updateHash: true, focusNote: hadFocus });
      }
    });
  });

  // 책 안의 링크로 다른 책의 특정 장 열기 (data-open-book / data-open-page)
  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-open-book]");
    if (!link) { return; }
    var target = indexOfId(link.getAttribute("data-open-book"));
    if (target < 0) { return; }
    event.preventDefault();
    openBook(target, Number(link.getAttribute("data-open-page")) || 0,
             { updateHash: true, focusNote: true });
    shelf.scrollIntoView({ block: "start" });
  });

  // 주소의 #skala · #team · #solo 로 바로 그 책을 연다
  function openFromHash() {
    var target = indexOfId(location.hash.slice(1));
    if (target >= 0) {
      openBook(target, 0);
      return true;
    }
    return false;
  }

  window.addEventListener("hashchange", openFromHash);

  if (!openFromHash()) {
    openBook(0, 0);
  }
})();
