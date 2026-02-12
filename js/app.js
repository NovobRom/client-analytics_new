// --- App: entry point — wires all modules together ---
// Load order: CDN scripts (Chart.js, Papa, XLSX) in <head> → this module via
// <script type="module" src="js/app.js"> just before </body>.

import { state } from './config.js';
import { TRANSLATIONS, updateInterfaceLanguage } from './i18n.js';
import { fetchCurrencyRates, updateRateBadge } from './currency.js';
import { handleFileUpload, openColumnWizard } from './fileProcessor.js';
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
import { MANUAL_CONTENT } from './manual_content.js';
// GDPR: Export functionality commented out until approval
// import { exportToExcel } from './export.js';

// ── MANUAL MODAL LOGIC ────────────────────────────────────────────────────────
function openManual() {
    const modal = document.getElementById('manualModal');
    const contentDiv = document.getElementById('manualContent');
    if (!modal || !contentDiv) return;

    // Inject content based on current language
    contentDiv.innerHTML = MANUAL_CONTENT[state.currentLang] || MANUAL_CONTENT.en;

    modal.classList.remove('hidden');
    // Animate in
    const panel = modal.querySelector('div'); // The inner container
    if (panel) {
        setTimeout(() => {
            panel.classList.remove('scale-95', 'opacity-0');
            panel.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
}

function closeManual() {
    const modal = document.getElementById('manualModal');
    if (!modal) return;

    const panel = modal.querySelector('div');
    if (panel) {
        panel.classList.remove('scale-100', 'opacity-100');
        panel.classList.add('scale-95', 'opacity-0');
    }

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// ── 1. Register Chart.js plugin (must run before any chart is drawn) ──────────
Chart.register(ChartDataLabels);

// ── 2. Footer year ────────────────────────────────────────────────────────────
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ── 3. Break analysis ↔ filters circular dependency via callback ──────────────
setRecalcCallback(recalculateDashboard);

// ── 4. Load saved language preference ─────────────────────────────────────────
const savedLang = localStorage.getItem('ca-lang');
if (savedLang && (savedLang === 'ua' || savedLang === 'en')) {
    state.currentLang = savedLang;
    document.getElementById('langToggle').checked = (savedLang === 'en');
    updateInterfaceLanguage();
}

// ── 5. Event listeners ────────────────────────────────────────────────────────

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
    localStorage.setItem('ca-lang', state.currentLang);
    updateInterfaceLanguage();
    updateRateBadge();

    // Refresh manual content if open
    const manualModal = document.getElementById('manualModal');
    if (manualModal && !manualModal.classList.contains('hidden')) {
        const contentDiv = document.getElementById('manualContent');
        if (contentDiv) {
            contentDiv.innerHTML = MANUAL_CONTENT[state.currentLang] || MANUAL_CONTENT.en;
        }
    }

    // Update chart dataset labels then re-render if data is loaded
    if (Object.keys(state.charts).length > 0) {
        const t = TRANSLATIONS[state.currentLang];
        if (state.charts.revenue) state.charts.revenue.data.datasets[0].label = t.chartLabelRev;
        if (state.charts.avgCheck) state.charts.avgCheck.data.datasets[0].label = t.chartLabelAvg;
        if (state.charts.count) state.charts.count.data.datasets[0].label = t.chartLabelCount;
        if (state.charts.revenueCountry) state.charts.revenueCountry.data.datasets[0].label = t.chartLabelRev;
        if (state.charts.avgCheckCountry) state.charts.avgCheckCountry.data.datasets[0].label = t.chartLabelAvg;
        if (state.charts.channelRevenue) state.charts.channelRevenue.data.datasets[0].label = t.chartLabelRev;
        if (state.charts.weightDirection) state.charts.weightDirection.data.datasets[0].label = t.chartLabelAvgWeight || 'Avg Weight (kg)';
        if (state.charts.weightChannel) state.charts.weightChannel.data.datasets[0].label = t.chartLabelAvgWeight || 'Avg Weight (kg)';
        if (state.charts.senderCity) state.charts.senderCity.data.datasets[0].label = t.chartLabelRev;
        if (state.charts.receiverCity) state.charts.receiverCity.data.datasets[0].label = t.chartLabelRev;
        if (state.charts.cityRoute) state.charts.cityRoute.data.datasets[0].label = t.chartLabelCount;
        if (state.charts.revPerKg) state.charts.revPerKg.data.datasets[0].label = t.chartLabelRevPerKg || '€/kg';
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

document.getElementById('manualModal').addEventListener('click', e => {
    if (e.target.id === 'manualModal') closeManual();
});

// Escape key to close modals
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const clientModal = document.getElementById('clientModal');
        const mappingModal = document.getElementById('mappingWizardModal');
        if (clientModal && !clientModal.classList.contains('hidden')) {
            closeModal();
        }
        if (mappingModal && !mappingModal.classList.contains('hidden')) {
            document.getElementById('mappingWizardCancel')?.click();
        }
        const manualModal = document.getElementById('manualModal');
        if (manualModal && !manualModal.classList.contains('hidden')) {
            closeManual();
        }
    }
});

// ── 6. Event delegation for data-action attributes (replaces window.*) ────────
document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;

    const action = el.dataset.action;
    const argsStr = el.dataset.args || '';
    const args = argsStr ? argsStr.split(',').map(a => a.trim()) : [];

    // Action map
    const actions = {
        toggleAll: (group, checked) => toggleAll(group, checked === 'true'),
        sortTable: (key) => sortTable(key),
        changePage: (dir) => changePage(parseInt(dir)),
        closeModal: () => closeModal(),
        clearSearch: () => clearSearch(),
        clearCountryFilter: () => clearCountryFilter(),
        toggleAbcFilter: (classChar) => toggleAbcFilter(classChar),
        filterBySegment: (segment) => filterBySegment(segment, el),
        openColumnWizard: () => openColumnWizard(),
        openManual: () => openManual(),
        closeManual: () => closeManual()
        // GDPR: Export action commented out until approval
        // exportToExcel: () => exportToExcel()
    };

    if (actions[action]) {
        e.preventDefault();
        actions[action](...args);
    }
});

// ── 7. Bootstrap ──────────────────────────────────────────────────────────────
fetchCurrencyRates();
