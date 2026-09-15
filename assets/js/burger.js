/* ==========================================================================
   burger.js — мобильное меню первого экрана (<1200px).
   Контракт: docs/specs/header.md §7 + §5.1. CSP: только addEventListener,
   инлайн-обработчиков нет. Хуки: data-header / data-burger / data-nav.
   ========================================================================== */

(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var burger = document.querySelector("[data-burger]");
  var nav = document.querySelector("[data-nav]");
  var label = document.querySelector("[data-burger-label]");

  if (!header || !burger || !nav) {
    return;
  }

  var TEXT_OPEN = "Открыть меню";
  var TEXT_CLOSE = "Закрыть меню";
  var firstLink = null;

  function isOpen() {
    return header.classList.contains("is-open");
  }

  function open() {
    header.classList.add("is-open");
    nav.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
    if (label) {
      label.textContent = TEXT_CLOSE;
    }
    firstLink = nav.querySelector("a");
    if (firstLink) {
      firstLink.focus();
    }
  }

  function close(returnFocus) {
    header.classList.remove("is-open");
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    if (label) {
      label.textContent = TEXT_OPEN;
    }
    if (returnFocus) {
      burger.focus();
    }
  }

  burger.addEventListener("click", function () {
    if (isOpen()) {
      close(false);
    } else {
      open();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      close(true);
    }
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a") && isOpen()) {
      close(false);
    }
  });
})();
