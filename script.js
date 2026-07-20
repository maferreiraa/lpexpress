/* =========================================================
   EXPRESS LANDING PAGE — CONFIGURATION
   Change only the values in this section before publishing.
   ========================================================= */

// 1) Messenger username only — do not include @ or the full URL.
// Example: const MESSENGER_USERNAME = "mfxcreativee";
const MESSENGER_USERNAME = "SEU_USUARIO_AQUI";

// 2) Google Apps Script Web App URL.
// After deploying your Apps Script as a Web App, paste the /exec URL here.
// Example: https://script.google.com/macros/s/AKfycb.../exec
const GOOGLE_SHEETS_WEB_APP_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";

/* =========================================================
   PAGE BEHAVIOUR
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  configureMessengerLinks();
  initialiseFaq();
  initialiseContactForm();
  updateFooterYear();
});

function configureMessengerLinks() {
  const links = document.querySelectorAll(".messenger-link");
  const messengerUrl = `https://m.me/${encodeURIComponent(MESSENGER_USERNAME)}`;

  links.forEach((link) => {
    link.href = messengerUrl;
  });
}

function initialiseFaq() {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");

      document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        openItem.classList.remove("is-open");
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function initialiseContactForm() {
  const form = document.getElementById("contact-form");

  if (!form) return;

  const submitButton = form.querySelector(".form-submit");
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors(form);
    clearStatus(status);

    if (!validateForm(form)) {
      setStatus(status, "Please check the highlighted fields.", "error");
      return;
    }

    if (
      !GOOGLE_SHEETS_WEB_APP_URL ||
      GOOGLE_SHEETS_WEB_APP_URL.includes("COLE_AQUI") ||
      !GOOGLE_SHEETS_WEB_APP_URL.includes("script.google.com")
    ) {
      setStatus(
        status,
        "The contact form is not connected yet. Please configure the Google Apps Script URL.",
        "error"
      );
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add("is-loading");

    const payload = new URLSearchParams({
      name: form.querySelector("#name").value.trim(),
      email: form.querySelector("#email").value.trim(),
      business: form.querySelector("#business").value.trim(),
      message: form.querySelector("#message").value.trim()
    });

    try {
      // mode: "no-cors" avoids browser CORS issues commonly encountered
      // with Apps Script Web Apps hosted on a different domain.
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
      });

      form.reset();
      setStatus(
        status,
        "Thank you. Your message has been sent and I’ll reply as soon as possible.",
        "success"
      );
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus(
        status,
        "Something went wrong. Please try again or contact me through Messenger.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
    }
  });
}

function validateForm(form) {
  let isValid = true;
  const nameField = form.querySelector("#name");
  const emailField = form.querySelector("#email");

  if (!nameField.value.trim()) {
    showFieldError(nameField, "Please enter your name.");
    isValid = false;
  }

  if (!emailField.value.trim()) {
    showFieldError(emailField, "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(emailField.value.trim())) {
    showFieldError(emailField, "Please enter a valid email address.");
    isValid = false;
  }

  return isValid;
}

function showFieldError(field, message) {
  const group = field.closest(".form-group");
  const error = group.querySelector(".field-error");
  group.classList.add("has-error");
  field.setAttribute("aria-invalid", "true");
  error.textContent = message;
}

function clearFieldErrors(form) {
  form.querySelectorAll(".form-group.has-error").forEach((group) => {
    group.classList.remove("has-error");
    const field = group.querySelector("input, textarea");
    const error = group.querySelector(".field-error");
    if (field) field.removeAttribute("aria-invalid");
    if (error) error.textContent = "";
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setStatus(element, message, type) {
  element.textContent = message;
  element.className = `form-status is-${type}`;
}

function clearStatus(element) {
  element.textContent = "";
  element.className = "form-status";
}

function updateFooterYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
}
