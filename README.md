# Client Analytics Tool v16.0

**Developer:** Roman Novobranets
**Type:** Static Multi-File SPA (Client-Side Only)
**Version:** 16.0 | February 2026
**Deployment:** Netlify

---

## Overview

Client Analytics is a browser-based tool for analysing shipment data exported from logistics/courier management systems. Upload a CSV or Excel file and get instant dashboards covering revenue, ABC segmentation, channel analytics, weight metrics, city-level geography, and more — no server required.

---

## Quick Start

1. Open the hosted URL (Netlify) or any static file server serving the project root.
2. Click **Upload File** and select a `.csv`, `.xlsx`, or `.xls` export.
3. The dashboard populates automatically. Use the global filters, search, and segment buttons to drill down.

---

## Technology Stack

| Layer | Library / Version |
|---|---|
| Markup / Logic | HTML5, ES6+ Modules, CSS3 |
| Styling | Tailwind CSS (CDN) |
| CSV Parsing | PapaParse v5.3.0 |
| Excel Parsing | SheetJS / xlsx (latest) |
| Charts | Chart.js + chartjs-plugin-datalabels v2.2.0 |
| Country Flags | flag-icons v7.0.0 (Windows-compatible CSS library) |
| Currency API | open.er-api.com (free, no API key) |

---

## Project Structure

```
client-analytics_new/
├── index.html          # Entry point — HTML shell + CDN imports
├── netlify.toml        # Netlify config (publish dir + JS MIME header)
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

### 1. File Processing

1. User selects a file via `<input type="file">`.
2. `handleFileUpload()` routes by extension: `.csv` → PapaParse; `.xlsx`/`.xls` → SheetJS binary array.
3. `findHeaderAndProcess()` scans the first 30 rows to locate the data header (identified by the presence of `"Контрагент відправник по МЕН"` and `"Shipment вартість послуг"` in the same row).
4. Column indices are mapped by name (with fallback substring search) in `mapColumnIndices()`.
5. Parsed data is stored in `state.rawRows` and `state.rawColIndices`.

**Required columns (Ukrainian names expected in source file):**

| Column | Purpose |
|---|---|
| `Контрагент відправник по МЕН` | Client name |
| `Shipment вартість послуг` | Shipment revenue |
| `Shipment валюта вартості послуг` | Currency code |
| `Країна-відправник` | Origin country (ISO-2) |
| `Країна отримувач` | Destination country (ISO-2) |
| `Тип відправника по МЕН` | Client type (Private / Business) |
| `Опис відправлення` | Shipment description / items |
| `Сегмент відправника_` | Client segment |
| `IWB дата створення` / `Дата` | Shipment date |
| `Тип підрозділу відправника` | Sender channel |
| `Тип підрозділу отримувача` | Receiver channel |
| `Розрахункова вага` | Calculated weight (kg) |
| `Місто відправник` | Sender city |
| `Місто отримувач` | Receiver city |
| `тел отправитель` / `Телефон відправника` | Sender phone |

### 2. Currency Conversion

- Base currency: **EUR (€)**.
- On startup `fetchCurrencyRates()` calls `https://open.er-api.com/v6/latest/EUR`.
  - Success → rates stored in `state.currentRates`, badge shows **"Live"**.
  - Failure → `FALLBACK_RATES` used (UAH 42.5, PLN 4.3, USD 1.08, GBP 0.85, CZK 25.3, RON 4.97, MDL 19.3, HUF 390), badge shows **"Fixed"**.
- Each row's `revenueLocal` is divided by the corresponding rate to produce `revenueEur`.

### 3. Analysis Engine (`analysis.js`)

`analyzeData(rows)` performs a single-pass loop and computes:

- **Client aggregates:** total revenue, shipment count, avg check, top items, destinations.
- **ABC classification (Pareto):** clients sorted by revenue descending; cumulative share determines class — A ≤ 80%, B ≤ 95%, C > 95%.
- **Country stats:** revenue and count per destination country.
- **Origin breakdown:** revenue per origin country.
- **Channel metrics:** sender/receiver channel counts, revenue per channel, shipment counts, channel flow matrix (sender→receiver pairs).
- **Weight metrics:** total weight, avg weight per shipment, revenue per kg, weight by direction and by channel.
- **City metrics:** top sender/receiver cities by revenue, top city-to-city routes.
- **Cross-cuts:** channel preferences per ABC class, avg weight per ABC class.
- **Date range:** auto-detected `min` and `max` shipment date shown in the period badge.

### 4. Filtering & Reactivity

- **Global filters** (origin / destination country checkboxes) are built dynamically from detected countries in `setupGlobalFilters()`.
- Any filter change calls `recalculateDashboard()` which re-filters `rawRows` → `analyzeData()` → full dashboard re-render.
- **ABC filter:** clicking an ABC card on the dashboard toggles a class filter on the client table.
- **Segment filter:** buttons generated per segment; clicking filters the table without re-running analysis.
- **Country filter:** clicking a bar in the country revenue chart filters the client table to that destination.
- **Search:** 300 ms debounce on the text input in `filterTableSearch()`.

---

## Dashboard Sections

| Section | Description |
|---|---|
| ABC Cards | Click-to-filter cards showing client counts for classes A / B / C |
| KPI Row 1 | Total Clients, Total Revenue, Avg Check (Global) |
| KPI Row 2 | Total Weight, Avg Weight/Shipment, Revenue/kg, Shipments with Weight |
| Channel Preferences by ABC | Top sender channels used by class A / B / C clients |
| Avg Weight by ABC | Average shipment weight per ABC class |
| Origin Breakdown | Revenue contribution cards per origin country (flag + % + €) |
| Charts Row 1 | Top Destination Countries by Revenue / by Avg Check |
| Charts Row 2 | Top 10 Clients by Revenue / by Avg Check |
| Charts Row 3 | Top 10 Clients by Count / Top 10 Destinations of revenue leaders |
| Charts Row 4 | Sender Channel Distribution / Receiver Channel Distribution |
| Charts Row 5 | Revenue by Sender Channel / Channel Flow Matrix |
| Charts Row 6 | Avg Weight by Direction (Top 10) / Avg Weight by Channel |
| Charts Row 7 | Top 10 Sender Cities / Top 10 Receiver Cities |
| Charts Row 8 | Top 10 City-to-City Routes / Revenue per kg by Direction |
| Segment Filter | One button per segment; filters the detailed table |
| Detailed Table | Paginated, sortable list with search; click row to open client modal |

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

## Key Functions Reference

| Function | Module | Purpose |
|---|---|---|
| `handleFileUpload()` | fileProcessor.js | Routes CSV vs Excel, shows loading overlay |
| `findHeaderAndProcess()` | fileProcessor.js | Heuristic scan for data header row |
| `mapColumnIndices()` | fileProcessor.js | Maps column names to array indices |
| `fetchCurrencyRates()` | currency.js | Live rate fetch with fallback |
| `analyzeData(rows)` | analysis.js | Core math — all aggregations in one pass |
| `recalculateDashboard()` | analysis.js | Master controller: filter → analyse → render |
| `setupGlobalFilters()` | filters.js | Builds origin/destination checkboxes |
| `applyCombinedFilters()` | filters.js | Applies segment + ABC + country + search filters |
| `renderDashboard(result)` | render.js | Updates KPI values, origin cards, segment buttons |
| `renderAllCharts(result)` | charts.js | Draws or updates all 16 Chart.js instances |
| `renderTable(clients)` | table.js | Renders current page slice of the sorted list |
| `sortTable(key)` | table.js | In-memory sort, resets to page 1 |
| `changePage(delta)` | table.js | Pagination: +1 / -1 page |
| `openModal(client)` | modal.js | Populates and animates the detail modal |
| `updateInterfaceLanguage()` | i18n.js | Applies UA / EN translation to all `data-i18n` elements |

---

## Internationalisation (UA / EN)

The header contains a UA ↔ EN toggle. All text strings are defined in `TRANSLATIONS` inside `i18n.js`. Every static text element uses a `data-i18n` attribute; `updateInterfaceLanguage()` iterates them on toggle. Chart dataset labels are also updated and charts are re-rendered.

---

## Performance

### Pagination
`renderTable()` renders only **50 rows per page** (`ITEMS_PER_PAGE` in config.js). Sorting operates on the full in-memory `displayedClientData` array; only the current page slice goes to the DOM. This keeps the UI responsive regardless of total client count.

### Search Debounce
The search input fires `filterTableSearch()` only after **300 ms** of inactivity, preventing DOM thrashing during fast typing.

### Flag Rendering
Windows does not render emoji country flags. The app uses the **flag-icons** CSS library (`<span class="fi fi-xx">`) instead of Unicode emoji, ensuring correct flag display on all platforms.

### File Size
The app processes files client-side in the browser. Files of **250 MB+** (Excel and CSV) have been tested successfully. Actual limits depend on the device RAM and the browser tab memory cap. For very large files, CSV tends to parse faster than Excel due to text-stream processing vs. full binary decode.

---

## Deployment

**Platform:** Netlify (static hosting, no server required).

**Method:** Push to the connected GitHub repository or drag-and-drop the project folder in the Netlify dashboard.

**`netlify.toml`** sets:
- `publish = "."` — serves from the project root.
- `Content-Type: application/javascript` for `js/*.js` — required for ES module `import` to work correctly when served over HTTP.

```toml
[build]
  publish = "."

[[headers]]
  for = "/js/*.js"
  [headers.values]
    Content-Type = "application/javascript"
```

> **Note:** ES modules require files to be served over HTTP/HTTPS. Opening `index.html` directly from the filesystem (`file://`) will cause `import` errors. Always use Netlify, a local dev server (`npx serve .`, `python -m http.server`, etc.), or VS Code Live Server.

---

## Supported Countries

The app currently maps the following ISO-2 codes to full country names (UA/EN):

`AT` `CN` `CZ` `DE` `EE` `ES` `FR` `GB` `HU` `IT` `LT` `LV` `MD` `NL` `PL` `RO` `SK`

Unknown codes are displayed as-is (uppercase). To add a country, add an entry to `COUNTRY_MAP` in `js/config.js`.

---

## Changelog

### v16.0 (February 2026)
- **Architecture refactor:** monolithic single HTML file split into ES module structure (`js/` directory with 10 dedicated modules).
- **18 new analytics:** channel distribution, channel revenue, channel flow matrix, weight KPIs, weight by direction/channel, city-level sender/receiver stats, city-to-city routes, revenue per kg.
- **8 new charts** added (Rows 4–8 in the dashboard).
- **Bilingual UI:** UA ↔ EN language toggle with full translation coverage.
- **Channel preferences by ABC class** panel.
- **Average weight by ABC class** panel.
- Netlify `Content-Type` header added for correct ES module serving.

### v14.1 (prior)
- Single `index.html` SPA.
- CSV / Excel upload, currency conversion, ABC analysis, country charts, paginated table, client modal.

---

## License

© Roman Novobranets. All rights reserved.
