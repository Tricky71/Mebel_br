/* ==========================================================================
   callback.js — floating-виджет обратного звонка (ui-callback).
   Контракт: docs/specs/structure.md C16. CSP: только addEventListener,
   инлайн-обработчиков нет. Хуки: data-callback / data-callback-toggle /
   data-callback-popup / data-callback-close / data-callback-field.
   Видимость попапа — .is-open на корне + hidden-атрибут (см. callback.css).
   ========================================================================== */

(function () {
  "use strict";

  var widget = document.querySelector("[data-callback]");
  if (!widget) {
    return;
  }

  var toggle = widget.querySelector("[data-callback-toggle]");
  var popup = widget.querySelector("[data-callback-popup]");
  var closeButton = widget.querySelector("[data-callback-close]");
  var field = widget.querySelector("[data-callback-field]");

  if (!toggle || !popup || !closeButton) {
    return;
  }

  function isOpen() {
    return widget.classList.contains("is-open");
  }

  function open() {
    widget.classList.add("is-open");
    popup.removeAttribute("hidden");
    toggle.setAttribute("aria-expanded", "true");
    if (field) {
      field.focus();
    }
  }

  function close(returnFocus) {
    widget.classList.remove("is-open");
    popup.setAttribute("hidden", "");
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener("click", function () {
    if (isOpen()) {
      close(false);
    } else {
      open();
    }
  });

  closeButton.addEventListener("click", function () {
    close(true);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      close(true);
    }
  });
})();
