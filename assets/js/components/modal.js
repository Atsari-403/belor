/**
 * MODAL COMPONENT
 * Handles modal dialogs
 */

DesaBelor.components.modal = {
  init() {
    this.bindEvents();
    console.log("📦 Modal component initialized");
  },

  bindEvents() {
    // Open modal triggers
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest('[data-modal-open]');
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-open');
        this.open(modalId);
      }
    });

    // Close modal triggers
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest('[data-modal-close]');
      if (trigger) {
        e.preventDefault();
        const modal = trigger.closest('.modal');
        if (modal) {
          this.close(modal);
        }
      }
    });

    // Close on overlay click
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        this.close(e.target);
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const activeModal = document.querySelector(".modal.active");
        if (activeModal) {
          this.close(activeModal);
        }
      }
    });
  },

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  close(modal) {
    if (typeof modal === 'string') {
      modal = document.getElementById(modal);
    }
    if (modal) {
      modal.classList.remove("active");
      // Check if any other modals are open before restoring scroll
      if (document.querySelectorAll('.modal.active').length === 0) {
        document.body.style.overflow = "";
      }
    }
  }
};

// Overwrite global functions to use the component
window.openModal = function(modalId) {
  DesaBelor.components.modal.open(`modal-${modalId}`);
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(`modal-${modalId}`) || document.getElementById(modalId);
  DesaBelor.components.modal.close(modal);
};
