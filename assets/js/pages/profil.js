// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Counter animation
      const counters = entry.target.querySelectorAll("[data-count]");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-count"));
        animateCounter(counter, target);
      });

      // Fade up animation
      const fadeElements = entry.target.querySelectorAll(".animate-fade-up");
      fadeElements.forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, index * 100);
      });
    }
  });
}, observerOptions);

// Observe sections
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => observer.observe(section));

  // Initialize fade up elements
  const fadeElements = document.querySelectorAll(".animate-fade-up");
  fadeElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease-out";
  });

  // Smooth scrolling for internal links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }

    lastScrollTop = scrollTop;
  });
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
