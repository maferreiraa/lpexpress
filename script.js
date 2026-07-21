/* =========================================================
   EXPRESS LANDING PAGE — CONFIGURATION
   ========================================================= */

const MESSENGER_USERNAME = "430269683495305";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby0CtCbZ_OGbamPHuMJfHPKe-csI0iljmB3uh23kIhPGxhpsHPda6q2YKtw9hefUrIgeQ/exec";

/* =========================================================
   PAGE BEHAVIOUR
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  configureMessengerLinks();
  initialiseFaq();
  initialiseContactForm();
  updateFooterYear();
});


function trackMetaEvent(eventName, parameters = {}) {
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, parameters);
  }
}

function trackGoogleEvent(eventName, parameters = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
  }
}

function configureMessengerLinks() {
  const links = document.querySelectorAll(".messenger-link");
  const messengerUrl = `https://m.me/${MESSENGER_USERNAME}`;

  links.forEach((link) => {
    link.href = messengerUrl;

    link.addEventListener("click", () => {
      trackMetaEvent("Contact", {
        content_name: "Messenger",
        contact_method: "Messenger"
      });

      // GA4 recommended event for contact-intent actions
      trackGoogleEvent("contact", {
        method: "Messenger"
      });
    });
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

    submitButton.disabled = true;
    submitButton.classList.add("is-loading");

    try {
      // Send as application/x-www-form-urlencoded.
      // This is parsed reliably by Apps Script through e.parameter.
      const payload = new URLSearchParams();

      payload.append("name", form.querySelector("#name").value.trim());
      payload.append("email", form.querySelector("#email").value.trim());
      payload.append("business", form.querySelector("#business").value.trim());
      payload.append("message", form.querySelector("#message").value.trim());

      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: payload.toString()
      });

      form.reset();

      // Meta Pixel: completed contact form submission
      trackMetaEvent("Lead", {
        content_name: "Landing Page Enquiry",
        lead_source: "Website Contact Form"
      });

      // GA4: completed contact form submission (recommended event name)
      trackGoogleEvent("generate_lead", {
        content_name: "Landing Page Enquiry",
        lead_source: "Website Contact Form"
      });

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

  if (error) error.textContent = message;
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
