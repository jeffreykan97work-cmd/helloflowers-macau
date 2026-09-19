/* Hello Flowers Macau — V1 編輯風 · 進場動效（無依賴）
   原則：① 冇 JS 都一定睇到內容（class 只在 html.hf-js 下隱藏）
        ② 任何一部分入到視窗就 reveal（threshold 0.01），唔會出現「明明睇到但隱形」
        ③ 有 2.5s 安全網，避免任何情況漏 reveal */
(function () {
  /* 底部 CTA bar：手機捲過首屏先出現（避免同 hero CTA 打對台） */
  (function barBehaviour() {
    var bar = document.querySelector('body > div.fixed');
    if (!bar) return;
    var onScroll = function () {
      if (window.innerWidth >= 1024) { bar.classList.remove('hf-bar-hidden'); return; }
      bar.classList.toggle('hf-bar-hidden', window.scrollY < 360);
    };
    bar.classList.add('hf-bar-hidden');
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  })();

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('hf-js');

  function collect() {
    var out = [];
    var add = function (sel, stagger) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        if (out.indexOf(el) >= 0) return;
        el.classList.add('hf-rv');
        el.dataset.hfDelay = String((i % 3) * (stagger || 70));
        out.push(el);
      });
    };
    add('main .card', 70);
    add('main > section', 0);
    add('main > div.hf-hero', 0);
    add('main .hf-meta', 0);
    add('main section.hf-occ > div', 40);
    add('footer p.font-serif', 0);
    return out;
  }

  var items = collect();
  if (!items.length) return;

  function reveal(el) {
    el.classList.add('hf-in');
    if (io) io.unobserve(el);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var d = parseInt(el.dataset.hfDelay || '0', 10);
      el.style.transitionDelay = d ? d + 'ms' : '';
      reveal(el);
    });
  }, { rootMargin: '0px', threshold: 0.01 });

  items.forEach(function (el) { io.observe(el); });

  /* 首屏即刻顯示 */
  requestAnimationFrame(function () {
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
        el.style.transitionDelay = '';
        reveal(el);
      }
    });
  });

  /* 安全網：載入 2.5s 後，凡係已經入到視窗嘅一律顯示 */
  setTimeout(function () {
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
    });
  }, 2500);
})();
