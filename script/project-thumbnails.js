/* Profile 썸네일은 Portfolio Quick View와 같은 PROJECTS의 이미지 정보를 사용한다. */
(function () {
  var projects = window.PROJECTS || [];
  var mounts = document.querySelectorAll("[data-project-thumbnail]");

  mounts.forEach(function (mount) {
    var id = mount.getAttribute("data-project-thumbnail");
    var project = projects.find(function (item) { return item.id === id; });
    if (!project) { return; }

    function showText() {
      mount.textContent = "";
      mount.classList.add("mini__thumb--text");
      var metric = !project.headline && project.metrics && project.metrics[0];
      var label = document.createElement("strong");
      label.textContent = project.headline || (metric && metric.value) || project.title;
      mount.appendChild(label);
    }

    if (!project.image) { showText(); return; }
    var image = document.createElement("img");
    image.alt = project.imageAlt || project.title;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", showText, { once: true });
    mount.textContent = "";
    mount.classList.remove("mini__thumb--text");
    mount.appendChild(image);
    image.src = project.image;
  });
})();
