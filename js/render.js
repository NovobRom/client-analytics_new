// --- Render: dashboard KPIs, origin breakdown, segment buttons ---
// Note: render.js ↔ analysis.js is a circular ES-module reference
// (render imports formatDate from analysis; analysis imports renderDashboard from render).
// This is safe in ES modules because both sides export functions — by the time
// any function is invoked the full module graph is evaluated.

import { state } from './config.js';
import { TRANSLATIONS, getFlagHtml } from './i18n.js';
import { formatDate } from './analysis.js';
import { renderCharts } from './charts.js';
import { applyCombinedFilters, updateAbcVisualState, filterBySegment } from './filters.js';

export function renderDashboard(data) {
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('emptyState').classList.add('hidden');
    const t = TRANSLATIONS[state.currentLang];

    const pBadge = document.getElementById('periodBadge');
    pBadge.classList.remove('hidden');
    if (data.dateRange.min && data.dateRange.max) {
        document.getElementById('detectedPeriod').textContent =
            `${formatDate(data.dateRange.min)} — ${formatDate(data.dateRange.max)}`;
    } else {
        document.getElementById('detectedPeriod').textContent = t.lblDateNotFound;
    }

    document.getElementById('totalClients').textContent = data.clients.length;
    document.getElementById('totalRevenue').textContent =
        data.totalRev.toLocaleString('uk-UA', { maximumFractionDigits: 0 }) + ' €';
    document.getElementById('avgCheckGlobal').textContent =
        data.avgCheckGlobal.toLocaleString('uk-UA', { maximumFractionDigits: 1 }) + ' €';
    document.getElementById('countA').textContent = data.abcCounts.A;
    document.getElementById('countB').textContent = data.abcCounts.B;
    document.getElementById('countC').textContent = data.abcCounts.C;

    renderOriginBreakdown(data.originStats, data.totalRev);
    renderSegmentButtons(data.segmentStats);
    renderCharts(data.clients, data.countryStats);
    applyCombinedFilters();
    updateAbcVisualState();
}

export function renderOriginBreakdown(originStats, totalRev) {
    const container = document.getElementById('originStatsContainer');
    container.innerHTML = '';

    const sortedOrigins = Object.entries(originStats).sort((a, b) => b[1] - a[1]);
    sortedOrigins.forEach(([code, val]) => {
        if (val <= 0) return;
        const perc = totalRev ? ((val / totalRev) * 100).toFixed(1) : 0;
        const flagHtml = getFlagHtml(code);

        const div = document.createElement('div');
        div.className = "flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100";
        div.innerHTML = `
            <div class="text-2xl">${flagHtml}</div>
            <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-gray-700 text-sm">${code}</span>
                    <span class="text-xs font-medium text-gray-500">${perc}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div class="bg-indigo-500 h-1.5 rounded-full" style="width: ${perc}%"></div>
                </div>
                <div class="text-xs font-bold text-indigo-700 text-right">
                    ${val.toLocaleString('uk-UA', { maximumFractionDigits: 0 })} €
                </div>
            </div>`;
        container.appendChild(div);
    });
}

export function renderSegmentButtons(segmentStats) {
    const container = document.getElementById('segmentFiltersContainer');
    container.innerHTML = '';
    const t = TRANSLATIONS[state.currentLang];

    const total = Object.values(segmentStats).reduce((a, b) => a + b, 0);
    const allBtn = document.createElement('button');
    allBtn.className = "btn-segment active px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500";
    allBtn.textContent = `${t.lblAll} (${total})`;
    allBtn.onclick = () => filterBySegment('ALL', allBtn);
    container.appendChild(allBtn);

    Object.keys(segmentStats).sort().forEach(seg => {
        const btn = document.createElement('button');
        const count = segmentStats[seg];
        let baseColor = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";
        let activeRing = "focus:ring-blue-500";
        if (seg.toLowerCase().includes('active')) {
            baseColor = "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
        } else if (seg.toLowerCase().includes('lost') || seg.toLowerCase().includes('inactive')) {
            baseColor = "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
            activeRing = "focus:ring-red-500";
        } else if (seg.toLowerCase().includes('new')) {
            baseColor = "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
            activeRing = "focus:ring-green-500";
        }
        btn.className = `btn-segment px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeRing} ${baseColor}`;
        btn.textContent = `${seg} (${count})`;
        btn.onclick = () => filterBySegment(seg, btn);
        container.appendChild(btn);
    });
}
