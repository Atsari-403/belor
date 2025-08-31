/**
 * Pemerintahan Page JavaScript
 * Handles horizontal scrolling for aparatur cards
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize scroll functionality
  initializeAparaturScroll();

  // Initialize animations
  initializeAnimations();
});

/**
 * Initialize horizontal scroll functionality for aparatur cards
 */
function initializeAparaturScroll() {
  const scrollContainer = document.querySelector(".aparatur-scroll-wrapper");
  const scrollLeftBtn = document.getElementById("scrollLeft");
  const scrollRightBtn = document.getElementById("scrollRight");

  if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) {
    return;
  }

  // Calculate scroll amount based on screen size
  function getScrollAmount() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 575) return 200; // Mobile
    if (screenWidth <= 767) return 240; // Tablet Portrait
    if (screenWidth <= 991) return 280; // Tablet Landscape
    return 320; // Desktop
  }

  // Scroll left functionality
  scrollLeftBtn.addEventListener("click", function () {
    const scrollAmount = getScrollAmount();
    scrollContainer.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  // Scroll right functionality
  scrollRightBtn.addEventListener("click", function () {
    const scrollAmount = getScrollAmount();
    scrollContainer.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  // Update button visibility based on scroll position
  function updateScrollButtons() {
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const currentScroll = scrollContainer.scrollLeft;

    // Show/hide left button
    if (currentScroll <= 10) {
      scrollLeftBtn.style.opacity = "0.5";
      scrollLeftBtn.style.pointerEvents = "none";
    } else {
      scrollLeftBtn.style.opacity = "0.8";
      scrollLeftBtn.style.pointerEvents = "all";
    }

    // Show/hide right button
    if (currentScroll >= maxScroll - 10) {
      scrollRightBtn.style.opacity = "0.5";
      scrollRightBtn.style.pointerEvents = "none";
    } else {
      scrollRightBtn.style.opacity = "0.8";
      scrollRightBtn.style.pointerEvents = "all";
    }
  }

  // Listen for scroll events
  scrollContainer.addEventListener("scroll", updateScrollButtons);

  // Initial button state
  updateScrollButtons();

  // Handle window resize
  window.addEventListener("resize", function () {
    updateScrollButtons();
  });

  // Touch/swipe support for mobile
  let startX = null;
  let scrollLeft = null;

  scrollContainer.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      scrollContainer.style.scrollBehavior = "auto";
    },
    { passive: true }
  );

  scrollContainer.addEventListener(
    "touchmove",
    function (e) {
      if (!startX) return;

      const x = e.touches[0].pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; // Multiply for faster scrolling
      scrollContainer.scrollLeft = scrollLeft - walk;
    },
    { passive: true }
  );

  scrollContainer.addEventListener("touchend", function () {
    startX = null;
    scrollLeft = null;
    scrollContainer.style.scrollBehavior = "smooth";
    updateScrollButtons();
  });

  // Keyboard navigation support
  scrollContainer.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const scrollAmount = getScrollAmount();
      scrollContainer.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const scrollAmount = getScrollAmount();
      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  });

  // Auto-scroll on mouse wheel (optional enhancement)
  scrollContainer.addEventListener(
    "wheel",
    function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // Already scrolling horizontally

      e.preventDefault();
      const scrollAmount = e.deltaY > 0 ? 150 : -150;
      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    },
    { passive: false }
  );
}

/**
 * Initialize scroll animations and intersection observers
 */
function initializeAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const elementsToAnimate = document.querySelectorAll(
    ".aparatur-card, .info-card, .vision-mission-card, .stat-item"
  );

  elementsToAnimate.forEach(function (element) {
    observer.observe(element);
  });

  // Stagger animation for scroll cards
  const scrollCards = document.querySelectorAll(".aparatur-card-scroll");
  scrollCards.forEach(function (card, index) {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

/**
 * Smooth scroll to section functionality
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offsetTop = section.offsetTop - 80; // Account for sticky navbar
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

/**
 * Contact modal functionality (optional enhancement)
 */
function showContactModal(name, position, phone, email) {
  // Create modal dynamically if needed
  const modalHTML = `
        <div class="modal fade" id="contactModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-success">
                            <i class="fas fa-user-tie me-2"></i>
                            Kontak ${name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <h6 class="text-muted">${position}</h6>
                        </div>
                        <div class="contact-details">
                            <div class="d-flex align-items-center mb-3">
                                <i class="fas fa-phone text-success me-3"></i>
                                <div>
                                    <strong>Telepon:</strong><br>
                                    <a href="tel:${phone}" class="text-decoration-none">${phone}</a>
                                </div>
                            </div>
                            ${
                              email
                                ? `
                            <div class="d-flex align-items-center mb-3">
                                <i class="fas fa-envelope text-success me-3"></i>
                                <div>
                                    <strong>Email:</strong><br>
                                    <a href="mailto:${email}" class="text-decoration-none">${email}</a>
                                </div>
                            </div>
                            `
                                : ""
                            }
                            <div class="d-flex align-items-center">
                                <i class="fas fa-clock text-success me-3"></i>
                                <div>
                                    <strong>Jam Kerja:</strong><br>
                                    Senin - Jumat: 08:00 - 15:00<br>
                                    Sabtu: 08:00 - 12:00
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        <a href="tel:${phone}" class="btn btn-success">
                            <i class="fas fa-phone me-2"></i>Telepon Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Remove existing modal if any
  const existingModal = document.getElementById("contactModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Add modal to body
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("contactModal"));
  modal.show();
}

/**
 * Add click handlers to aparatur cards for contact modal
 */
function addContactModalHandlers() {
  const aparaturCards = document.querySelectorAll(
    ".aparatur-card-scroll .aparatur-card"
  );

  aparaturCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const name = card.querySelector(".aparatur-name").textContent;
      const position = card.querySelector(".aparatur-position").textContent;
      const phoneElement = card.querySelector(".contact-item span");
      const phone = phoneElement ? phoneElement.textContent : "";

      if (name && position && phone) {
        showContactModal(name, position, phone);
      }
    });

    // Add cursor pointer style
    card.style.cursor = "pointer";
  });
}

/**
 * Initialize on DOM load
 */
document.addEventListener("DOMContentLoaded", function () {
  // Add contact modal handlers
  addContactModalHandlers();

  // Add keyboard navigation info for accessibility
  const scrollContainer = document.querySelector(".aparatur-scroll-wrapper");
  if (scrollContainer) {
    scrollContainer.setAttribute("tabindex", "0");
    scrollContainer.setAttribute("role", "region");
    scrollContainer.setAttribute(
      "aria-label",
      "Daftar aparatur desa - gunakan panah kiri/kanan untuk navigasi"
    );
  }
});

/**
 * Utility function to check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Auto-scroll to center active card (optional enhancement)
 */
function centerActiveCard() {
  const scrollContainer = document.querySelector(".aparatur-scroll-wrapper");
  const cards = document.querySelectorAll(".aparatur-card-scroll");

  if (!scrollContainer || !cards.length) return;

  const containerWidth = scrollContainer.clientWidth;
  const cardWidth = cards[0].offsetWidth + 24; // Include gap
  const centerIndex = Math.floor(cards.length / 2);
  const scrollPosition =
    centerIndex * cardWidth - containerWidth / 2 + cardWidth / 2;

  scrollContainer.scrollTo({
    left: Math.max(0, scrollPosition),
    behavior: "smooth",
  });
}

/**
 * Handle orientation change
 */
window.addEventListener("orientationchange", function () {
  setTimeout(function () {
    const scrollContainer = document.querySelector(".aparatur-scroll-wrapper");
    if (scrollContainer) {
      // Recalculate scroll position after orientation change
      const updateScrollButtons = window.updateScrollButtons;
      if (typeof updateScrollButtons === "function") {
        updateScrollButtons();
      }
    }
  }, 500);
});

/**
 * Preload images for better performance
 */
function preloadImages() {
  const images = document.querySelectorAll(".aparatur-photo");
  images.forEach(function (img) {
    const newImg = new Image();
    newImg.src = img.src;
  });
}

// Initialize image preloading
document.addEventListener("DOMContentLoaded", preloadImages);
