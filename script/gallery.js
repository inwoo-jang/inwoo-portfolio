/* Project screenshots: captions and paths live in project-images.js. */
(function () {
  var dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-label', '프로젝트 이미지 확대보기');
  var close = document.createElement('button');
  close.type = 'button'; close.className = 'btn image-viewer__close'; close.textContent = '닫기 ×';
  var large = document.createElement('img');
  var caption = document.createElement('p'); caption.id = 'image-viewer-caption';
  dialog.setAttribute('aria-describedby', caption.id);
  dialog.append(close, large, caption); document.body.append(dialog);
  close.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  document.querySelectorAll('[data-project-gallery]').forEach(function (mount) {
    var items = (window.PROJECT_IMAGES || {})[mount.dataset.projectGallery] || [];
    items.forEach(function (item) {
      if (!item.src || !item.alt) return;
      var figure = document.createElement('figure'); figure.className = 'note__shot';
      var button = document.createElement('button'); button.type = 'button'; button.className = 'project-gallery__open';
      button.setAttribute('aria-label', item.alt + ' 확대보기');
      var img = document.createElement('img'); img.alt = item.alt; img.loading = 'eager';
      var label = document.createElement('figcaption'); label.textContent = (item.caption || item.alt) + ' · 눌러서 확대';
      img.addEventListener('error', function () { figure.remove(); mount.hidden = !mount.children.length; });
      img.src = item.src;
      button.append(img); figure.append(button, label); mount.append(figure); mount.hidden = false;
      button.addEventListener('click', function () {
        large.src = item.src; large.alt = item.alt; caption.textContent = item.caption || item.alt;
        dialog.showModal();
      });
    });
  });
})();
