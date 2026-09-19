/* Hello Flowers Macau — V2 行為層（無依賴、無 JS 都睇得到內容）
   1) 頂部服務條可關閉（記住選擇）
   2) FAQ accordion（<details> 本身已可用，只加「同時只開一個」）
*/
(function () {
  'use strict';

  /* ---------- 1. 服務條 ---------- */
  var ann = document.getElementById('hf-ann');
  if (ann) {
    var KEY = 'hf_ann_off_v1';
    var off = false;
    try { off = localStorage.getItem(KEY) === '1'; } catch (e) { off = false; }
    if (off) {
      ann.classList.add('is-off');
    }
    var x = ann.querySelector('.hf-ann-x');
    if (x) {
      x.addEventListener('click', function () {
        ann.classList.add('is-off');
        try { localStorage.setItem(KEY, '1'); } catch (e) {}
      });
    }
  }

  /* ---------- 2. FAQ：一次只開一個 ---------- */
  var faq = document.querySelector('.hf-faq');
  if (faq) {
    var items = faq.querySelectorAll('details');
    Array.prototype.forEach.call(items, function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        Array.prototype.forEach.call(items, function (o) { if (o !== d) o.open = false; });
      });
    });
  }
})();
