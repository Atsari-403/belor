const DesaBelor = {
  config: {
    animationDuration: 300,
    scrollOffset: 90,
    lazyLoadOffset: 50,
    typingSpeed: 50,
  },

  // State management
  state: {
    isLoaded: false,
    isMobile: window.innerWidth < 1024,
    scrollY: 0,
    activeSection: "hero",
  },

  // Utility functions
  utils: {},

  // Component modules
  components: {},

  // Page modules
  pages: {},

  // Initialize application
  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.handlePageLoad();
    console.log("🌾 Desa Belor website initialized");
  },
};

DesaBelor.utils = {
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -offset &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) +
          offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Smooth scroll to element
   */
  scrollToElement(element, offset = DesaBelor.config.scrollOffset) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }

    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  },

  /**
   * Format number with animation
   */
  animateNumber(element, start, end, duration = 2000) {
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  },

  /**
   * Show loading spinner
   */
  showLoading(container) {
    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    if (container) {
      container.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Memuat...</p>
                </div>
            `;
    }
  },

  /**
   * Format date to Indonesian format
   */
  formatDate(dateString) {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  },

  /**
   * Truncate text with ellipsis
   */
  truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  },

  /**
   * Create element with attributes
   */
  createElement(tag, attributes = {}, content = "") {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "innerHTML") {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    if (content) {
      element.textContent = content;
    }

    return element;
  },
};

// ======================
// CORE FUNCTIONALITY
// ======================

/**
 * Setup global event listeners
 */
DesaBelor.setupEventListeners = function () {
  // Window events
  window.addEventListener(
    "scroll",
    this.utils.throttle(this.handleScroll.bind(this), 16)
  );
  window.addEventListener(
    "resize",
    this.utils.debounce(this.handleResize.bind(this), 250)
  );
  window.addEventListener("load", this.handlePageLoad.bind(this));

  // Navigation events
  document.addEventListener("click", this.handleNavigation.bind(this));

  // Form events
  document.addEventListener("submit", this.handleFormSubmit.bind(this));

  // Keyboard events
  document.addEventListener("keydown", this.handleKeyboard.bind(this));
};

/**
 * Handle scroll events
 */
DesaBelor.handleScroll = function () {
  const scrollY = window.pageYOffset;
  this.state.scrollY = scrollY;

  // Update navbar appearance
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Lazy load images
  this.lazyLoadImages();

  // Animate elements on scroll
  this.animateOnScroll();

  // Update active section
  this.updateActiveSection();
};

/**
 * Handle window resize
 */
DesaBelor.handleResize = function () {
  this.state.isMobile = window.innerWidth < 1024;

  // Close mobile menu on resize to desktop
  if (!this.state.isMobile) {
    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");

    if (navMenu && navToggle) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  }
};

/**
 * Handle page load
 */
DesaBelor.handlePageLoad = function () {
  this.state.isLoaded = true;
  document.body.classList.add("loaded");

  // Initialize lazy loading
  this.initLazyLoading();

  // Start number animations
  this.initNumberAnimations();

  // Initialize tooltips
  this.initTooltips();
};

/**
 * Handle navigation clicks
 */
DesaBelor.handleNavigation = function (e) {
  const target = e.target.closest('a[href^="#"]:not([href="#"])');

  if (target) {
    e.preventDefault();
    const targetId = target.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      this.utils.scrollToElement(targetElement);

      // Close mobile menu if open
      const navMenu = document.getElementById("nav-menu");
      const navToggle = document.getElementById("nav-toggle");

      if (navMenu && navToggle && this.state.isMobile) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    }
  }
};

/**
 * Handle form submissions
 */
DesaBelor.handleFormSubmit = function (e) {
  const form = e.target;

  if (form.tagName === "FORM") {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData);

    // Basic validation
    if (this.validateForm(form)) {
      this.submitForm(form, formObject);
    }
  }
};

/**
 * Handle keyboard events
 */
DesaBelor.handleKeyboard = function (e) {
  // ESC key to close modals
  if (e.key === "Escape") {
    const openModal = document.querySelector(".modal.active");
    if (openModal) {
      this.closeModal(openModal);
    }
  }
};

// ======================
// COMPONENT INITIALIZATION
// ======================

/**
 * Initialize all components
 */
DesaBelor.initializeComponents = function () {
  // Initialize navigation
  if (typeof this.components.navbar !== "undefined") {
    this.components.navbar.init();
  }

  // Initialize carousel
  if (typeof this.components.carousel !== "undefined") {
    this.components.carousel.init();
  }

  // Initialize modals
  if (typeof this.components.modal !== "undefined") {
    this.components.modal.init();
  }
};

// ======================
// LAZY LOADING
// ======================

/**
 * Initialize lazy loading for images
 */
DesaBelor.initLazyLoading = function () {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: `${this.config.lazyLoadOffset}px`,
      }
    );

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.remove("lazy");
    });
  }
};

/**
 * Lazy load images on scroll (fallback)
 */
DesaBelor.lazyLoadImages = function () {
  const images = document.querySelectorAll("img[data-src]");

  images.forEach((img) => {
    if (this.utils.isInViewport(img, this.config.lazyLoadOffset)) {
      img.src = img.dataset.src;
      img.classList.remove("lazy");
      img.removeAttribute("data-src");
    }
  });
};

// ======================
// ANIMATIONS
// ======================

/**
 * Animate elements when they come into view
 */
DesaBelor.animateOnScroll = function () {
  const elements = document.querySelectorAll(".animate-on-scroll");

  elements.forEach((element) => {
    if (this.utils.isInViewport(element, 100)) {
      element.classList.add("animate-fade-in");
      element.classList.remove("animate-on-scroll");
    }
  });
};

/**
 * Initialize number counting animations
 */
DesaBelor.initNumberAnimations = function () {
  const numberElements = document.querySelectorAll("[data-target]");

  numberElements.forEach((element) => {
    if (this.utils.isInViewport(element, 200)) {
      const target = parseInt(element.getAttribute("data-target"));
      this.utils.animateNumber(element, 0, target);
      element.removeAttribute("data-target");
    }
  });
};

// ======================
// FORM HANDLING
// ======================

/**
 * Validate form inputs
 */
DesaBelor.validateForm = function (form) {
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      this.showFieldError(field, "Field ini wajib diisi");
      isValid = false;
    } else if (field.type === "email" && !this.isValidEmail(field.value)) {
      this.showFieldError(field, "Format email tidak valid");
      isValid = false;
    } else {
      this.clearFieldError(field);
    }
  });

  return isValid;
};

/**
 * Submit form data
 */
DesaBelor.submitForm = function (form, data) {
  const submitButton = form.querySelector('[type="submit"]');
  const originalText = submitButton.textContent;

  // Show loading state
  submitButton.textContent = "Mengirim...";
  submitButton.disabled = true;

  // Simulate API call (replace with actual endpoint)
  setTimeout(() => {
    console.log("Form submitted:", data);

    // Show success message
    this.showNotification("Data berhasil dikirim!", "success");

    // Reset form
    form.reset();

    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;

    // Close modal if form is in modal
    const modal = form.closest(".modal");
    if (modal) {
      this.closeModal(modal);
    }
  }, 2000);
};

/**
 * Show field error
 */
DesaBelor.showFieldError = function (field, message) {
  field.classList.add("error");

  let errorElement = field.parentNode.querySelector(".field-error");
  if (!errorElement) {
    errorElement = this.utils.createElement("div", {
      className: "field-error",
    });
    field.parentNode.appendChild(errorElement);
  }

  errorElement.textContent = message;
};

/**
 * Clear field error
 */
DesaBelor.clearFieldError = function (field) {
  field.classList.remove("error");

  const errorElement = field.parentNode.querySelector(".field-error");
  if (errorElement) {
    errorElement.remove();
  }
};

/**
 * Validate email format
 */
DesaBelor.isValidEmail = function (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ======================
// NOTIFICATIONS
// ======================

/**
 * Show notification message
 */
DesaBelor.showNotification = function (
  message,
  type = "info",
  duration = 5000
) {
  const notification = this.utils.createElement(
    "div",
    {
      className: `notification notification-${type}`,
    },
    message
  );

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100);

  // Auto hide
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, duration);
};

// ======================
// MODAL FUNCTIONS
// ======================

/**
 * Open modal
 */
window.openModal = function (modalId) {
  const modal = document.getElementById(`modal-${modalId}`);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Focus first input
    const firstInput = modal.querySelector("input, textarea, select");
    if (firstInput) {
      firstInput.focus();
    }
  }
};

/**
 * Close modal
 */
window.closeModal = function (modalId) {
  let modal;

  if (typeof modalId === "string") {
    modal = document.getElementById(`modal-${modalId}`);
  } else {
    modal = modalId;
  }

  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

// ======================
// TOOLTIPS
// ======================

/**
 * Initialize tooltips
 */
DesaBelor.initTooltips = function () {
  const tooltipElements = document.querySelectorAll("[data-tooltip]");

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", this.showTooltip.bind(this));
    element.addEventListener("mouseleave", this.hideTooltip.bind(this));
  });
};

/**
 * Show tooltip
 */
DesaBelor.showTooltip = function (e) {
  const element = e.target;
  const tooltipText = element.getAttribute("data-tooltip");

  if (tooltipText) {
    const tooltip = this.utils.createElement("div", {
      className: "tooltip",
      innerHTML: tooltipText,
    });

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left =
      rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px";

    tooltip.classList.add("show");
  }
};

/**
 * Hide tooltip
 */
DesaBelor.hideTooltip = function () {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) {
    tooltip.remove();
  }
};

/**
 * Update active navigation section
 */
DesaBelor.updateActiveSection = function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (
      this.state.scrollY >= sectionTop &&
      this.state.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  if (currentSection !== this.state.activeSection) {
    this.state.activeSection = currentSection;

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }
};

// ======================
// INITIALIZATION
// ======================

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => DesaBelor.init());
} else {
  DesaBelor.init();
}

// Export for use in other modules
window.DesaBelor = DesaBelor;
