/* ==========================================================
   script/image-en.js — 영어판 전용: 이미지 속 한글을 영어로 보여 준다
   - 문구는 script/image-text.en.js 의 window.IMAGE_TEXT_EN[이미지 경로]
   - 한글이 있는 이미지 왼쪽 위에 작은 "EN" 버튼을 단다.
     버튼에 마우스를 올리면 잠깐, 누르면 고정해서 영어 문구를 이미지 위에 띄운다.
   - 확대보기(gallery.js)에서는 캡션 아래에 같은 문구를 보여 준다.
   - 나중에 그려지는 이미지(Quick View 읽기 화면, 노트 본문)도 처리한다.
   ========================================================== */
(function () {
  if (document.documentElement.lang !== "en") { return; }
  var TEXT = window.IMAGE_TEXT_EN || {};

  function keyOf(img) {
    var src = img.getAttribute("src") || "";
    return src.replace(/^\.\//, "").split("?")[0];
  }

  /* 패널은 이미지 영역 전체를 덮는다 — 확대 버튼 안 이미지는 버튼 영역, 그 밖에는 이미지를 감싼 상자 전체 */
  function place(panel, box) {
    panel.style.top = box.offsetTop + "px";
    panel.style.left = box.offsetLeft + "px";
    panel.style.width = box.offsetWidth + "px";
    panel.style.height = box.offsetHeight + "px";
  }

  function enhance(img) {
    if (img.dataset.enDone) { return; }
    var lines = TEXT[keyOf(img)];
    if (!lines || !lines.length) { return; }
    img.dataset.enDone = "1";

    // 확대 버튼(button) 안의 이미지는 버튼 밖(figure)에 붙인다 — 버튼 안에 버튼을 넣을 수 없다
    var opener = img.closest(".project-gallery__open");
    var host = opener ? opener.parentElement : img.parentElement;
    if (!host) { return; }
    host.classList.add("img-en");

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "img-en__toggle";
    toggle.textContent = "EN";
    toggle.title = "Show the Korean text in this image in English";
    toggle.setAttribute("aria-label", "Show the text in this image in English");
    toggle.setAttribute("aria-expanded", "false");

    var panel = document.createElement("div");
    panel.className = "img-en__panel";
    panel.hidden = true;
    var head = document.createElement("p");
    head.className = "img-en__head";
    head.textContent = "Text in this image, in English";
    var ul = document.createElement("ul");
    lines.forEach(function (line) {
      var li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    panel.append(head, ul);
    var id = "img-en-" + Math.random().toString(36).slice(2, 8);
    panel.id = id;
    toggle.setAttribute("aria-controls", id);

    var pinned = false;
    function show(on) {
      if (on) { if (opener) { place(panel, opener); } else { panel.style.inset = "0"; } }
      panel.hidden = !on;
      toggle.setAttribute("aria-expanded", String(on));
      toggle.classList.toggle("is-on", on);
    }
    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      pinned = !pinned;
      show(pinned);
    });
    toggle.addEventListener("mouseenter", function () { if (!pinned) { show(true); } });
    toggle.addEventListener("mouseleave", function () { if (!pinned) { show(false); } });
    // 패널을 누르면 닫는다(카드 링크·확대보기로 넘어가지 않게)
    panel.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      pinned = false;
      show(false);
    });

    host.append(toggle, panel);
  }

  function scan(root) {
    (root.querySelectorAll ? root : document).querySelectorAll("img").forEach(enhance);
    if (root.tagName === "IMG") { enhance(root); }
  }

  scan(document);
  new MutationObserver(function (records) {
    records.forEach(function (r) {
      r.addedNodes.forEach(function (n) { if (n.nodeType === 1) { scan(n); } });
    });
  }).observe(document.body, { childList: true, subtree: true });

  // 확대보기 — 캡션 아래에 영어 문구
  var viewer = document.querySelector("dialog.image-viewer");
  if (viewer) {
    var box = document.createElement("div");
    box.className = "image-viewer__en";
    viewer.appendChild(box);
    document.addEventListener("click", function (event) {
      var opener = event.target.closest(".project-gallery__open");
      if (!opener) { return; }
      var lines = TEXT[(opener.dataset.src || "").replace(/^\.\//, "")];
      box.textContent = "";
      box.hidden = !(lines && lines.length);
      if (box.hidden) { return; }
      var h = document.createElement("p");
      h.className = "img-en__head";
      h.textContent = "Text in this image, in English";
      var ul = document.createElement("ul");
      lines.forEach(function (line) { var li = document.createElement("li"); li.textContent = line; ul.appendChild(li); });
      box.append(h, ul);
    });
  }
})();
