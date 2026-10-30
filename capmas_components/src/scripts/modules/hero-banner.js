// src/components/04-hero-banner/hero-banner.js
// محدّث لاستخدام كلاس .active (متوافق مع hero-banner.html و hero-banner.css)

const HERO_AUTOPLAY_MS = 5000;

export function initHeroBanner() {
  try {
    const banners = document.querySelectorAll(".hero-banner");
    if (!banners.length) return;

    banners.forEach((banner) => {
      if (banner.dataset.initialized === "true") return;

      const slides = banner.querySelectorAll(".hero-banner__slide");
      if (!slides.length) return;

      const prevBtn = banner.querySelector(".hero-banner__nav--prev");
      const nextBtn = banner.querySelector(".hero-banner__nav--next");

      let current = 0;
      let timer = null;

      const goTo = (index) => {
        slides.forEach((slide, i) => {
          slide.classList.toggle("active", i === index);
        });
        current = index;
      };

      const next = () => goTo((current + 1) % slides.length);
      const prev = () => goTo((current - 1 + slides.length) % slides.length);

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

      banner.addEventListener("mouseenter", stopAuto);
      banner.addEventListener("mouseleave", startAuto);
      banner.addEventListener("focusin", stopAuto);
      banner.addEventListener("focusout", startAuto);

      if (slides.length < 2) {
        prevBtn?.setAttribute("hidden", "");
        nextBtn?.setAttribute("hidden", "");
      }

      // ضمان تفعيل الشريحة الأولى إن لم تكن مفعلة
      const firstActiveIndex = Array.from(slides).findIndex((slide) =>
        slide.classList.contains("active")
      );
      goTo(firstActiveIndex >= 0 ? firstActiveIndex : 0);

      startAuto();
      banner.dataset.initialized = "true";
    });
  } catch (error) {
    console.error("فشل تهيئة سلايدر البانر:", error);
  }
}