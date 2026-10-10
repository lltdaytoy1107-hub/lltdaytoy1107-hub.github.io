(function () {
  if (new URLSearchParams(window.location.search).has("embed")) document.body.classList.add("embed-mode");
  const tabs = document.querySelectorAll("[data-service-tab]");
  const panels = document.querySelectorAll("[data-service-panel]");
  tabs.forEach((tab, index) => tab.addEventListener("click", () => {
    tabs.forEach((item) => { const active = item === tab; item.classList.toggle("active", active); item.setAttribute("aria-selected", String(active)); });
    panels.forEach((panel) => { const active = panel.dataset.servicePanel === tab.dataset.serviceTab; panel.classList.toggle("active", active); panel.hidden = !active; });
    tab.focus();
  }));
  tabs.forEach((tab, index) => tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
    tabs[next].click();
  }));

  const filters = document.querySelectorAll("[data-feed-filter]");
  const cards = document.querySelectorAll("[data-feed-category]");
  filters.forEach((filter) => filter.addEventListener("click", () => {
    filters.forEach((item) => { const active = item === filter; item.classList.toggle("active", active); item.setAttribute("aria-pressed", String(active)); });
    cards.forEach((card) => { card.hidden = filter.dataset.feedFilter !== "all" && !card.dataset.feedCategory.split(" ").includes(filter.dataset.feedFilter); });
  }));
})();
