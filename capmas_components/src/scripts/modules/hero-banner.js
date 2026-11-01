const HERO_AUTOPLAY_MS = 5000;

export function initHeroBanner() {
  try {
    const banners = document.querySelectorAll(".hero-banner");
    if (!banners.length) return;

    banners.forEach((banner) => {
      if (banner.dataset.initialized === "true") return;

      const slides = banner.querySelectorAll(".hero-banner__slide");
      if (!slides.length) return;

      const dots = banner.querySelectorAll(".hero-banner__dot");
      const prevBtn = banner.querySelector(".hero-banner__nav--prev");
      const nextBtn = banner.querySelector(".hero-banner__nav--next");

      let current = 0;
      let timer = null;

      const syncDots = (index) => {
        dots.forEach((dot, i) => {
          const isActive = i === index;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-selected", isActive ? "true" : "false");
        });
      };

      const goTo = (index) => {
        const safeIndex = ((index % slides.length) + slides.length) % slides.length;
        slides.forEach((slide, i) => {
          slide.classList.toggle("active", i === safeIndex);
        });
        current = safeIndex;
        syncDots(safeIndex);
      };

      const next = () => goTo(current + 1);
      const prev = () => goTo(current - 1);

      const stopAuto = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      };

      const startAuto = () => {
        stopAuto();
        if (slides.length > 1) {
          timer = setInterval(next, HERO_AUTOPLAY_MS);
        }
      };

      nextBtn?.addEventListener("click", () => {
        next();
        startAuto();
      });

      prevBtn?.addEventListener("click", () => {
        prev();
        startAuto();
      });

      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          const idx = parseInt(dot.getAttribute("data-slide-index") || "0", 10);
          if (Number.isNaN(idx)) return;
          goTo(idx);
          startAuto();
        });
      });

      banner.addEventListener("mouseenter", stopAuto);
      banner.addEventListener("mouseleave", startAuto);
      banner.addEventListener("focusin", stopAuto);
      banner.addEventListener("focusout", startAuto);

      if (slides.length < 2) {
        prevBtn?.setAttribute("hidden", "");
        nextBtn?.setAttribute("hidden", "");
      }

      if (dots.length < 2) {
        banner.querySelector(".hero-banner__dots")?.setAttribute("hidden", "");
      }

      const activeIndex = Array.from(slides).findIndex((slide) =>
        slide.classList.contains("active")
      );
      goTo(activeIndex >= 0 ? activeIndex : 0);

      startAuto();
      banner.dataset.initialized = "true";
    });
  } catch (error) {
    console.error("فشل تهيئة سلايدر البانر:", error);
  }
}