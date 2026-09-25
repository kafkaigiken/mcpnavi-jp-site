// Site-wide behaviour: the light/dark toggle, the header state on scroll, and closing the header menus.
// Every page works without this file. The theme itself is applied before first paint by
// templates/includes/_theme_bootstrap.html; this file only changes it when the reader asks.
(function () {
  "use strict";

  var root = document.documentElement;
  var toggles = document.querySelectorAll("[data-theme-toggle]");

  function syncToggles() {
    var isDark = root.classList.contains("dark");
    toggles.forEach(function (toggle) {
      toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    });
  }

  function setTheme(theme) {
    root.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem("theme", theme);
    } catch (error) {
      // Storage can be blocked; the choice still applies to this page.
    }
    syncToggles();
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(root.classList.contains("dark") ? "light" : "dark");
    });
    // The control stays hidden until this script is here to make it work.
    var wrapper = toggle.closest("[data-requires-js]");
    if (wrapper) {
      wrapper.hidden = false;
    }
  });
  syncToggles();

  // Header menus are <details> elements, so they open without JavaScript.
  // This closes an open menu on a click outside it or on Escape.
  function closeMenus(exceptMenu) {
    document.querySelectorAll("details[data-menu][open]").forEach(function (menu) {
      if (menu !== exceptMenu) {
        menu.open = false;
      }
    });
  }

  document.addEventListener("click", function (event) {
    closeMenus(event.target.closest("details[data-menu]"));
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    var openMenu = document.querySelector("details[data-menu][open]");
    if (openMenu) {
      openMenu.open = false;
      openMenu.querySelector("summary").focus();
    }
  });
})();
