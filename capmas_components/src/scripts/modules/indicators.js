export function initIndicators() {
    const sections = document.querySelectorAll(".indicators");
    if (!sections.length) return;

    sections.forEach((section) => {
        if (section.dataset.initialized === "true") return;

        const track = section.querySelector(".indicators__track");
        const prevBtn = section.querySelector(".indicators__nav-btn--prev");
        const nextBtn = section.querySelector(".indicators__nav-btn--next");
        if (!track || !prevBtn || !nextBtn) return;

        const firstCard = track.querySelector(".indicators__card");
        const gap = parseFloat(getComputedStyle(track).columnGap) || 74;
        const step = (firstCard ? firstCard.offsetWidth : 185) + gap;

        nextBtn.addEventListener("click", () => {
            track.scrollBy({ left: -step, behavior: "smooth" });
        });

        prevBtn.addEventListener("click", () => {
            track.scrollBy({ left: step, behavior: "smooth" });
        });

        section.dataset.initialized = "true";
    });
}