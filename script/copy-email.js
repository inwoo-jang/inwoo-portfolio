(function () {
  var defaultAddress = "roseprincess0331@gmail.com";
  var toastTimer;
  var toast = document.createElement("div");
  toast.className = "email-copy-toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);

  function copyWithSelection(address) {
    var field = document.createElement("textarea");
    var previousFocus = document.activeElement;
    field.value = address;
    field.readOnly = true;
    field.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.appendChild(field);
    try {
      field.select();
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      field.remove();
      if (previousFocus) previousFocus.focus({ preventScroll: true });
    }
  }

  document.addEventListener("click", async function (event) {
    var button = event.target.closest("button[data-copy-email]");
    if (!button) return;

    var english = button.closest("[lang]")?.lang === "en";
    var address = button.dataset.copyEmail || defaultAddress;
    var copied;
    try {
      await navigator.clipboard.writeText(address);
      copied = true;
    } catch {
      copied = copyWithSelection(address);
    }

    clearTimeout(toastTimer);
    toast.lang = english ? "en" : "ko";
    toast.textContent = copied
      ? (english ? "Copied." : "복사되었습니다.")
      : (english ? "Copy failed. Please try again." : "복사하지 못했습니다. 다시 시도해 주세요.");
    toastTimer = setTimeout(function () {
      toast.textContent = "";
    }, 2500);
  });
})();
