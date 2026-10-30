// src/components/03-news-ticker/news-ticker.js

/**
 * يضاعف محتوى الشريط مرة واحدة لضمان حركة لا نهائية سلسة
 * عند استخدام keyframes تنتقل من translateX(0) إلى translateX(-50%).
 */
export function initNewsTicker() {
  const tracks = document.querySelectorAll(".news-ticker__track");

  tracks.forEach((track) => {
    if (track.dataset.cloned === "true") return;

    const originals = Array.from(track.children);
    if (!originals.length) return;

    originals.forEach((node) => {
      track.appendChild(node.cloneNode(true));
    });

    track.dataset.cloned = "true";
  });
}