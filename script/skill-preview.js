(function () {
  const dialog = document.querySelector(".skill-preview");
  if (!dialog || typeof dialog.showModal !== "function") return;
  const body = dialog.querySelector("[data-skill-body]");
  const title = dialog.querySelector("strong");
  const english = document.documentElement.lang === "en";
  let opener;
  let request;

  async function showSpec(link, signal) {
    body.textContent = english ? "Loading specification…" : "기능 명세서를 불러오는 중…";
    try {
      const response = await fetch(link.href, { signal });
      if (!response.ok) throw new Error("Missing source document");
      const doc = new DOMParser().parseFromString(await response.text(), "text/html");
      const spec = doc.getElementById("functional-spec");
      if (!spec) throw new Error("Missing specification");
      if (!signal.aborted) body.replaceChildren(spec);
    } catch (error) {
      if (signal.aborted) return;
      const fallback = link.cloneNode(false);
      fallback.removeAttribute("aria-haspopup");
      fallback.textContent = english ? "Open the specification in a new tab" : "새 탭에서 기능 명세서 보기";
      fallback.target = "_blank";
      fallback.rel = "noopener";
      body.replaceChildren(fallback);
    }
  }

  function showPage(link) {
    const frame = document.createElement("iframe");
    frame.title = link.textContent.trim();
    frame.src = link.href;
    body.replaceChildren(frame);
  }

  const evidenceLinks = document.querySelectorAll(
    'main a[href*="#p-"], main a[href*="#n-"], main a[href$="#functional-spec"]'
  );
  evidenceLinks.forEach(link => {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      title.textContent = link.textContent.trim();
      dialog.showModal();
      if (link.hash === "#functional-spec") {
        request = new AbortController();
        showSpec(link, request.signal);
      } else {
        showPage(link);
      }
    });
  });
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (request) request.abort();
    body.replaceChildren();
    opener.focus({ preventScroll: true });
  });
})();
