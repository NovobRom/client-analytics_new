// --- Analysis: data crunching, ABC classification, dashboard recalculation ---
// Circular-dependency note:
//   analysis.js → filters.js (applyCombinedFilters) — one-way import, safe.
//   filters.js → recalculateDashboard via callback set in app.js (no import needed there).

import { state, POTENTIAL_BUSINESS_COUNT } from './config.js';
import { renderDashboard } from './render.js';
import { applyCombinedFilters } from './filters.js';

export function recalculateDashboard() {
    const activeOrigins = Array.from(document.querySelectorAll('.filter-cb-origin:checked')).map(cb => cb.value);
    const activeDests = Array.from(document.querySelectorAll('.filter-cb-dest:checked')).map(cb => cb.value);

    const filteredRows = state.rawRows.filter(row => {
        const o = (row[state.rawColIndices.idxCountry] || "").toString().trim().toUpperCase();
        const d = (row[state.rawColIndices.idxDestCountry] || "").toString().trim().toUpperCase();
        return (activeOrigins.includes(o) || (!o && activeOrigins.length === 0)) &&
               (activeDests.includes(d) || (!d && activeDests.length === 0));
    });

    const analysisResult = analyzeData(filteredRows);
    state.globalClientData = analysisResult.clients;
    state.segmentStatsGlobal = analysisResult.segmentStats;
    renderDashboard(analysisResult);
    applyCombinedFilters();
}

export function parseDate(dateStr) {
    if (!dateStr) return null;
    if (typeof dateStr === 'number') return new Date(Math.round((dateStr - 25569) * 86400 * 1000));
    const cleanStr = dateStr.toString().trim().split(' ')[0];
    const parts = cleanStr.split(/[./-]/);
    if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]);
    return null;
}

export function formatDate(dateObj) {
    const d = dateObj.getDate().toString().padStart(2, '0');
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}.${m}.${y}`;
}

export function analyzeData(rows) {
    const idxs = state.rawColIndices;
    let clients = {}, totalRev = 0, totalShipments = 0, segmentStats = {}, countryStats = {}, detectedOrigins = new Set();
    let minDate = null, maxDate = null;
    let originStats = {};

    rows.forEach(row => {
        if (idxs.idxDate !== -1) {
            const dObj = parseDate(row[idxs.idxDate]);
            if (dObj && !isNaN(dObj.getTime())) {
                if (!minDate || dObj < minDate) minDate = dObj;
                if (!maxDate || dObj > maxDate) maxDate = dObj;
            }
        }
        if (!row[idxs.idxName]) return;
        const name = row[idxs.idxName];

        let revRaw = row[idxs.idxRev], revenueLocal = 0;
        if (revRaw) {
            if (typeof revRaw === 'string') revRaw = revRaw.replace(',', '.').replace(/\s/g, '');
            revenueLocal = parseFloat(revRaw) || 0;
        }
        let revenueEur = revenueLocal;
        if (idxs.idxCurr !== -1) {
            let curr = row[idxs.idxCurr];
            if (curr && typeof curr === 'string') {
                const rate = state.currentRates[curr.trim().toUpperCase()];
                if (rate) revenueEur = revenueLocal / rate;
            }
        }

        const segment = row[idxs.idxSegment] || "Unknown";
        let dest = row[idxs.idxDestCountry] || "N/A";
        if (typeof dest === 'string') dest = dest.trim().toUpperCase();
        let orig = row[idxs.idxCountry] || "Unknown";
        if (typeof orig === 'string' && orig !== "Unknown") orig = orig.trim().toUpperCase();
        detectedOrigins.add(orig);

        if (!originStats[orig]) originStats[orig] = 0;
        originStats[orig] += revenueEur;

        if (!countryStats[dest]) countryStats[dest] = { rev: 0, count: 0 };
        countryStats[dest].rev += revenueEur; countryStats[dest].count += 1;

        if (!clients[name]) clients[name] = { name, revenue: 0, count: 0, segment, origin: orig, type: row[idxs.idxType], phone: "", items: {}, destinations: {} };
        if (idxs.idxPhone !== -1 && !clients[name].phone && row[idxs.idxPhone]) clients[name].phone = row[idxs.idxPhone];

        clients[name].revenue += revenueEur; clients[name].count += 1;
        if (segment && segment !== "Unknown") clients[name].segment = segment;
        const item = row[idxs.idxDesc] || "N/A";
        const cleanItem = item.toString().trim().substring(0, 30);
        clients[name].items[cleanItem] = (clients[name].items[cleanItem] || 0) + 1;
        clients[name].destinations[dest] = (clients[name].destinations[dest] || 0) + 1;
        totalRev += revenueEur; totalShipments += 1;
    });

    const getTopKeys = (map, limit) => Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, limit).map(e => `${e[0]} (${e[1]})`).join(", ");
    let clientList = Object.values(clients);
    clientList.sort((a, b) => b.revenue - a.revenue);

    let runningTotal = 0, countA = 0, countB = 0, countC = 0;
    clientList = clientList.map(c => {
        runningTotal += c.revenue;
        const percentage = (runningTotal / totalRev) * 100;
        let abcClass = 'C';
        if (percentage <= 80) abcClass = 'A'; else if (percentage <= 95) abcClass = 'B';
        if (abcClass === 'A') countA++; if (abcClass === 'B') countB++; if (abcClass === 'C') countC++;
        segmentStats[c.segment] = (segmentStats[c.segment] || 0) + 1;
        return {
            ...c,
            avgCheck: c.count ? (c.revenue / c.count) : 0,
            topItems: getTopKeys(c.items, 3),
            destinationsMap: c.destinations,
            isHiddenBiz: (c.type === 'Private person' && c.count >= POTENTIAL_BUSINESS_COUNT),
            abcClass
        };
    });

    return {
        clients: clientList,
        totalRev,
        totalShipments,
        avgCheckGlobal: totalShipments ? (totalRev / totalShipments) : 0,
        segmentStats,
        countryStats,
        originStats,
        abcCounts: { A: countA, B: countB, C: countC },
        detectedOrigins: Array.from(detectedOrigins),
        dateRange: { min: minDate, max: maxDate }
    };
}
