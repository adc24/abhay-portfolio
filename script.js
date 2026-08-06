"use strict";

// Enables progressive enhancement styles while keeping all content visible without JS.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const heroVideo = document.querySelector(".hero__video");
  const header = document.querySelector("[data-site-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const resumeDialog = document.querySelector("[data-resume-dialog]");
  const resumeOpeners = [...document.querySelectorAll("[data-resume-open]")];
  const resumeCloseButton = document.querySelector("[data-resume-close]");
  const resumeContent = document.querySelector(".resume-viewer__content");
  const resumeDownloaders = [...document.querySelectorAll("[data-resume-download]")];
  const sections = [...document.querySelectorAll("[data-section]")];
  const navigationLinks = [...document.querySelectorAll(".nav__link, .mobile-menu__link")];
  const revealItems = [...document.querySelectorAll(".reveal")];
  const contactForm = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Keep the muted hero video playing when the page regains visibility. */
  const playHeroVideo = () => {
    if (!heroVideo) return;

    heroVideo.muted = true;
    const playback = heroVideo.play();

    if (playback instanceof Promise) {
      playback.catch(() => {
        // The configured background color remains visible if autoplay is blocked.
      });
    }
  };

  playHeroVideo();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && heroVideo?.paused) {
      playHeroVideo();
    }
  });

  /* Add a compact glass header after the visitor leaves the top of the page. */
  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* Accessible mobile navigation. */
  const setMenuState = (isOpen) => {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    mobileMenu.inert = !isOpen;
    mobileMenu.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    setMenuState(isOpen);

    if (isOpen) {
      mobileMenu?.querySelector("a")?.focus();
    }
  });

  mobileMenu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setMenuState(false);
  });

  /*
   * Open a local, image-based résumé viewer instead of relying on a browser
   * PDF plugin. The original PDF remains available from the download button.
   */
  const closeResume = () => {
    if (!resumeDialog?.open) return;

    if (typeof resumeDialog.close === "function") resumeDialog.close();
    else resumeDialog.removeAttribute("open");

    document.body.classList.remove("resume-open");
  };

  resumeOpeners.forEach((opener) => {
    opener.addEventListener("click", (event) => {
      if (!resumeDialog) return;

      event.preventDefault();
      setMenuState(false);
      if (resumeContent) resumeContent.scrollTop = 0;

      if (!resumeDialog.open) {
        if (typeof resumeDialog.showModal === "function") resumeDialog.showModal();
        else resumeDialog.setAttribute("open", "");
      }

      document.body.classList.add("resume-open");
      requestAnimationFrame(() => resumeContent?.focus({ preventScroll: true }));
    });
  });

  resumeCloseButton?.addEventListener("click", closeResume);

  resumeDialog?.addEventListener("click", (event) => {
    if (event.target === resumeDialog) closeResume();
  });

  resumeDialog?.addEventListener("close", () => {
    document.body.classList.remove("resume-open");
  });

  /* Download the local PDF as a Blob, with direct navigation as a fallback. */
  resumeDownloaders.forEach((downloadLink) => {
    downloadLink.addEventListener("click", async (event) => {
      event.preventDefault();
      downloadLink.setAttribute("aria-busy", "true");

      try {
        const response = await fetch(downloadLink.href, { cache: "force-cache" });
        if (!response.ok) throw new Error(`Resume request failed: ${response.status}`);

        const resumeBlob = await response.blob();
        const objectUrl = URL.createObjectURL(resumeBlob);
        const temporaryLink = document.createElement("a");

        temporaryLink.href = objectUrl;
        temporaryLink.download = "Abhay_Chouhan_Resume.pdf";
        temporaryLink.style.display = "none";
        document.body.appendChild(temporaryLink);
        temporaryLink.click();
        temporaryLink.remove();
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      } catch (error) {
        window.location.assign(downloadLink.href);
      } finally {
        downloadLink.removeAttribute("aria-busy");
      }
    });
  });

  /* Reveal content once as it enters the viewport. */
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* Keep navigation state synchronized with the visible section. */
  const setActiveSection = (sectionId) => {
    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);

      if (link.classList.contains("nav__link")) {
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections[0]) setActiveSection(visibleSections[0].target.id);
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0, 0.1, 0.25]
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* Send contact enquiries to Abhay's Gmail through FormSubmit. */
  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const honeypot = String(formData.get("_honey") || "").trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const submitButton = contactForm.querySelector("button[type='submit']");
    const submitLabel = submitButton?.querySelector("span");
    const defaultLabel = submitLabel?.textContent || "Send message";

    const setFormStatus = (messageText, state = "") => {
      if (!formStatus) return;
      formStatus.textContent = messageText;
      formStatus.classList.remove("is-sending", "is-success", "is-error");
      if (state) formStatus.classList.add(`is-${state}`);
    };

    contactForm.querySelectorAll("[aria-invalid]").forEach((field) => {
      field.removeAttribute("aria-invalid");
    });

    // Silently accept bot-filled forms without sending them.
    if (honeypot) {
      contactForm.reset();
      setFormStatus("Thanks. Your message has been received.", "success");
      return;
    }

    if (!name || !emailIsValid || !message) {
      if (!name) contactForm.elements.name.setAttribute("aria-invalid", "true");
      if (!emailIsValid) contactForm.elements.email.setAttribute("aria-invalid", "true");
      if (!message) contactForm.elements.message.setAttribute("aria-invalid", "true");

      setFormStatus("Please complete each field with a valid email address.", "error");
      contactForm.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending…";
    setFormStatus("Sending your message securely…", "sending");

    const endpoint = contactForm.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          _replyto: email,
          message,
          _subject: `New portfolio enquiry from ${name}`,
          _template: "table",
          _captcha: "false"
        })
      });

      const result = await response.json().catch(() => ({}));
      const submissionFailed = !response.ok || result.success === false || result.success === "false";

      if (submissionFailed) {
        throw new Error(result.message || `Form submission failed: ${response.status}`);
      }

      contactForm.reset();
      setFormStatus("Thank you — your message has been sent to Abhay.", "success");
    } catch (error) {
      setFormStatus("The form could not send right now. Please email abhaydinakar246@gmail.com directly.", "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = defaultLabel;
    }
  });

  /* Keep the copyright year current. */
  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
});
