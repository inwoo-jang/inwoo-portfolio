/* ==========================================================
   script/portfolio.js — 추가 실습
   연습장 넘기기. 내용은 HTML에 모두 적혀 있고,
   이 파일은 어떤 장을 보여줄지와 넘기는 방향만 정한다.

   스프링이 왼쪽에 있으므로 종이는 왼쪽으로 젖혀진다.
   - 다음 장 : 지금 장이 왼쪽으로 넘어가면서 아래 장이 드러남
   - 이전 장 : 넘어갔던 장이 오른쪽으로 되돌아옴
   ========================================================== */

var notebooks = document.querySelectorAll("[data-note]");

/* 페이지 언어가 영어(lang="en")면 영어 문구를 쓴다 */
function nbT(ko, en) { return document.documentElement.lang === "en" ? en : ko; }

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
      setNavLabel(prevEl, toPrevBook, nbT("이전 장", "Previous page"), nbT("이전 책", "Previous book"), "‹", nbT("‹ 이전 책", "‹ Previous book"));
    }
    if (nextEl) {
      nextEl.disabled = (current === pages.length - 1) && !toNextBook;
      setNavLabel(nextEl, toNextBook, nbT("다음 장", "Next page"), nbT("다음 책", "Next book"), "›", nbT("다음 책 ›", "Next book ›"));
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

    // 양면으로 펼친 책(데스크톱)에서는 종이 한 장이 책등을 축으로 넘어간다
    if (spreadMode(from, to)) {
      flipSheet(from, to, direction);   // 버튼 줄(syncUi)도 이 안에서 맞춘다
      return;
    }

    to.hidden = false;
    to.classList.remove("is-flipping-out", "is-flipping-in");
    to.scrollTop = 0;   // 새로 펼친 장은 항상 처음부터 읽는다

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
    revealTop();
  }

  /** 양면 보기인지 — 데스크톱 폭이고, 두 장 모두 왼쪽·오른쪽 면이 있을 때 */
  function spreadMode(from, to) {
    if (!window.matchMedia("(min-width: 768px)").matches) { return false; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return false; }
    return !!(from.querySelector(".spread__left") && to.querySelector(".spread__right"));
  }

  /**
   * 판의 종이를 연습장 종이와 똑같이 맞춘다(색·결·책등 그늘의 위치까지).
   * 다르면 넘김이 끝나고 판을 걷어낼 때 종이가 한 번 '툭' 바뀌어 보인다.
   */
  function paperLike(el, n, offsetX) {
    var cs = getComputedStyle(note);
    var layers = cs.backgroundSize.split(",").length;
    var sizes = cs.backgroundSize.split(",").map(function (v) {
      v = v.trim();
      return v === "auto" ? (n.width + "px " + n.height + "px") : v;
    });
    var pos = [];
    for (var i = 0; i < layers; i++) { pos.push((-offsetX) + "px 0px"); }
    el.style.backgroundColor = cs.backgroundColor;
    el.style.backgroundImage = cs.backgroundImage;
    el.style.backgroundSize = sizes.join(", ");
    el.style.backgroundPosition = pos.join(", ");
    el.style.backgroundRepeat = cs.backgroundRepeat;
    el.style.backgroundBlendMode = cs.backgroundBlendMode;
  }

  /**
   * 책 반쪽(종이 한 장) 크기의 판. 연습장 종이와 같은 색·결로 칠하고,
   * 그 위에 장(.note__page)을 통째로 복제해 같은 자리에 얹는다 — 원래 스타일이 그대로 적용되도록.
   * 판에는 face 쪽 면만 보이고 반대쪽 면은 숨긴다.
   * @param {HTMLElement} page  복제할 장
   * @param {string} face       보일 면(".spread__left" / ".spread__right")
   * @param {string} side       판이 놓일 쪽("left" / "right")
   */
  function plate(page, face, side) {
    var n = note.getBoundingClientRect();
    var b = body.getBoundingClientRect();
    var half = n.width / 2;
    var offset = (side === "left") ? 0 : half;
    var el = document.createElement("div");
    el.className = "flip-plate flip-plate--" + side;
    el.setAttribute("aria-hidden", "true");
    el.style.left = offset + "px";
    el.style.width = half + "px";
    paperLike(el, n, offset);

    // 본문(.note__body) 자리와 크기를 그대로 흉내 낸 틀 — 장은 그 안을 가득 채운다
    var frame = document.createElement("div");
    frame.className = "flip-plate__frame";
    frame.style.left = (b.left - n.left - offset) + "px";
    frame.style.top = (b.top - n.top) + "px";
    frame.style.width = b.width + "px";
    frame.style.height = b.height + "px";
    var copy = page.cloneNode(true);
    copy.hidden = false;
    copy.classList.remove("is-flipping-out", "is-flipping-in");
    stripIds(copy);
    var other = copy.querySelector(face === ".spread__left" ? ".spread__right" : ".spread__left");
    if (other) { other.style.visibility = "hidden"; }
    frame.appendChild(copy);
    el.appendChild(frame);
    el._copy = copy;
    el._scroll = page.hidden ? 0 : page.scrollTop;
    return el;
  }

  /** 아래 버튼 줄(‹ 1/7 ›)을 지금 모습 그대로 판에 얹는다. 판을 걷어낼 때 버튼이 깜빡이지 않게. */
  function addControls(el, side) {
    var bar = note.querySelector(".note__controls");
    if (!bar) { return; }
    var n = note.getBoundingClientRect();
    var r = bar.getBoundingClientRect();
    var offset = (side === "left") ? 0 : n.width / 2;
    var copy = bar.cloneNode(true);
    stripIds(copy);
    copy.classList.add("flip-plate__controls");
    copy.style.left = (r.left - n.left - offset) + "px";
    copy.style.top = (r.top - n.top) + "px";
    copy.style.width = r.width + "px";
    copy.style.height = r.height + "px";
    el.appendChild(copy);
  }

  function stripIds(root) {
    root.removeAttribute("id");
    root.querySelectorAll("[id]").forEach(function (x) { x.removeAttribute("id"); });
  }

  /** 판을 문서에 붙인 뒤, 복제한 장의 스크롤 위치를 원래 장과 맞춘다. */
  function mount(el) {
    note.appendChild(el);
    if (el._copy) { el._copy.scrollTop = el._scroll; }
  }

  /**
   * 종이 한 장 넘기기 — 책 오른쪽(또는 왼쪽) 반쪽 전체가 책등을 축으로 넘어간다.
   * 다음 장: 오른쪽 종이가 왼쪽으로 넘어가며, 뒷면이 새 장의 왼쪽 면이 된다.
   * 이전 장: 왼쪽 종이가 오른쪽으로 넘어가며, 뒷면이 새 장의 오른쪽 면이 된다.
   * 버튼 줄도 함께 복제한다 — 넘어가는 앞면은 넘기기 전 상태, 남는 쪽과 뒷면은 넘긴 뒤 상태.
   */
  function flipSheet(from, to, direction) {
    var next = direction === "next";
    var half = note.getBoundingClientRect().width / 2;
    var stayFace = next ? ".spread__left" : ".spread__right";
    var turnFace = next ? ".spread__right" : ".spread__left";
    var staySide = next ? "left" : "right";
    var turnSide = next ? "right" : "left";

    // 넘기기 전 모습: 그대로 남는 쪽(stay)과 넘어갈 종이의 앞면(front)
    var stay = plate(from, stayFace, staySide);
    var front = plate(from, turnFace, turnSide);
    addControls(front, turnSide);

    // 새 장을 펼치고 버튼 줄을 새 장에 맞춘 뒤, 넘어간 뒤 보일 뒷면(back)을 복제한다.
    // 뒷면은 착지할 쪽(반대쪽 반) 기준으로 만든다. 종이가 180° 넘어가면 그 자리에 정확히 놓인다
    from.hidden = true;
    to.hidden = false;
    to.classList.remove("is-flipping-out", "is-flipping-in");
    to.scrollTop = 0;
    syncUi();
    addControls(stay, staySide);
    var back = plate(to, stayFace, staySide);
    addControls(back, staySide);

    // 넘어가는 종이가 아래 면에 드리우는 그림자
    var shadow = document.createElement("div");
    shadow.className = "flip-cast flip-cast--" + direction;
    shadow.style.left = (next ? 0 : half) + "px";
    shadow.style.width = half + "px";

    var sheet = document.createElement("div");
    sheet.className = "flip-sheet flip-sheet--" + direction;
    sheet.setAttribute("aria-hidden", "true");
    sheet.style.left = (next ? half : 0) + "px";
    sheet.style.width = half + "px";
    front.classList.add("flip-sheet__front");
    back.classList.add("flip-sheet__back");
    sheet.appendChild(front);
    sheet.appendChild(back);

    mount(stay);
    note.appendChild(shadow);
    note.appendChild(sheet);
    front._copy.scrollTop = front._scroll;
    back._copy.scrollTop = 0;

    var finished = false;
    var finish = function () {
      if (finished) { return; }
      finished = true;
      busy = false;
      shadow.remove();
      // 판을 바로 걷지 않고 아주 짧게 흐려서 걷는다 — 실제 장과의 미세한 글자 렌더링 차이가 '툭' 보이지 않게
      // 남아 있던 옛 면(stay)은 착지한 종이에 이미 덮였으므로 바로 걷는다
      stay.remove();
      sheet.classList.add("is-leaving");
      setTimeout(function () { sheet.remove(); }, 200);
    };
    sheet.addEventListener("animationend", function (e) { if (e.target === sheet) { finish(); } });
    setTimeout(finish, 1100);
    revealTop();
  }

  /**
   * 연습장 머리가 화면 위로 올라가 있으면(모바일처럼 페이지째 스크롤하는 경우)
   * 새 장의 첫 줄이 보이도록 연습장 위쪽으로 돌아간다.
   */
  function revealTop() {
    if (note.getBoundingClientRect().top < 0) {
      note.scrollIntoView({ block: "start" });
    }
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
    // 글을 드래그해 선택한 경우는 넘기지 않는다
    var selection = window.getSelection && window.getSelection();
    if (selection && !selection.isCollapsed && note.contains(selection.anchorNode)) { return; }

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

  // Quick View(script/portfolio-quick.js)에서 특정 책·장을 열 때 쓴다
  window.portfolioBookshelf = {
    open: function (id, page) {
      var target = indexOfId(id);
      if (target < 0) { return false; }
      openBook(target, page || 0, { updateHash: true, focusNote: true });
      return true;
    },
    activeId: function () { return active >= 0 ? books[active].id : books[0].id; }
  };

  if (!openFromHash()) {
    openBook(0, 0);
  }
})();
