// --- Filters: global filter setup, segment/ABC/country/search filtering ---
// Circular-dep note: this module does NOT import analysis.js.
// recalculateDashboard is injected via setRecalcCallback() called from app.js.

import { state } from './config.js';
import { TRANSLATIONS, getCountryName } from './i18n.js';
import { renderTable } from './table.js';

// Callback pattern to break analysis ↔ filters circular dependency
let _recalcCallback = null;

export function setRecalcCallback(fn) {
    _recalcCallback = fn;
}

function triggerRecalc() {
    if (_recalcCallback) _recalcCallback();
}

// --- Global filter setup (Origins / Destinations checkboxes) ---

export function setupGlobalFilters() {
    const uniqueOrigins = new Set();
    const uniqueDests = new Set();
    state.rawRows.forEach(row => {
        const o = row[state.rawColIndices.idxCountry];
        if (o && typeof o === 'string') uniqueOrigins.add(o.trim().toUpperCase());
        const d = row[state.rawColIndices.idxDestCountry];
        if (d && typeof d === 'string') uniqueDests.add(d.trim().toUpperCase());
    });
    renderFilterCheckboxes('originFilters', Array.from(uniqueOrigins), 'origin');
    renderFilterCheckboxes('destFilters', Array.from(uniqueDests), 'dest');
    document.getElementById('settingsPanel').classList.remove('hidden');
}

export function renderFilterCheckboxes(containerId, codes, groupName) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    codes.sort().forEach(code => {
        const wrapper = document.createElement('label');
        wrapper.className = "flex items-center space-x-2 cursor-pointer bg-white px-2 py-1 rounded border border-gray-200 hover:border-indigo-300 transition-colors w-full";
        wrapper.title = getCountryName(code);
        const cb = document.createElement('input');
        cb.type = "checkbox";
        cb.className = `form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition duration-150 ease-in-out filter-cb-${groupName}`;
        cb.value = code;
        cb.checked = true;
        cb.onchange = triggerRecalc;
        const span = document.createElement('span');
        span.className = "text-xs font-bold text-gray-700";
        span.textContent = code;
        wrapper.appendChild(cb); wrapper.appendChild(span); container.appendChild(wrapper);
    });
}

// 'checked' renamed from original 'state' param to avoid shadowing the imported state object
export function toggleAll(groupName, checked) {
    document.querySelectorAll(`.filter-cb-${groupName}`).forEach(cb => cb.checked = checked);
    triggerRecalc();
}

// --- ABC filter ---

export function toggleAbcFilter(classChar) {
    state.activeAbcFilter = (state.activeAbcFilter === classChar) ? null : classChar;
    updateAbcVisualState();
    applyCombinedFilters();
}

export function updateAbcVisualState() {
    document.querySelectorAll('.abc-card').forEach(el => el.classList.remove('active-filter', 'ring-2', 'ring-offset-2'));
    document.getElementById('abcFilterActiveLabel').classList.add('hidden');
    if (state.activeAbcFilter) {
        const target = document.querySelector(`.abc-card.abc-${state.activeAbcFilter.toLowerCase()}`);
        if (target) target.classList.add('active-filter', 'ring-2', 'ring-offset-2');
        document.getElementById('abcFilterActiveLabel').classList.remove('hidden');
    }
}

// --- Segment filter ---

export function filterBySegment(segment, btnElement) {
    state.activeSegmentFilter = segment;
    document.querySelectorAll('.btn-segment').forEach(b => b.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-500'));
    if (btnElement) btnElement.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
    const label = document.getElementById('currentFilterLabel');
    label.textContent = `${TRANSLATIONS[state.currentLang].lblSegment}: ${segment}`;
    label.classList.remove('hidden');
    if (segment === 'ALL') label.classList.add('hidden');
    applyCombinedFilters();
}

// --- Country filter ---

export function triggerCountryFilter(countryCode) {
    state.activeCountryFilter = countryCode;
    const label = document.getElementById('countryFilterLabel');
    label.textContent = `${TRANSLATIONS[state.currentLang].lblCountry}: ${getCountryName(countryCode)} ✖`;
    label.classList.remove('hidden');
    document.getElementById('detailsSection').scrollIntoView({ behavior: 'smooth' });
    applyCombinedFilters();
}

export function clearCountryFilter() {
    state.activeCountryFilter = null;
    document.getElementById('countryFilterLabel').classList.add('hidden');
    applyCombinedFilters();
}

// --- Search filter ---

export function triggerClientSearch(clientName) {
    document.getElementById('searchTable').value = clientName;
    document.getElementById('detailsSection').scrollIntoView({ behavior: 'smooth' });
    applyCombinedFilters();
}

export function clearSearch() {
    document.getElementById('searchTable').value = '';
    applyCombinedFilters();
}

export function filterTableSearch() {
    applyCombinedFilters();
}

// --- Combined filter: applies all active filters and re-renders table ---

export function applyCombinedFilters() {
    const searchVal = document.getElementById('searchTable').value.toUpperCase();

    state.displayedClientData = state.globalClientData.filter(c => {
        const matchSegment = (state.activeSegmentFilter === 'ALL') || (c.segment === state.activeSegmentFilter);
        const matchSearch = c.name.toUpperCase().includes(searchVal);
        const matchCountry = (state.activeCountryFilter === null) || (c.destinationsMap.hasOwnProperty(state.activeCountryFilter));
        const matchAbc = (state.activeAbcFilter === null) || (c.abcClass === state.activeAbcFilter);
        return matchSegment && matchSearch && matchCountry && matchAbc;
    });

    state.currentPage = 1;
    renderTable(state.displayedClientData);
}
