const staggerGroups = document.querySelectorAll(
  ".hero-grid, .about-list, .skills-board, .project-grid, .certificate-grid, .certificate-list, .hero-links, .contact-actions"
);
const parallaxItems = document.querySelectorAll(".hero-copy, .hero-card, .portrait-ring");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

staggerGroups.forEach((group) => {
  group.classList.add("reveal", "stagger-ready");
});

const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const counters = document.querySelectorAll(".metric-value");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const setActiveNavLink = (id) => {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isMatch);
  });
};

const updateActiveSection = () => {
  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 0;
  const scrollReference = window.scrollY + headerHeight + 140;
  let activeId = sections[0]?.getAttribute("id") || "home";

  sections.forEach((section) => {
    if (scrollReference >= section.offsetTop) {
      activeId = section.getAttribute("id");
    }
  });

  setActiveNavLink(activeId);
};

updateActiveSection();
window.addEventListener("scroll", updateActiveSection, { passive: true });
window.addEventListener("resize", updateActiveSection);
window.addEventListener("load", updateActiveSection);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const matches = filter === "all" || category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

const animateCounter = (element) => {
  const rawTarget = Number(element.dataset.target);
  const suffix = element.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  const step = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    const currentValue = rawTarget * progress;

    if (rawTarget % 1 !== 0) {
      element.textContent = `${currentValue.toFixed(2)}${suffix}`;
    } else {
      element.textContent = `${Math.round(currentValue).toLocaleString("en-IN")}${suffix}`;
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const updateParallax = () => {
  if (prefersReducedMotion.matches) return;

  const scrollY = window.scrollY;

  parallaxItems.forEach((item, index) => {
    const speed = (index + 1) * 0.018;
    const y = Math.min(scrollY * speed, 28);
    item.style.setProperty("--parallax-y", `${y}px`);
  });
};

updateParallax();
window.addEventListener("scroll", updateParallax, { passive: true });
