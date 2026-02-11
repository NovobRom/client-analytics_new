// --- App: entry point — wires all modules together ---
// Load order: CDN scripts (Chart.js, Papa, XLSX) in <head> → this module via
// <script type="module" src="js/app.js"> just before </body>.

import { state } from './config.js';
import { TRANSLATIONS, updateInterfaceLanguage } from './i18n.js';
import { fetchCurrencyRates, updateRateBadge } from './currency.js';
import { handleFileUpload } from './fileProcessor.js';
import {
    setRecalcCallback,
    toggleAll,
    clearSearch,
    clearCountryFilter,
    toggleAbcFilter,
    filterBySegment,
    filterTableSearch,
} from './filters.js';
import { recalculateDashboard } from './analysis.js';
import { sortTable, changePage, renderTable } from './table.js';
import { closeModal } from './modal.js';
import { renderSegmentButtons } from './render.js';

// ── 1. Register Chart.js plugin (must run before any chart is drawn) ──────────
Chart.register(ChartDataLabels);

// ── 2. Footer year ────────────────────────────────────────────────────────────
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ── 3. Break analysis ↔ filters circular dependency via callback ──────────────
setRecalcCallback(recalculateDashboard);

// ── 4. Event listeners ────────────────────────────────────────────────────────

// File upload
document.getElementById('csvInput').addEventListener('change', handleFileUpload);

// Search with 300 ms debounce
let searchTimeout;
document.getElementById('searchTable').addEventListener('keyup', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterTableSearch, 300);
});

// Language toggle
document.getElementById('langToggle').addEventListener('change', function () {
    state.currentLang = this.checked ? 'en' : 'ua';
    updateInterfaceLanguage();
    updateRateBadge();

    // Update chart dataset labels then re-render if data is loaded
    if (Object.keys(state.charts).length > 0) {
        const t = TRANSLATIONS[state.currentLang];
        if (state.charts.revenue)         state.charts.revenue.data.datasets[0].label         = t.chartLabelRev;
        if (state.charts.avgCheck)        state.charts.avgCheck.data.datasets[0].label        = t.chartLabelAvg;
        if (state.charts.count)           state.charts.count.data.datasets[0].label           = t.chartLabelCount;
        if (state.charts.revenueCountry)  state.charts.revenueCountry.data.datasets[0].label  = t.chartLabelRev;
        if (state.charts.avgCheckCountry) state.charts.avgCheckCountry.data.datasets[0].label = t.chartLabelAvg;
        if (state.charts.channelRevenue)  state.charts.channelRevenue.data.datasets[0].label  = t.chartLabelRev;
        if (state.charts.weightDirection) state.charts.weightDirection.data.datasets[0].label  = t.chartLabelAvgWeight || 'Avg Weight (kg)';
        if (state.charts.weightChannel)   state.charts.weightChannel.data.datasets[0].label   = t.chartLabelAvgWeight || 'Avg Weight (kg)';
        if (state.charts.senderCity)      state.charts.senderCity.data.datasets[0].label      = t.chartLabelRev;
        if (state.charts.receiverCity)    state.charts.receiverCity.data.datasets[0].label    = t.chartLabelRev;
        if (state.charts.cityRoute)       state.charts.cityRoute.data.datasets[0].label       = t.chartLabelCount;
        if (state.charts.revPerKg)        state.charts.revPerKg.data.datasets[0].label        = t.chartLabelRevPerKg || '€/kg';
        recalculateDashboard();
    }

    if (state.globalClientData.length > 0) {
        renderSegmentButtons(state.segmentStatsGlobal);
        renderTable(state.displayedClientData);
    }
});

// Modal overlay click — close on backdrop
document.getElementById('clientModal').addEventListener('click', e => {
    if (e.target.id === 'clientModal') closeModal();
});

// ── 5. Expose functions required by inline onclick attributes in index.html ───
window.toggleAll          = toggleAll;
window.sortTable          = sortTable;
window.changePage         = changePage;
window.closeModal         = closeModal;
window.clearSearch        = clearSearch;
window.clearCountryFilter = clearCountryFilter;
window.toggleAbcFilter    = toggleAbcFilter;
window.filterBySegment    = filterBySegment;

// ── 6. Bootstrap ──────────────────────────────────────────────────────────────
fetchCurrencyRates();
