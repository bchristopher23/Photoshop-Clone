(function () {
  function renderIcons(root) {
    if (!window.lucide || typeof window.lucide.createIcons !== "function") return;
    var opts = { nameAttr: "data-lucide" };
    if (root && root !== document) opts.root = root;
    window.lucide.createIcons(opts);
  }

  window.renderIcons = renderIcons;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { renderIcons(); });
  } else {
    renderIcons();
  }
})();
