# 📊 User Manual: Client Analytics v17.0

> [!CAUTION]
> ## 🔒 SECURITY — YOUR DATA NEVER LEAVES YOUR COMPUTER
>
> **This tool operates 100% inside your browser. No data, no files, no client information is ever sent to any server or third party.**
> Every calculation, every chart, every table — it all happens locally on your machine.
> You can use it completely offline (except for the live currency rate fetch, which is optional and contains no client data).

---

**Compatible files:** `.csv` · `.xlsx` · `.xls`
**Supported languages:** 🇺🇦 Ukrainian · 🇬🇧 English (toggle in the top-right corner)

---

## 🚀 1. Getting Started

1. Open the tool link in your browser.
2. Click the **"Upload File"** button and select your export file (`.csv`, `.xlsx`, or `.xls`).
3. A **"Processing Data…"** loading screen appears while the tool:
   - Auto-detects the header row and all column positions.
   - Converts all currencies to Euro (€).
   - Runs the full analysis.
4. The full dashboard appears automatically — no configuration needed.

> **Language:** Switch between Ukrainian and English at any time using the **UA / EN** toggle in the top-right corner. All text, charts, and labels update instantly.

---

## 📱 2. Installing the App (PWA)

You can install this tool as a native application on your computer or phone. This allows you to work offline and launch it directly from your desktop/home screen.

- **Desktop (Chrome/Edge):** Click the install icon (monitor with a down arrow) on the right side of the address bar.
- **Mobile (iOS):** Tap "Share" → "Add to Home Screen".
- **Mobile (Android):** Tap the menu (three dots) → "Install App" or "Add to Home Screen".

---

## 🔧 3. Column Mapping Wizard 

Occasionally, your file might have different column names than the tool expects. If the auto-detection fails to find critical columns:

1. A **"Column Mapping"** window will appear automatically.
2. It lists the required fields (e.g., Client Name, Revenue, Country).
3. Use the dropdown menus to select the corresponding column from your file for each field.
4. Click **Confirm** to proceed with the analysis.

You can also open this wizard manually at any time by clicking the **Settings (Gear) Icon** next to the language toggle.

---

## ⚙️ 4. Global Filters (Analysis Settings Panel)

The **Analysis Settings** panel appears just below the header after a file is loaded.

| Filter                      | What it does                                                       |
| --------------------------- | ------------------------------------------------------------------ |
| 📤 **Origin Countries**      | Show only shipments from selected origin countries (e.g., LT only) |
| 📥 **Destination Countries** | Show only shipments going to selected countries (e.g., DE, PL, CZ) |

- Use **"All"** / **"None"** buttons for quick bulk selection.
- The entire dashboard — all KPIs, charts, and the table — **recalculates instantly** with every change.

---

## 💰 5. Currency & Exchange Rates

All revenue values are normalised to **Euro (€)** regardless of the original currency in the file.

| Badge              | Meaning                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| 🟢 **Rates: Live**  | Today's exchange rates were fetched successfully from the internet                             |
| 🟡 **Rates: Fixed** | No internet access; stable fallback averages are used (UAH, PLN, USD, GBP, CZK, RON, MDL, HUF) |

The currency badge appears in the header once a file is loaded.

---

## 🏆 6. ABC Analysis — VIP Client Identification

Clients are automatically segmented using the **Pareto principle**:

| Class         | Revenue share            | Who they are                                  |
| ------------- | ------------------------ | --------------------------------------------- |
| 🟡 **A (VIP)** | Top 80% of total revenue | Your most valuable clients — prioritise them  |
| ⚪ **B**       | Next 15%                 | Stable "middle" clients with growth potential |
| 🟠 **C**       | Remaining 5%             | Smaller or occasional clients                 |

**Interactive:** Click any ABC card to **filter the detailed table** to that class only. Click again to clear the filter.

---

## 📈 7. KPI Cards

### Revenue & Clients
| Card               | Description                            |
| ------------------ | -------------------------------------- |
| Total Clients      | Unique senders in the filtered dataset |
| Total Revenue      | Sum of all shipment values in EUR      |
| Avg Check (Global) | Total revenue ÷ total shipments        |

### Weight
| Card                  | Description                                              |
| --------------------- | -------------------------------------------------------- |
| Total Weight          | Sum of all shipment weights (kg)                         |
| Avg Weight / Shipment | Average kg per shipment                                  |
| Revenue per kg        | Total revenue ÷ total weight — identifies premium routes |
| Shipments with Weight | Count of shipments that have a weight value              |

---

## 📊 8. Charts

The dashboard contains **16 interactive charts** grouped by topic:

| Group                   | Charts                                                                    |
| ----------------------- | ------------------------------------------------------------------------- |
| **Countries**           | Top destination countries by revenue · Top countries by avg check         |
| **Clients — Financial** | Top 10 clients by revenue · Top 10 clients by avg check                   |
| **Clients — Volume**    | Top 10 clients by shipment count · Top destinations of top-10 clients     |
| **Channels**            | Sender channel distribution · Receiver channel distribution               |
| **Channel Revenue**     | Revenue by sender channel · Channel flow matrix (sender → receiver pairs) |
| **Weight**              | Avg weight by direction (top 10) · Avg weight by channel                  |
| **Cities**              | Top 10 sender cities · Top 10 receiver cities                             |
| **Routes**              | Top 10 city-to-city routes · Revenue per kg by direction                  |

**Tips:**
- **Hover** over any bar to see the exact value.
- **Click a country bar** (in the Countries chart) to instantly filter the client table to that destination.
- **Click a client name on the X-axis** (in the Top Destinations chart) to jump to that client in the table.
- **Click a bar** in the Top-10-by-Count chart to scroll to that client.

---

## 🔢 9. Channel & Weight Analytics

Two summary panels appear above the charts:

- **Channel Preferences by ABC Class** — shows which delivery channels (e.g. post office, courier, terminal) are preferred by Class A, B, and C clients separately. Useful for planning service offerings per segment.
- **Avg Weight by ABC Class** — average shipment weight for each ABC class. Helps identify whether VIP clients tend to ship heavier or lighter parcels.

---

## 🗺️ 10. Origin Breakdown

The **"Revenue by Origin Country"** section shows a card per origin country with:
- Country flag and ISO code.
- Total revenue generated from that origin.
- Percentage contribution to the overall total.

Useful for comparing the performance of different offices or branches.

---

## 📋 11. Detailed Client Table

The table lists every client aggregated from the filtered data.

### Sorting
Click any column header to sort the entire list (not just the visible page):

| Column        | Description                         |
| ------------- | ----------------------------------- |
| Client        | Sender name                         |
| ABC           | Client class (A / B / C)            |
| Segment       | Client segment from the source file |
| Revenue (EUR) | Total revenue converted to EUR      |
| Count         | Number of shipments                 |
| Weight (kg)   | Total weight across all shipments   |
| Avg Check     | Revenue ÷ shipment count            |
| Where (Top)   | Most frequent destination countries |
| What (Top)    | Most frequently shipped items       |

### Sticky Headers
The table header and the first column ("Client") now stay visible while scrolling, making it easier to read large datasets.

### Search
Type in the **search box** above the table to filter by client name. Results update 300 ms after you stop typing.

### Pagination
- **50 clients per page**.
- Use **[Prev]** / **[Next]** buttons at the bottom to navigate.
- The total row count is shown at the bottom left.

---

## 👤 12. Client Detail Card

Click any row in the table to open the full **Client Card**. It shows:

| Section                           | Content                                          |
| --------------------------------- | ------------------------------------------------ |
| 📞 Phone                           | Sender phone number — ready to copy              |
| Revenue / ABC / Count / Avg Check | Core financial metrics                           |
| Weight / Avg Weight               | Total and per-shipment weight                    |
| 📤 Sender Channels                 | Which channels this client uses to send parcels  |
| 📥 Receiver Channels               | Which channels their recipients use to collect   |
| 🏙️ Sender Cities (Top 5)           | Cities this client ships from most often         |
| 🏙️ Receiver Cities (Top 5)         | Cities their recipients are in                   |
| 🌍 Geography                       | Full destination breakdown with flags and counts |
| 📦 Items                           | Top items this client has shipped                |
| Origin / Segment                  | Country and segment label                        |

Close by clicking **[Close]**, pressing `Esc`, or clicking outside the card.

---

## 🔍 13. Segment Filter

Below the charts, a row of **segment buttons** is generated from the data. Click one to filter the table to that segment only. The active filter label is shown above the table. Click the button again or the **"✖"** label to clear it.

---

## 💡 FAQ

**Q: Why do I see country codes (LT, PL, UA) instead of full names?**
A: ISO-2 codes are used for compactness and precision. Hover over a flag in the charts for the full name. The detailed table and modal show full names.

**Q: Can I upload a full-year report with a large file?**
A: Yes. Files up to **250 MB and beyond** have been tested and work stably. CSV files of that size tend to process faster than Excel because they are parsed as a text stream rather than decoded as binary. Actual limits depend on your device's available RAM.

**Q: What does the ⚠️ icon next to a client name mean?**
A: This is a **"Hidden Business"** indicator. The client is registered as a *Private Person* in the system but ships frequently enough to suggest a business use pattern. Consider offering them a business tariff or rate.

**Q: Can I switch the interface language while a file is loaded?**
A: Yes. Toggle UA ↔ EN at any time — all text, KPI labels, and chart labels update immediately without reloading the file.

**Q: The exchange rate badge shows "Fixed". Is the data accurate?**
A: Yes. The fallback rates are stable, regularly reviewed averages. For most reporting purposes the difference vs. live rates is negligible. If precise real-time conversion is critical, ensure internet access before uploading.

**Q: Can I filter by both origin country AND destination country at the same time?**
A: Yes. Both filters work together. The dashboard shows only shipments that match all selected origins AND all selected destinations simultaneously.

---

*Developed by Roman Novobranets. All rights reserved © 2026.*
