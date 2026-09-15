/* ==========================================================================
   smooth.js — инерционная прокрутка в Lenis-стиле (wheel + якоря).
   Контур: цель прокрутки догоняется через rAF-lerp + window.scrollTo,
   трансформы не используются — sticky/fixed-позиционирование не ломается.
   Включается только для мыши (hover + pointer: fine); тачпад/тачскрин,
   клавиатура и скролл от фокуса идут нативно и подхватываются как новая цель.
   При prefers-reduced-motion — полный выход (остаётся нативный CSS-smooth).
   CSP: только addEventListener, инлайн-обработчиков нет.
   Порядок подключения — после burger.js (якоря меню сначала снимают лок).
   ========================================================================== */

(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  var EASE = 0.12; /* lerp-фактор: меньше — мягче (и дольше догоняет) */
  var LINE_PX = 16; /* нормализация deltaMode: 1 единица = 16px */

  var root = document.documentElement;
  var target = window.scrollY;
  var current = target;
  var raf = null;

  /* Нативный CSS-smooth конфликтовал бы с покадровым scrollTo
     (браузер сглаживал бы каждый промежуточный вызов) — якоря и totop
     анимируются этим же контуром / явным behavior:'smooth'. */
  root.style.scrollBehavior = "auto";

  function maxScroll() {
    return Math.max(0, root.scrollHeight - window.innerHeight);
  }

  function clampTarget() {
    target = Math.max(0, Math.min(maxScroll(), target));
  }

  function frame() {
    current += (target - current) * EASE;
    if (Math.abs(target - current) < 0.5) {
      window.scrollTo(0, target);
      current = target;
      raf = null;
      return;
    }
    window.scrollTo(0, Math.round(current));
    raf = requestAnimationFrame(frame);
  }

  function kick() {
    clampTarget();
    if (raf === null) {
      raf = requestAnimationFrame(frame);
    }
  }

  function normalize(delta, mode) {
    if (mode === 1) {
      return delta * LINE_PX;
    }
    if (mode === 2) {
      return delta * window.innerHeight;
    }
    return delta;
  }

  window.addEventListener("wheel", function (event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return; /* зум и системные жесты — нативно */
    }
    if (event.target instanceof Element && event.target.closest("[data-scroll-native]")) {
      return; /* вложенные скролл-контейнеры — нативно */
    }
    event.preventDefault();
    /* Синхронизация, если позицию сменили извне между кадрами */
    current = window.scrollY;
    target = current + normalize(event.deltaY, event.deltaMode);
    kick();
  }, { passive: false });

  /* Якоря — тем же контуром (без прыжка и смены истории) */
  document.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) {
      return;
    }
    var link = event.target.closest('a[href^="#"]');
    if (!link) {
      return;
    }
    var id = link.getAttribute("href").slice(1);
    if (!id) {
      return;
    }
    var anchor = document.getElementById(id);
    if (!anchor) {
      return;
    }
    event.preventDefault();
    current = window.scrollY;
    target = anchor.getBoundingClientRect().top + current;
    kick();
  });

  /* Нативный скролл (клавиатура, фокус, тач, resize, totop-анимация):
     пока наш цикл спит — перенимаем позицию как новую цель. */
  function adopt() {
    if (raf === null) {
      target = window.scrollY;
      current = target;
    }
  }

  window.addEventListener("scroll", adopt, { passive: true });
  window.addEventListener("resize", function () {
    clampTarget();
    adopt();
  });
})();
