/**
 * FORMS COMPONENT
 * Handles form validation and submission
 */

DesaBelor.components.forms = {
  init() {
    this.bindEvents();
    console.log("📝 Forms component initialized");
  },

  bindEvents() {
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit(form);
      });
    });
  },

  handleSubmit(form) {
    if (this.validate(form)) {
      this.submit(form);
    }
  },

  validate(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(err => err.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        this.showError(field, "Kolom ini wajib diisi.");
        isValid = false;
      } else if (field.type === "email" && !this.isValidEmail(field.value)) {
        this.showError(field, "Format email tidak valid.");
        isValid = false;
      }
    });

    return isValid;
  },

  submit(form) {
    const submitButton = form.querySelector('[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    submitButton.disabled = true;
    submitButton.innerHTML = `<span>Mengirim...</span>`;

    console.log("Submitting form data:", data);

    // Simulate API call
    setTimeout(() => {
      DesaBelor.showNotification("Pengaduan Anda telah berhasil dikirim!", "success");
      
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      form.reset();

      const modal = form.closest('.modal');
      if (modal) {
        DesaBelor.components.modal.close(modal);
      }
    }, 1500);
  },

  showError(field, message) {
    field.classList.add("error");
    const formGroup = field.closest(".form-group");
    if (formGroup) {
      const errorEl = DesaBelor.utils.createElement('p', { className: 'field-error' }, message);
      formGroup.appendChild(errorEl);
    }
  },

  isValidEmail(email) {
    const re = /^(([^<>()[\\]\\.,;:\s@"]+(\.[^<>()[\\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
};

// Initialize the component
if (DesaBelor.components.forms) {
    DesaBelor.components.forms.init();
}