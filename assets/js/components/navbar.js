/**
 * NAVBAR COMPONENT
 * Navigation functionality for Desa Belor website
 */

DesaBelor.components.navbar = {
  elements: {
    navbar: null,
    navToggle: null,
    navMenu: null,
    navLinks: null,
  },

  state: {
    isOpen: false,
    scrolled: false,
  },

  /**
   * Initialize navbar component
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.setActiveLink();
    console.log("📱 Navbar component initialized");
  },

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements.navbar = document.getElementById("navbar");
    this.elements.navToggle = document.getElementById("nav-toggle");
    this.elements.navMenu = document.getElementById("nav-menu");
    this.elements.navLinks = document.querySelectorAll(".nav-link");
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Mobile toggle button
    if (this.elements.navToggle) {
      this.elements.navToggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (this.state.isOpen && !this.isClickInsideNav(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle navigation link clicks
    this.elements.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        this.handleNavClick(e, link);
      });
    });

    // Smooth scroll for anchor links
    this.setupSmoothScroll();

    // Update active link on scroll
    window.addEventListener(
      "scroll",
      DesaBelor.utils.throttle(() => {
        this.updateActiveLink();
        this.handleScroll();
      }, 16)
    );
  },

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    this.state.isOpen = !this.state.isOpen;

    if (this.state.isOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  },

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.elements.navMenu.classList.add("active");
    this.elements.navToggle.classList.add("active");
    this.elements.navbar.classList.add("menu-open");

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Add escape key listener
    document.addEventListener("keydown", this.handleEscapeKey.bind(this));

    // Animate menu items
    this.animateMenuItems();

    this.state.isOpen = true;
  },

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.elements.navMenu.classList.remove("active");
    this.elements.navToggle.classList.remove("active");
    this.elements.navbar.classList.remove("menu-open");

    // Restore body scroll
    document.body.style.overflow = "";

    // Remove escape key listener
    document.removeEventListener("keydown", this.handleEscapeKey.bind(this));

    this.state.isOpen = false;
  },

  /**
   * Handle escape key press
   */
  handleEscapeKey(e) {
    if (e.key === "Escape" && this.state.isOpen) {
      this.closeMobileMenu();
    }
  },

  /**
   * Check if click is inside navigation
   */
  isClickInsideNav(target) {
    return this.elements.navbar.contains(target);
  },

  /**
   * Handle navigation link clicks
   */
  handleNavClick(e, link) {
    const href = link.getAttribute("href");

    // Handle anchor links (same page)
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Smooth scroll to target
        DesaBelor.utils.scrollToElement(targetElement);

        // Close mobile menu if open
        if (this.state.isOpen) {
          this.closeMobileMenu();
        }

        // Update active link
        this.setActiveLink(link);
      }
    }
    // Handle external links (other pages)
    else if (!href.startsWith("http")) {
      // Close mobile menu before navigation
      if (this.state.isOpen) {
        this.closeMobileMenu();
      }

      // Add loading state
      link.classList.add("loading");
    }
  },

  /**
   * Setup smooth scrolling for all anchor links
   */
  setupSmoothScroll() {
    // Enable smooth scrolling for hash links
    const hashLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    hashLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        const targetElement = document.querySelector(href);

        if (targetElement) {
          e.preventDefault();
          DesaBelor.utils.scrollToElement(targetElement);

          // Update URL without triggering scroll
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  },

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrollY = window.pageYOffset;
    const shouldBeScrolled = scrollY > 50;

    if (shouldBeScrolled !== this.state.scrolled) {
      this.state.scrolled = shouldBeScrolled;

      if (shouldBeScrolled) {
        this.elements.navbar.classList.add("scrolled");
      } else {
        this.elements.navbar.classList.remove("scrolled");
      }
    }
  },

  /**
   * Update active navigation link based on current section
   */
  updateActiveLink() {
    if (DesaBelor.state.isMobile && this.state.isOpen) {
      return; // Don't update when mobile menu is open
    }

    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.pageYOffset + 100;

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        currentSection = section.id;
      }
    });

    // Special case for top of page
    if (window.pageYOffset < 100) {
      currentSection = "hero";
    }

    this.setActiveLinkBySection(currentSection);
  },

  /**
   * Set active link by section ID
   */
  setActiveLinkBySection(sectionId) {
    this.elements.navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive =
        href === `#${sectionId}` ||
        (href === "./index.html" && sectionId === "hero") ||
        (href === "./" && sectionId === "hero");

      if (isActive) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  },

  /**
   * Set active link manually
   */
  setActiveLink(activeLink = null) {
    if (activeLink) {
      this.elements.navLinks.forEach((link) => {
        link.classList.remove("active");
      });
      activeLink.classList.add("active");
    } else {
      // Auto-detect active link based on current page
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;

      this.elements.navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        let isActive = false;

        if (currentHash && href === currentHash) {
          isActive = true;
        } else if (
          !currentHash &&
          (href === "./" || href === "./index.html") &&
          currentPath.endsWith("/")
        ) {
          isActive = true;
        } else if (
          href &&
          currentPath.includes(href.replace("./", "").replace(".html", ""))
        ) {
          isActive = true;
        }

        if (isActive) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  },

  /**
   * Animate menu items when opening mobile menu
   */
  animateMenuItems() {
    const menuItems = this.elements.navMenu.querySelectorAll(".nav-link");

    menuItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";

      setTimeout(() => {
        item.style.transition = "all 0.3s ease";
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
      }, index * 100);
    });
  },

  /**
   * Show/hide navbar based on scroll direction
   */
  autoHideNavbar() {
    let lastScrollTop = 0;

    window.addEventListener(
      "scroll",
      DesaBelor.utils.throttle(() => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
          // Scrolling down - hide navbar
          this.elements.navbar.classList.add("navbar-hidden");
        } else {
          // Scrolling up - show navbar
          this.elements.navbar.classList.remove("navbar-hidden");
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }, 100)
    );
  },

  /**
   * Add search functionality (if needed in future)
   */
  initSearch() {
    const searchToggle = this.elements.navbar.querySelector(".search-toggle");
    const searchForm = this.elements.navbar.querySelector(".search-form");

    if (searchToggle && searchForm) {
      searchToggle.addEventListener("click", () => {
        searchForm.classList.toggle("active");
        const searchInput = searchForm.querySelector("input");
        if (searchInput) {
          searchInput.focus();
        }
      });
    }
  },

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation() {
    this.elements.navLinks.forEach((link, index) => {
      link.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
            e.preventDefault();
            const nextIndex = (index + 1) % this.elements.navLinks.length;
            this.elements.navLinks[nextIndex].focus();
            break;

          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault();
            const prevIndex =
              index === 0 ? this.elements.navLinks.length - 1 : index - 1;
            this.elements.navLinks[prevIndex].focus();
            break;

          case "Home":
            e.preventDefault();
            this.elements.navLinks[0].focus();
            break;

          case "End":
            e.preventDefault();
            this.elements.navLinks[this.elements.navLinks.length - 1].focus();
            break;
        }
      });
    });
  },

  /**
   * Destroy navbar component
   */
  destroy() {
    // Remove event listeners
    if (this.elements.navToggle) {
      this.elements.navToggle.removeEventListener(
        "click",
        this.toggleMobileMenu
      );
    }

    // Reset states
    this.closeMobileMenu();
    this.state = { isOpen: false, scrolled: false };

    console.log("📱 Navbar component destroyed");
  },
};
