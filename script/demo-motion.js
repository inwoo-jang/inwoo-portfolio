/* 대표 프로젝트 데모 창.
   - 홈 카드의 [data-demo-open]을 눌렀을 때만 창을 열고 처음부터 한 번 재생한다(반복 없음).
   - 주문·인증서는 문제 → 사용자 → 이해관계자 → 해결 → 결과, 광고는 복합 광고 → OCR → VLM 관계 분석 → 인용 검증 → 게시 점검.
   - 진행바의 구간 버튼으로 장면을 선택한다. 장면 종료 시각은 .dm의 data-cuts. */
(function () {
  var dialog = document.querySelector('.demo-dialog');
  if (!dialog) return;
  var EN = document.documentElement.lang === 'en';
  var L = EN
    ? { play: 'Play', replay: 'Replay', pause: 'Pause', resume: 'Resume' }
    : { play: '재생', replay: '다시 보기', pause: '정지', resume: '이어서 재생' };
  var ICON_PLAY = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z"/></svg>';

  function box(i) { return i * 124; }
  /* 움직이는 카드의 장면별 상태(장면 1~5). 보일 장면은 각 요소의 data-in에 적는다.
     x·y는 카드 무대(620×440) 좌표(px). 고정 카드는 마크업의 --x·--y를 그대로 쓴다. */
  var MOVES = {
    order: {
      '.om-box': function (i) {
        var out = i < 3, line = { x: box(i), y: 150 };
        return [line, line, line, line, { x: out ? box(i) - 8 : box(i) + 56, y: 150, hot: out }];
      }
    },
    cert: {
      '.pl-card': function (i) {
        var row = { x: i * 158, y: 110 };
        var stack = i < 3 ? { x: 24 + i * 26, y: 110 + i * 16, z: -i * 40, hot: i === 0, stack: true } : row;
        return [row, row, row, stack, stack];
      }
    },
    vlm: {
      '[data-c="ad"]': [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
      '.ad-hl': [{ off: true }, {}, {}, { off: true }, { off: true }]
    }
  };

  var current = null;

  function setup(section) {
    if (section._dm) return section._dm;
    var view = section.querySelector('.dm__view');
    var stage = section.querySelector('.dm');
    var moves = MOVES[section.dataset.demo] || {};
    var cuts = stage.dataset.cuts.split(',').map(Number), total = cuts[cuts.length - 1];
    var btn = section.querySelector('.dm__btn');
    var replay = section.querySelector('[data-replay]');
    var bar = section.querySelector('.dm__progress');
    var time = section.querySelector('.dm__time');
    stage.style.setProperty('--dur', total + 's');

    var start = 0, segs = [];
    bar.style.gridTemplateColumns = cuts.map(function (end) { var w = end - start; start = end; return w + 'fr'; }).join(' ');
    cuts.forEach(function (end, i) {
      var s = document.createElement('button');
      var label = stage.querySelector('.dm__eyebrow[data-s="' + (i + 1) + '"]');
      var name = label ? label.firstChild.textContent.trim() : String(i + 1);
      s.type = 'button'; s.className = 'dm__seg';
      s.setAttribute('aria-label', name + (EN ? ' · Jump to scene' : ' · 장면으로 이동'));
      s.title = name;
      s.appendChild(document.createElement('i')); bar.appendChild(s); segs.push(s.firstChild);
      s.addEventListener('click', function () { seek(i); });
    });
    bar.removeAttribute('aria-hidden');
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', EN ? 'Demo chapters' : '데모 장면 선택');

    // 요소별 장면 상태: 움직이는 카드(MOVES)와 보일 장면(data-in)
    var tracks = [];
    stage.querySelectorAll('.dm__rig > *').forEach(function (el) {
      tracks.push({ el: el, states: null, i: 0, show: el.dataset.in ? el.dataset.in.split(' ').map(Number) : null });
    });
    Object.keys(moves).forEach(function (sel) {
      stage.querySelectorAll(sel).forEach(function (el, i) {
        var spec = moves[sel], t = tracks.find(function (x) { return x.el === el; });
        if (!t) { t = { el: el, show: null }; tracks.push(t); }
        t.states = typeof spec === 'function' ? spec(i) : spec; t.i = i;
      });
    });

    function fit() {
      var w = view.clientWidth;
      var tall = w < 600;
      view.classList.toggle('is-tall', tall);
      stage.style.setProperty('--k', w / (tall ? 720 : 1280));
    }
    new ResizeObserver(fit).observe(view);
    fit();

    var elapsed = 0, playing = false, last = 0, timer = 0, shown = -1;
    function sceneAt(t) {
      if (t < 0.12) return 0;
      for (var i = 0; i < cuts.length; i++) { if (t < cuts[i]) return i + 1; }
      return cuts.length;
    }
    function apply(scene) {
      if (scene === shown) return;
      shown = scene;
      stage.dataset.scene = String(scene);
      stage.querySelectorAll('[data-s]').forEach(function (el) {
        el.classList.toggle('is-current', el.dataset.s.split(' ').indexOf(String(scene)) >= 0);
      });
      stage.querySelectorAll('[data-step]').forEach(function (el) {
        var step = Number(el.dataset.step);
        el.classList.toggle('is-current', step === scene);
        el.classList.toggle('is-complete', step < scene);
      });
      var n = Math.max(1, scene);
      tracks.forEach(function (t) {
        var s = (t.states && t.states[Math.min(n, t.states.length) - 1]) || {};
        var st = t.el.style;
        if ('x' in s) st.setProperty('--x', s.x + 'px');
        if ('y' in s) st.setProperty('--y', s.y + 'px');
        if (t.states) { st.setProperty('--z', (s.z || 0) + 'px'); st.setProperty('--i', t.i); }
        t.el.classList.toggle('is-off', !!s.off || (!!t.show && t.show.indexOf(n) < 0));
        if (!t.states) return; // 고정 카드는 마크업의 강조 상태를 그대로 둔다
        t.el.classList.toggle('is-hot', !!s.hot);
        t.el.classList.toggle('is-dim', !!s.dim);
        t.el.classList.toggle('is-stacked', !!s.stack);
      });
    }
    function paint() {
      apply(sceneAt(elapsed));
      var s = 0;
      cuts.forEach(function (end, i) {
        segs[i].style.width = (Math.min(1, Math.max(0, (elapsed - s) / (end - s))) * 100) + '%';
        if (i + 1 === shown) segs[i].parentElement.setAttribute('aria-current', 'step');
        else segs[i].parentElement.removeAttribute('aria-current');
        s = end;
      });
      time.textContent = '0:' + String(Math.floor(Math.min(elapsed, total))).padStart(2, '0') + ' / 0:' + String(total).padStart(2, '0');
    }
    function setBtn(state) {
      btn.innerHTML = (state === 'pause' ? ICON_PAUSE : ICON_PLAY) + (state === 'pause' ? L.pause : state === 'resume' ? L.resume : L.replay);
    }
    function tick() {
      var now = performance.now();
      elapsed += (now - last) / 1000; last = now;
      if (elapsed >= total) { elapsed = total; stop(); paint(); setBtn('end'); return; }
      paint();
    }
    function stop() { playing = false; clearInterval(timer); stage.classList.add('is-paused'); }
    function play() {
      if (playing) return;
      if (elapsed >= total) { restart(); return; }
      playing = true; last = performance.now(); stage.classList.remove('is-paused'); stage.classList.add('is-playing');
      setBtn('pause'); timer = setInterval(tick, 80);
    }
    function restart() {
      stop(); elapsed = 0; shown = -1;
      stage.classList.remove('is-playing'); void stage.offsetWidth; // 카메라 애니메이션을 처음부터
      paint();
      play();
    }
    function seek(index) {
      elapsed = index === 0 ? 0.12 : cuts[index - 1];
      last = performance.now();
      // 같은 재생 시각으로 카메라를 옮겨, 이전 장면의 카메라가 이어지지 않게 한다.
      stage.querySelector('.dm__rig').getAnimations().forEach(function (animation) {
        if (animation.animationName && animation.animationName.indexOf('dm-dolly') === 0) animation.currentTime = elapsed * 1000;
      });
      paint();
      // 일시정지 중 장면을 고르면 새 패널의 세부 정보도 바로 읽을 수 있게 한다.
      if (!playing) stage.querySelectorAll('.ad-panel li').forEach(function (el) {
        el.getAnimations().forEach(function (animation) { if (animation.animationName === 'ad-detail-in') animation.finish(); });
      });
      setBtn(playing ? 'pause' : 'resume');
    }
    btn.addEventListener('click', function () { if (playing) { tick(); stop(); setBtn(elapsed >= total ? 'end' : 'resume'); } else { play(); } });
    if (replay) replay.addEventListener('click', restart);
    section._dm = { restart: restart, stop: function () { stop(); setBtn('resume'); }, fit: fit };
    return section._dm;
  }

  document.addEventListener('visibilitychange', function () { if (document.hidden && current) current.stop(); });

  var title = dialog.querySelector('.demo-dialog__title');
  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-demo-open]');
    if (!opener) return;
    event.preventDefault();
    if (current) current.stop();
    dialog.querySelectorAll('.demo-scene').forEach(function (s) { s.hidden = s.dataset.demo !== opener.dataset.demoOpen; });
    var section = dialog.querySelector('.demo-scene[data-demo="' + opener.dataset.demoOpen + '"]');
    title.textContent = section.dataset.title;
    dialog.showModal();
    dialog.focus(); // 닫기 버튼에 자동 포커스 테두리가 뜨지 않게 창 자체에 포커스
    current = setup(section);
    current.fit();
    current.restart();
  });
  dialog.querySelector('.demo-dialog__close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () { if (current) current.stop(); });
})();
