// The search on the static site. The listing page is built once, so a search cannot run on a server:
// when the page is opened with ?q=, this reads search-index.json, keeps the services whose text holds
// the query, and prints them in the results section in place of the tags and the listing. Without
// JavaScript the page shows the whole listing.
(function () {
  var form = document.querySelector("form[data-search]");
  if (!form || form.dataset.static !== "true") return;
  var query = (new URLSearchParams(window.location.search).get("q") || "").trim();
  var input = form.querySelector("input[name=q]");
  if (input && query) input.value = query;
  var results = document.querySelector("[data-search-results]");
  if (!query || !results) return;
  var countLine = results.querySelector("[data-search-count]");
  var list = results.querySelector("[data-search-list]");

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function render(index) {
    var needle = query.toLowerCase();
    var hits = index.servers.filter(function (server) { return server.text.indexOf(needle) !== -1; });
    list.textContent = "";
    // A function replacement, so a query holding "$&" or "$1" is printed as typed.
    countLine.textContent = index.labels.count
      .replace("{query}", function () { return query; })
      .replace("{count}", function () { return String(hits.length); });
    if (hits.length === 0) {
      list.appendChild(element("p", "empty-state", index.labels.empty));
    } else {
      var grid = element("ul", "card-grid");
      hits.forEach(function (server) {
        var item = element("li");
        var link = element("a", "card card-link block h-full px-5 py-4");
        link.href = server.url;
        link.appendChild(element("span", "block font-bold text-link", server.name));
        link.appendChild(element("span", "mt-0.5 block text-xs text-muted", server.provider));
        link.appendChild(element("span", "mt-2 block text-sm leading-relaxed text-muted", server.summary));
        item.appendChild(link);
        grid.appendChild(item);
      });
      list.appendChild(grid);
    }
    results.hidden = false;
    document.querySelectorAll("[data-search-hide]").forEach(function (node) { node.hidden = true; });
  }

  fetch(form.dataset.searchIndex, { credentials: "same-origin" })
    .then(function (response) { return response.json(); })
    .then(render)
    .catch(function () { /* The listing stays as it is. */ });
})();
