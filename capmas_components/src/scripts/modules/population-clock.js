const POPULATION_CLOCK_GOVERNORATES = {
  matrouh: {
    id: "matrouh",
    name: "مطروح",
    area: "160252.00",
    population: "608,860",
    density: "3.80",
  },
  alexandria: {
    id: "alexandria",
    name: "الإسكندرية",
    area: "2384.00",
    population: "5,5692,168",
    density: "2387.67",
  },
  cairo: {
    id: "cairo",
    name: "القاهرة",
    area: "2837.00",
    population: "10,544,138",
    density: "3716.62",
  },
};

const MAP_SVG_URL = "assets/icons/egy-map-1.svg";
const MAP_STYLE_ID = "pc-map-inline-style";
const MAP_DEFAULT_FILL = "#FFFFFF";
const MAP_DEFAULT_STROKE = "#D1D5DB";
const MAP_SELECTED_FILL = "#0986ED";

const pad2 = (value) => String(value).padStart(2, "0");

const CAIRO_ARABIC_DAYS = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

const CAIRO_ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const getCairoParts = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const map = {};
  parts.forEach((part) => {
    if (part.type !== "literal") map[part.type] = part.value;
  });

  const weekdayIndexMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: weekdayIndexMap[map.weekday] ?? now.getDay(),
  };
};

const renderDateTime = (section) => {
  const dateEl = section.querySelector("#pc-date");
  const timeEl = section.querySelector("#pc-time");
  if (!dateEl || !timeEl) return;

  const parts = getCairoParts();
  const dayName = CAIRO_ARABIC_DAYS[parts.weekday] || "";
  const monthName = CAIRO_ARABIC_MONTHS[parts.month - 1] || "";

  dateEl.textContent = `${dayName}, ${parts.day} ${monthName} ${parts.year}`;

  const hour12 = parts.hour % 12 || 12;
  const period = parts.hour < 12 ? "ص" : "م";
  const timeStr = `${pad2(hour12)}:${pad2(parts.minute)}:${pad2(parts.second)}${period}`;
  timeEl.textContent = `الساعة ${timeStr} حسب توقيت القاهرة`;
};

const renderGovernorate = (section, key) => {
  const gov = POPULATION_CLOCK_GOVERNORATES[key];
  if (!gov) return;

  const display = section.querySelector("#pc-gov-display");
  const areaValue = section.querySelector("#pc-area-value");
  const populationValue = section.querySelector("#pc-population-value");
  const densityValue = section.querySelector("#pc-density-value");

  if (display) display.textContent = gov.name;
  if (areaValue) areaValue.textContent = gov.area;
  if (populationValue) populationValue.textContent = gov.population;
  if (densityValue) densityValue.textContent = gov.density;
};

const ensureMapStyle = () => {
  if (document.getElementById(MAP_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = MAP_STYLE_ID;
  style.textContent = [
    ".map-container,.map-frame{width:100%;display:flex;align-items:center;justify-content:center;}",
    ".map-container svg,.map-frame svg{width:100%;max-width:450px;height:auto;display:block;overflow:visible;}",
    ".map-container svg path,.map-frame svg path{fill:#FFFFFF;stroke:#D1D5DB;cursor:pointer;transition:fill 0.3s ease;}",
    ".map-container svg path:hover,.map-frame svg path:hover{fill:#E5E7EB;}",
    ".map-container svg path.is-selected,.map-frame svg path.is-selected{fill:#0986ED !important;}",
  ].join("");
  document.head.appendChild(style);
};

const getMapSvg = (section) =>
  section.querySelector(".map-container svg, .map-frame svg");

const resetAllPaths = (svg) => {
  svg.querySelectorAll("path").forEach((node) => {
    node.classList.remove("is-selected");
    node.style.setProperty("fill", MAP_DEFAULT_FILL, "important");
    node.style.setProperty("stroke", MAP_DEFAULT_STROKE, "important");
    node.style.setProperty("transition", "fill 0.3s ease", "important");
    node.style.cursor = "pointer";
  });
  svg.querySelectorAll(".is-selected").forEach((node) => {
    node.classList.remove("is-selected");
  });
};

const highlightGovernorate = (svg, key) => {
  if (!svg) return;
  resetAllPaths(svg);

  const gov = POPULATION_CLOCK_GOVERNORATES[key];
  const targetId = gov ? gov.id : key;
  if (!targetId) return;

  const target = svg.querySelector(`#${targetId}`);
  if (!target) return;

  if (target.tagName.toLowerCase() === "path") {
    target.classList.add("is-selected");
    target.style.setProperty("fill", MAP_SELECTED_FILL, "important");
  } else {
    target.classList.add("is-selected");
    target.querySelectorAll("path").forEach((node) => {
      node.classList.add("is-selected");
      node.style.setProperty("fill", MAP_SELECTED_FILL, "important");
    });
    if (target.tagName.toLowerCase() === "g" && !target.querySelector("path")) {
      target.style.setProperty("fill", MAP_SELECTED_FILL, "important");
    }
  }
};

const findKeyBySvgId = (svgId) => {
  if (!svgId) return null;
  const normalized = String(svgId).toLowerCase();
  return (
    Object.keys(POPULATION_CLOCK_GOVERNORATES).find(
      (key) =>
        POPULATION_CLOCK_GOVERNORATES[key].id.toLowerCase() === normalized
    ) || null
  );
};

const resolveGovernorateKeyFromNode = (svg, node) => {
  let current = node;
  while (current && current !== svg) {
    const id = current.getAttribute && current.getAttribute("id");
    if (id) {
      const key = findKeyBySvgId(id);
      if (key) return key;
    }
    current = current.parentElement;
  }
  return null;
};

const loadInteractiveMap = async (section, select) => {
  const mapContainer = section.querySelector(".map-container, .map-frame");
  if (!mapContainer) return;

  try {
    ensureMapStyle();
    const response = await fetch(MAP_SVG_URL);
    if (!response.ok) {
      throw new Error(`تعذّر تحميل الخريطة: ${MAP_SVG_URL} (${response.status})`);
    }
    mapContainer.innerHTML = await response.text();

    const svg = mapContainer.querySelector("svg");
    if (!svg) return;

    resetAllPaths(svg);

    svg.querySelectorAll("[id]").forEach((node) => {
      if (node.tagName.toLowerCase() === "svg") return;
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        const key = resolveGovernorateKeyFromNode(svg, node);
        if (!key) return;
        if (select) {
          select.value = key;
          select.dispatchEvent(new Event("change"));
        } else {
          highlightGovernorate(svg, key);
        }
      });
    });

    if (select) {
      highlightGovernorate(svg, select.value);
    }
  } catch (error) {
    console.error(error);
  }
};

export function initPopulationClock() {
  const section = document.querySelector(".population-clock");
  if (!section) return;
  if (section.dataset.initialized === "true") return;

  renderDateTime(section);
  const clockTimer = setInterval(() => renderDateTime(section), 1000);

  const select = section.querySelector("#pc-gov-select");

  if (select) {
    renderGovernorate(section, select.value);
    select.addEventListener("change", () => {
      renderGovernorate(section, select.value);
      const svg = getMapSvg(section);
      if (svg) highlightGovernorate(svg, select.value);
    });
  }

  loadInteractiveMap(section, select);

  section.addEventListener("population-clock:destroy", () => {
    clearInterval(clockTimer);
  });

  section.dataset.initialized = "true";
}