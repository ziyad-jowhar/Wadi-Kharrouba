import { initHeroBanner } from "./modules/hero-banner.js";
import { initIndicators } from "./modules/indicators.js";
import { initPopulationClock } from "./modules/population-clock.js";

const loadComponents = async () => {
  const placeholders = document.querySelectorAll("[data-component]");
  if (!placeholders.length) return;

  await Promise.all(
    Array.from(placeholders).map(async (placeholder) => {
      const componentPath = placeholder.getAttribute("data-component");
      if (!componentPath) return;

      try {
        const response = await fetch(componentPath);
        if (!response.ok) {
          throw new Error(
            `تعذّر تحميل المكوّن: ${componentPath} (${response.status})`
          );
        }
        placeholder.innerHTML = await response.text();
        placeholder.setAttribute("data-component-loaded", "true");
      } catch (error) {
        console.error(error);
        placeholder.innerHTML = "";
      }
    })
  );

  document.dispatchEvent(new CustomEvent("components:loaded"));
};

const initComponents = () => {
  if (document.querySelector(".hero-banner")) {
    initHeroBanner();
  }

  if (document.querySelector(".indicators")) {
    initIndicators();
  }

  if (document.querySelector(".population-clock")) {
    initPopulationClock();
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadComponents();
    initComponents();
  } catch (error) {
    console.error(error);
  }
});