// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  const scrollTop = document.querySelector(".scroll-top");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
    scrollTop.classList.add("visible");
  } else {
    navbar.classList.remove("scrolled");
    scrollTop.classList.remove("visible");
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }
  });
});

// Counter animation (hanya berjalan sekali)
let countersAnimated = false;
function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    let count = 0;
    const increment = Math.max(1, Math.ceil(target / 200));
    function updateCounter() {
      count += increment;
      if (count < target) {
        counter.innerText = count;
        setTimeout(updateCounter, 10);
      } else {
        counter.innerText = target;
      }
    }
    updateCounter();
  });
}

// Intersection Observer for counter animation
const observerOptions = { threshold: 0.7 };
const statsSection = document.querySelector(".stats");
if (statsSection) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  observer.observe(statsSection);
}

// Scroll to top function
window.scrollToTop = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Add loading animation
window.addEventListener("load", function () {
  document.body.style.opacity = "1";
});

// Mobile menu close on link click
document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  });
});

// Parallax effect hanya background hero, bukan seluruh section
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.backgroundPosition = `center ${scrolled * 0.3}px`;
  }
});
