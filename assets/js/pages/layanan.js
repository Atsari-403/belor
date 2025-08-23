/**
 * LAYANAN PAGE SCRIPT
 * Handles FAQ accordion functionality
 */

DesaBelor.pages.layanan = {
  init() {
    this.initFAQ();
    console.log("🔧 Layanan page script initialized");
  },

  initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
      const question = item.querySelector(".faq-question");
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        
        // Close all other items
        faqItems.forEach(i => i.classList.remove("active"));

        // Open the clicked item if it wasn't already active
        if (!isActive) {
            item.classList.add("active");
        }
      });
    });
  }
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => DesaBelor.pages.layanan.init());
} else {
  DesaBelor.pages.layanan.init();
}
