# Client Analytics Tool v17.0

**Developer:** Roman Novobranets
**Type:** Static Multi-File SPA (Client-Side Only) + PWA (Installable)
**Version:** 17.0 | February 2026
**Deployment:** Netlify / Static Server

---

## Overview

Client Analytics is a browser-based tool for analysing shipment data exported from logistics/courier management systems. Upload a CSV or Excel file and get instant dashboards covering revenue, ABC segmentation, channel analytics, weight metrics, city-level geography, and more — no server required.

**New in v17.0:** Now supports installation as a native app (PWA) and features a smart Column Mapping Wizard for handling non-standard file formats.

---

## Quick Start

1. Open the hosted URL (Netlify) or any static file server serving the project root.
2. Click **Upload File** and select a `.csv`, `.xlsx`, or `.xls` export.
3. The dashboard populates automatically. Use the global filters, search, and segment buttons to drill down.

### Installing as App (PWA)

This tool is a Progressive Web App (PWA). You can install it on your device for offline access and a native app-like experience:
- **Chrome/Edge:** Click the "Install" icon in the address bar.
- **Mobile (iOS/Android):** Use "Add to Home Screen" from the browser menu.

---

## Technology Stack

| Layer          | Library / Version                                  |
| -------------- | -------------------------------------------------- |
| Markup / Logic | HTML5, ES6+ Modules, CSS3                          |
| Styling        | Tailwind CSS (CDN)                                 |
| CSV Parsing    | PapaParse v5.3.0                                   |
| Excel Parsing  | SheetJS / xlsx (latest)                            |
| Charts         | Chart.js + chartjs-plugin-datalabels v2.2.0        |
| Country Flags  | flag-icons v7.0.0 (Windows-compatible CSS library) |
| Currency API   | open.er-api.com (free, no API key)                 |
| PWA Support    | Service Worker (sw.js) + Web Manifest              |

---

## Project Structure

```
client-analytics_new/
├── index.html          # Entry point — HTML shell + CDN imports
├── netlify.toml        # Netlify config (publish dir + JS MIME header)
├── manifest.json       # PWA metadata
├── sw.js               # Service Worker for offline caching
├── css/
│   └── styles.css      # Custom styles on top of Tailwind
└── js/
    ├── app.js          # Entry-point module — wires all modules, registers listeners
    ├── config.js       # Constants, fallback rates, country map, shared state object
    ├── analysis.js     # Core data engine: aggregation, ABC classification, all metrics
    ├── fileProcessor.js# File upload handler, CSV/Excel parsing, column mapping
    ├── currency.js     # Live rate fetch + fallback logic
    ├── filters.js      # Global origin/destination checkboxes, segment/ABC/country filter
    ├── render.js       # Dashboard KPIs, origin breakdown cards, segment buttons
    ├── charts.js       # All Chart.js chart construction (16 charts)
    ├── table.js        # Paginated client table, sort, pagination controls
    ├── modal.js        # Client detail modal — population and animation
    └── i18n.js         # UA / EN translations, language switch, flag helpers
```

---

## Architecture & Data Flow

### 1. File Processing & Column Mapping

1. User selects a file via `<input type="file">`.
2. `handleFileUpload()` routes by extension: `.csv` → PapaParse; `.xlsx`/`.xls` → SheetJS binary array.
3. `findHeaderAndProcess()` scans the first 30 rows to locate the data header.
4. **Smart Mapping:** `mapColumnIndices()` attempts to map columns automatically by name.
5. **Wizard Fallback:** If critical columns are missing, the **Column Mapping Wizard** modal appears, allowing the user to manually select columns from their file headers.
6. Parsed data is stored in `state.rawRows`.

**Required columns (Ukrainian names expected in source file):**

| Column                                    | Purpose                          |
| ----------------------------------------- | -------------------------------- |
| `Контрагент відправник по МЕН`            | Client name                      |
| `Shipment вартість послуг`                | Shipment revenue                 |
| `Shipment валюта вартості послуг`         | Currency code                    |
| `Країна-відправник`                       | Origin country (ISO-2)           |
| `Країна отримувач`                        | Destination country (ISO-2)      |
| `Тип відправника по МЕН`                  | Client type (Private / Business) |
| `Опис відправлення`                       | Shipment description / items     |
| `Сегмент відправника_`                    | Client segment                   |
| `IWB дата створення` / `Дата`             | Shipment date                    |
| `Тип підрозділу відправника`              | Sender channel                   |
| `Тип підрозділу отримувача`               | Receiver channel                 |
| `Розрахункова вага`                       | Calculated weight (kg)           |
| `Місто відправник`                        | Sender city                      |
| `Місто отримувач`                         | Receiver city                    |
| `тел отправитель` / `Телефон відправника` | Sender phone                     |

### 2. Currency Conversion

- Base currency: **EUR (€)**.
- On startup `fetchCurrencyRates()` calls `https://open.er-api.com/v6/latest/EUR`.
  - Success → rates stored in `state.currentRates`, badge shows **"Live"**.
  - Failure → `FALLBACK_RATES` used (UAH 51.13, PLN 4.22, USD 1.19, GBP 0.87, CZK 24.26, RON 5.09, MDL 20.11, HUF 379.5), badge shows **"Fixed"**.
- Each row's `revenueLocal` is divided by the corresponding rate to produce `revenueEur`.

### 3. Analysis Engine (`analysis.js`)

`analyzeData(rows)` performs a single-pass loop and computes:

- **Client aggregates:** total revenue, shipment count, avg check, top items, destinations.
- **ABC classification (Pareto):** clients sorted by revenue descending; cumulative share determines class — A ≤ 80%, B ≤ 95%, C > 95%.
- **Country stats:** revenue and count per destination country.
- **Origin breakdown:** revenue per origin country.
- **Channel metrics:** sender/receiver channel counts, revenue per channel, shipment counts, channel flow matrix.
- **Weight metrics:** total weight, avg weight per shipment, revenue per kg, weight by direction and by channel.
- **City metrics:** top sender/receiver cities by revenue, top city-to-city routes.
- **Cross-cuts:** channel preferences per ABC class, avg weight per ABC class.
- **Date range:** auto-detected `min` and `max` shipment date shown in the period badge.

### 4. Filtering & Reactivity

- **Global filters** (origin / destination country checkboxes) are built dynamically from detected countries in `setupGlobalFilters()`.
- Any filter change calls `recalculateDashboard()` which re-filters `rawRows` → `analyzeData()` → full dashboard re-render.
- **Sticky Table Headers:** Detailed table features sticky headers and first column for better navigation of large datasets.
- **Search:** 300 ms debounce on the text input in `filterTableSearch()`.

---

## Dashboard Sections

| Section                    | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| ABC Cards                  | Click-to-filter cards showing client counts for classes A / B / C    |
| KPI Row 1                  | Total Clients, Total Revenue, Avg Check (Global)                     |
| KPI Row 2                  | Total Weight, Avg Weight/Shipment, Revenue/kg, Shipments with Weight |
| Channel Preferences by ABC | Top sender channels used by class A / B / C clients                  |
| Avg Weight by ABC          | Average shipment weight per ABC class                                |
| Origin Breakdown           | Revenue contribution cards per origin country (flag + % + €)         |
| Charts Row 1               | Top Destination Countries by Revenue / by Avg Check                  |
| Charts Row 2               | Top 10 Clients by Revenue / by Avg Check                             |
| Charts Row 3               | Top 10 Clients by Count / Top 10 Destinations of revenue leaders     |
| Charts Row 4               | Sender Channel Distribution / Receiver Channel Distribution          |
| Charts Row 5               | Revenue by Sender Channel / Channel Flow Matrix                      |
| Charts Row 6               | Avg Weight by Direction (Top 10) / Avg Weight by Channel             |
| Charts Row 7               | Top 10 Sender Cities / Top 10 Receiver Cities                        |
| Charts Row 8               | Top 10 City-to-City Routes / Revenue per kg by Direction             |
| Segment Filter             | One button per segment; filters the detailed table                   |
| Detailed Table             | Paginated, sortable list with search; click row to open client modal |

---

## Client Detail Modal

Click any row in the detailed table to open a full profile for that client:

- Revenue, ABC class, shipment count, avg check.
- Total weight and avg weight.
- Sender / receiver channels (all, ranked).
- Top 5 sender and receiver cities.
- Full destination geography with flag and count.
- Top items shipped.
- Phone number, origin country, segment.

---

## Internationalisation (UA / EN)

The header contains a UA ↔ EN toggle. All text strings are defined in `TRANSLATIONS` inside `i18n.js`. Every static text element uses a `data-i18n` attribute; `updateInterfaceLanguage()` iterates them on toggle. Chart dataset labels are also updated and charts are re-rendered.

---

## PWA & Performance

### Progressive Web App (PWA)
The application includes a `serviceWorker` (`sw.js`) and `manifest.json`, making it a fully installable PWA. It caches core assets (HTML, CSS, JS, CDN libs) to ensure:
- **Instant load times** on repeat visits.
- **Offline Capability:** The app works without an internet connection (currency rates fall back to hardcoded defaults).

### Optimization
- **Pagination:** Renders only 50 rows per page to keep DOM size low.
- **Flag Icons:** Uses `flag-icons` CSS library instead of emoji for cross-platform consistency (Windows/Android/iOS).
- **Client-Side Processing:** successfully tests with files 250MB+ (CSV recommended for largest datasets).

---

## Deployment

**Platform:** Netlify (static hosting, no server required).

**`netlify.toml`** sets:
- `publish = "."`
- `Content-Type: application/javascript` for `js/*.js` (required for ES modules).

```toml
[build]
  publish = "."

[[headers]]
  for = "/js/*.js"
  [headers.values]
    Content-Type = "application/javascript"
```

---

## Changelog

### v17.0 (February 2026)
- **PWA Support:** Added Service Worker and Manifest for installation and offline support.
- **Column Mapping Wizard:** New UI allows users to manually map columns if auto-detection fails.
- **Sticky Headers:** Improved table navigation with sticky header and first column.
- **UI Polish:** Replaced browser alerts with non-intrusive toast notifications (planned/partial support) and improved mobile responsiveness.
- **Performance:** Optimized chart rendering and data processing headers.

### v16.0 (February 2026)
- **Architecture refactor:** monolithic single HTML file split into ES module structure (`js/` directory with 10 dedicated modules).
- **18 new analytics:** channel distribution, channel revenue, channel flow matrix, weight KPIs, weight by direction/channel, city-level sender/receiver stats, city-to-city routes, revenue per kg.
- **8 new charts** added (Rows 4–8 in the dashboard).
- **Bilingual UI:** UA ↔ EN language toggle with full translation coverage.
- **Netlify `Content-Type` header** added for correct ES module serving.

### v14.1 (prior)
- Single `index.html` SPA.
- CSV / Excel upload, currency conversion, ABC analysis, country charts, paginated table, client modal.

---

## License

© Roman Novobranets. All rights reserved.
