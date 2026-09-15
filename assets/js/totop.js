/* ==========================================================================
   totop.js — кнопка «наверх» (.ui-callback__totop).
   Показывается после скролла 600px (.is-visible), клик плавно мотает
   страницу вверх. CSP: только addEventListener, инлайн-обработчиков нет.
   Хуки: data-totop. Уважает prefers-reduced-motion.
   ========================================================================== */

(function () {
  "use strict";

  var SHOW_AFTER = 600;

  var button = document.querySelector("[data-totop]");
  if (!button) {
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function update() {
    if (window.scrollY > SHOW_AFTER) {
      button.classList.add("is-visible");
    } else {
      button.classList.remove("is-visible");
    }
  }

  button.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "auto" : "smooth"
    });
  });

  document.addEventListener("scroll", update, { passive: true });
  update();
})();
