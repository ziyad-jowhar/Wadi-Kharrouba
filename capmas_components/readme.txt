capmas/
│
├── index.html                  ← هيكل فقط + روابط
│
├── assets/
│   ├── images/                 ← كل صور base64 مستخرجة
│   │   ├── logo.png
│   │   ├── hero.jpg
│   │   └── ...
│   └── fonts/
│
├── css/
│   ├── main.css                ← @import فقط
│   ├── base/
│   │   ├── variables.css       ← من :root
│   │   ├── reset.css
│   │   └── typography.css
│   ├── layout/
│   │   ├── header.css
│   │   ├── nav.css
│   │   └── footer.css
│   └── components/
│       ├── buttons.css
│       ├── news-ticker.css
│       ├── hero.css
│       ├── slider.css
│       ├── stat-card.css
│       └── dashboard.css
│
├── js/
│   ├── main.js
│   └── modules/
│       ├── nav.js
│       ├── slider.js
│       ├── ticker.js
│       └── counters.js
│
└── components/
    ├── header.html
    ├── main-nav.html
    ├── news-ticker.html
    ├── hero-banner.html
    ├── indicators-slider.html
    ├── stat-card.html          ← مكوّن ذري
    ├── population-dashboard.html
    └── footer.html