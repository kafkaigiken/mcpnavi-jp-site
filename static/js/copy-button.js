// Copy control for the config block on a server detail page.
// One delegated listener, no dependencies: the page stays server-rendered and
// works without this file, which only saves the reader a manual selection.
(function () {
  "use strict";

  function feedback(button, message) {
    button.textContent = message;
    window.clearTimeout(button.resetTimer);
    button.resetTimer = window.setTimeout(function () {
      button.textContent = button.dataset.copyIdle;
    }, 2000);
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-copy-target]");
    if (!button) {
      return;
    }
    var source = document.getElementById(button.dataset.copyTarget);
    if (!source || !navigator.clipboard) {
      feedback(button, button.dataset.copyFailed);
      return;
    }
    navigator.clipboard.writeText(source.innerText).then(
      function () {
        feedback(button, button.dataset.copyDone);
      },
      function () {
        feedback(button, button.dataset.copyFailed);
      }
    );
  });
})();
