/* Project screenshots: captions and paths live in project-images.js.
   클릭은 문서 전체에서 위임 처리한다 — Quick View 읽기 화면이 연습장 본문을
   복제해 보여줘도 확대보기가 똑같이 동작하도록. */
(function () {
  var dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  var EN = document.documentElement.lang === 'en';
  dialog.setAttribute('aria-label', EN ? 'Enlarged project image' : '프로젝트 이미지 확대보기');
  var close = document.createElement('button');
  close.type = 'button'; close.className = 'btn image-viewer__close'; close.textContent = EN ? 'Close ×' : '닫기 ×';
  var large = document.createElement('img');
  var caption = document.createElement('p'); caption.id = 'image-viewer-caption';
  dialog.setAttribute('aria-describedby', caption.id);
  dialog.append(close, large, caption); document.body.append(dialog);
  close.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.project-gallery__open');
    if (!button || !button.dataset.src) return;
    large.src = button.dataset.src; large.alt = button.dataset.alt || '';
    caption.textContent = button.dataset.caption || button.dataset.alt || '';
    dialog.showModal();
  });

  document.querySelectorAll('[data-project-gallery]').forEach(function (mount) {
    var items = (window.PROJECT_IMAGES || {})[mount.dataset.projectGallery] || [];
    items.forEach(function (item) {
      if (!item.src || !item.alt) return;
      var figure = document.createElement('figure'); figure.className = 'note__shot';
      var button = document.createElement('button'); button.type = 'button'; button.className = 'project-gallery__open';
      button.setAttribute('aria-label', item.alt + (EN ? ' — enlarge' : ' 확대보기'));
      button.dataset.src = item.src; button.dataset.alt = item.alt; button.dataset.caption = item.caption || item.alt;
      var img = document.createElement('img'); img.alt = item.alt; img.loading = 'eager';
      var label = document.createElement('figcaption'); label.textContent = item.caption || item.alt;
      img.addEventListener('error', function () { figure.remove(); mount.hidden = !mount.children.length; });
      img.src = item.src;
      button.append(img); figure.append(button, label); mount.append(figure); mount.hidden = false;
    });
  });
})();
