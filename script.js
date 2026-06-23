const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("[data-menu]");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const whatsappFloat = document.querySelector(".whatsapp-float");

// Keep the header readable once the page starts scrolling.
function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

// Close the overlay menu after navigation on mobile screens.
function closeMenu() {
  menu.classList.remove("is-open");
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuToggle.classList.toggle("is-active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

// Lightweight reveal animation for sections and cards.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

if (whatsappFloat) {
  let isDragging = false;
  let didDrag = false;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;

  function keepInsideViewport(left, top) {
    const margin = 10;
    const maxLeft = window.innerWidth - whatsappFloat.offsetWidth - margin;
    const maxTop = window.innerHeight - whatsappFloat.offsetHeight - margin;

    return {
      left: Math.min(Math.max(left, margin), maxLeft),
      top: Math.min(Math.max(top, margin), maxTop),
    };
  }

  whatsappFloat.addEventListener("pointerdown", (event) => {
    const rect = whatsappFloat.getBoundingClientRect();

    isDragging = true;
    didDrag = false;
    startX = event.clientX;
    startY = event.clientY;
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    whatsappFloat.classList.add("is-dragging");
    whatsappFloat.setPointerCapture(event.pointerId);
  });

  whatsappFloat.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const moveX = Math.abs(event.clientX - startX);
    const moveY = Math.abs(event.clientY - startY);

    if (moveX > 4 || moveY > 4) {
      didDrag = true;
    }

    const next = keepInsideViewport(event.clientX - offsetX, event.clientY - offsetY);
    whatsappFloat.style.left = `${next.left}px`;
    whatsappFloat.style.top = `${next.top}px`;
    whatsappFloat.style.right = "auto";
    whatsappFloat.style.bottom = "auto";
  });

  function stopDrag(event) {
    if (!isDragging) return;

    isDragging = false;
    whatsappFloat.classList.remove("is-dragging");

    if (whatsappFloat.hasPointerCapture(event.pointerId)) {
      whatsappFloat.releasePointerCapture(event.pointerId);
    }
  }

  whatsappFloat.addEventListener("pointerup", stopDrag);
  whatsappFloat.addEventListener("pointercancel", stopDrag);

  whatsappFloat.addEventListener("click", (event) => {
    if (didDrag) {
      event.preventDefault();
    }
  });
}
