(() => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const search = document.getElementById("programSearch");
  const cards = [...document.querySelectorAll(".program-card")];
  const filters = [...document.querySelectorAll(".filter-btn")];
  const emptyState = document.getElementById("emptyState");

  function setTheme(dark) {
    body.classList.toggle("dark", dark);
    themeToggle.textContent = dark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem("web-practical-theme", dark ? "dark" : "light"); } catch (_) {}
  }

  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("web-practical-theme") || "light"; } catch (_) {}
  setTheme(savedTheme === "dark");

  themeToggle.addEventListener("click", () => setTheme(!body.classList.contains("dark")));

  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  let activeFilter = "all";

  function updateCards() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesSearch = !query || card.dataset.search.includes(query) || card.textContent.toLowerCase().includes(query);
      const show = matchesFilter && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    emptyState.hidden = visible !== 0;
  }

  filters.forEach(button => {
    button.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter;
      updateCards();
    });
  });

  search.addEventListener("input", updateCards);

  // Animated statistics
  const counters = document.querySelectorAll("[data-count]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCounter(el) {
    const target = Number(el.dataset.count);
    if (reduced) { el.textContent = target; return; }
    const duration = 900;
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    document.querySelector(".stats") && observer.observe(document.querySelector(".stats"));
  } else {
    counters.forEach(animateCounter);
  }
})();
