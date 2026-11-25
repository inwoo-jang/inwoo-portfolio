(function () {
  const dialog = document.getElementById("planning-docs");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const opener = document.querySelector("[data-doc-open]");
  const source = document.querySelector("[data-doc-source]");
  const pages = Array.from(source.querySelectorAll(".doc-sample"));
  if (!pages.length) return;

  const body = dialog.querySelector(".doc-viewer__body");
  const position = dialog.querySelector("[data-doc-position]");
  const previous = dialog.querySelector("[data-doc-prev]");
  const next = dialog.querySelector("[data-doc-next]");
  body.append(...pages);
  source.hidden = true;
  opener.hidden = false;

  let current = 0;
  function showPage(index) {
    current = index;
    pages.forEach((page, i) => { page.hidden = i !== index; });
    const title = pages[index].dataset.docLabel;
    position.textContent = (index + 1) + " / " + pages.length + " · " + title;
    previous.disabled = index === 0;
    next.textContent = index === pages.length - 1 ? next.dataset.doneLabel : next.dataset.nextLabel;
    body.scrollTop = 0;
  }

  function openPage(index) {
    showPage(index);
    if (!dialog.open) dialog.showModal();
  }

  function openLinkedPage() {
    const target = document.getElementById(location.hash.slice(1));
    const index = pages.indexOf(target);
    if (index >= 0) openPage(index);
  }

  opener.addEventListener("click", () => openPage(0));
  window.addEventListener("hashchange", openLinkedPage);
  openLinkedPage();
  previous.addEventListener("click", () => showPage(current - 1));
  next.addEventListener("click", () => {
    if (current === pages.length - 1) dialog.close();
    else showPage(current + 1);
  });
  dialog.querySelector("[data-doc-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (pages.includes(document.getElementById(location.hash.slice(1)))) {
      history.replaceState(history.state, "", "#flow");
      opener.focus();
    } else {
      opener.focus({ preventScroll: true });
    }
  });
})();
