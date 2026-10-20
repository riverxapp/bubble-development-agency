const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.getElementById("siteHeader");
const progress = document.getElementById("scrollProgress");
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("primaryNav");
const navLinks = Array.from(document.querySelectorAll(".nav__list a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-stuck", window.scrollY > 12);
};

const setProgress = () => {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
};

let ticking = false;

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    setHeaderState();
    setProgress();
    updateActiveLink();
    ticking = false;
  });
};

const updateActiveLink = () => {
  const marker = window.scrollY + window.innerHeight * 0.32;
  let currentId = null;

  sections.forEach((section) => {
    if (section.offsetTop <= marker) currentId = section.id;
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const closeNav = () => {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeNav();
  });
}

const revealItems = Array.from(document.querySelectorAll(".reveal"));
const pendingReveal = [];

const showReveal = (item) => {
  item.classList.add("is-visible");
  const index = pendingReveal.indexOf(item);
  if (index !== -1) pendingReveal.splice(index, 1);
};

if (revealItems.length) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const index = Math.max(0, siblings.indexOf(entry.target));
          entry.target.style.transitionDelay = `${Math.min(index, 6) * 70}ms`;
          showReveal(entry.target);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => {
      pendingReveal.push(item);
      revealObserver.observe(item);
    });

    const revealInView = () => {
      pendingReveal.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.1 && rect.bottom > -window.innerHeight * 0.1) {
          showReveal(item);
          revealObserver.unobserve(item);
        }
      });
    };

    window.addEventListener("load", revealInView);
    window.setTimeout(revealInView, 2500);
  }
}

const counters = Array.from(document.querySelectorAll("[data-count]"));

const formatCount = (value, decimals) =>
  decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("en-US");

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const decimals = Number(element.dataset.decimals || 0);
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    element.textContent = formatCount(target * eased, decimals);
    if (elapsed < 1) window.requestAnimationFrame(tick);
    else element.textContent = formatCount(target, decimals);
  };

  window.requestAnimationFrame(tick);
};

if (counters.length) {
  if (prefersReducedMotion) {
    counters.forEach((counter) => {
      counter.textContent = formatCount(Number(counter.dataset.count), Number(counter.dataset.decimals || 0));
    });
  } else if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }
}

const faqButtons = Array.from(document.querySelectorAll(".faq__q"));

const setPanelState = (button, expand) => {
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  if (!panel) return;

  button.setAttribute("aria-expanded", String(expand));

  if (expand) {
    panel.hidden = false;
    const target = panel.scrollHeight;
    panel.style.height = "0px";
    window.requestAnimationFrame(() => {
      panel.style.transition = "height 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)";
      panel.style.height = `${target}px`;
    });
    window.setTimeout(() => {
      panel.style.transition = "";
      panel.style.height = "auto";
    }, 380);
  } else {
    panel.style.transition = "height 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)";
    panel.style.height = `${panel.scrollHeight}px`;
    window.requestAnimationFrame(() => {
      panel.style.height = "0px";
    });
    window.setTimeout(() => {
      panel.hidden = true;
      panel.style.transition = "";
      panel.style.height = "";
    }, 320);
  }
};

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    faqButtons.forEach((other) => {
      if (other !== button && other.getAttribute("aria-expanded") === "true") {
        setPanelState(other, false);
      }
    });
    setPanelState(button, !isExpanded);
  });
});

const cards = Array.from(document.querySelectorAll(".bento__card"));

if (cards.length && !prefersReducedMotion) {
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const setFieldError = (input, message) => {
  const field = input.closest(".field");
  if (!field) return;
  const error = field.querySelector("[data-error-for]");
  if (error) error.textContent = message;
  field.classList.toggle("has-error", Boolean(message));
};

const validateField = (input) => {
  const value = input.value.trim();

  if (input.hasAttribute("required") && !value) {
    setFieldError(input, "This field is required.");
    return false;
  }

  if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    setFieldError(input, "Enter a valid email address.");
    return false;
  }

  if (input.id === "message" && value && value.length < 12) {
    setFieldError(input, "A sentence or two is plenty — at least 12 characters.");
    return false;
  }

  setFieldError(input, "");
  return true;
};

if (form && formStatus) {
  const inputs = Array.from(form.querySelectorAll("input, select, textarea"));

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".field")?.classList.contains("has-error")) validateField(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.classList.remove("is-ok", "is-error");

    const invalid = inputs.filter((input) => !validateField(input));

    if (invalid.length) {
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      formStatus.classList.add("is-error");
      invalid[0].focus();
      return;
    }

    const button = form.querySelector("button[type='submit']");
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Sending…";

    window.setTimeout(() => {
      button.disabled = false;
      button.textContent = originalLabel;
      formStatus.textContent = "Thanks — your enquiry is in. A senior Bubble developer will reply within one business day.";
      formStatus.classList.add("is-ok");
      form.reset();
    }, 700);
  });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const canvas = document.getElementById("bubbleCanvas");

if (canvas && canvas.getContext) {
  const ctx = canvas.getContext("2d");
  const palette = [
    "rgba(255, 77, 141, 0.24)",
    "rgba(139, 92, 246, 0.22)",
    "rgba(53, 230, 224, 0.2)",
    "rgba(255, 180, 87, 0.16)"
  ];

  let bubbles = [];
  let width = 0;
  let height = 0;
  let running = false;
  let frame = 0;
  const pointer = { x: -9999, y: -9999, active: false };

  const build = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.round(Math.min(20, Math.max(9, (width * height) / 42000)));
    bubbles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 12 + Math.random() * 40,
      speed: 0.1 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
      color: palette[Math.floor(Math.random() * palette.length)]
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    bubbles.forEach((bubble) => {
      bubble.y -= bubble.speed;
      bubble.phase += 0.012;
      bubble.x += bubble.drift + Math.sin(bubble.phase) * 0.22;

      if (pointer.active) {
        const dx = bubble.x - pointer.x;
        const dy = bubble.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 180 && distance > 0.5) {
          bubble.x += (dx / distance) * 0.6;
          bubble.y += (dy / distance) * 0.6;
        }
      }

      if (bubble.y + bubble.r < 0) {
        bubble.y = height + bubble.r;
        bubble.x = Math.random() * width;
      }
      if (bubble.x < -bubble.r * 2) bubble.x = width + bubble.r;
      if (bubble.x > width + bubble.r * 2) bubble.x = -bubble.r;

      const gradient = ctx.createRadialGradient(
        bubble.x - bubble.r * 0.3,
        bubble.y - bubble.r * 0.35,
        bubble.r * 0.1,
        bubble.x,
        bubble.y,
        bubble.r
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.26)");
      gradient.addColorStop(0.35, bubble.color);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    frame = window.requestAnimationFrame(draw);
  };

  const start = () => {
    if (running) return;
    running = true;
    frame = window.requestAnimationFrame(draw);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    window.cancelAnimationFrame(frame);
  };

  build();
  start();

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      build();
    }, 180);
  });

  canvas.parentElement.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });

  canvas.parentElement.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  if ("IntersectionObserver" in window) {
    const canvasObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0 }
    );
    canvasObserver.observe(canvas);
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
setHeaderState();
setProgress();
updateActiveLink();
