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

export function cleanCityName(raw) {
    if (!raw) return '';
    let city = raw.toString().trim();
    const prefixes = [
        /^Селище\s+міського\s+типу\s+/i,
        /^Селище\s+/i,
        /^Село\s+/i,
        /^Місто\s+/i,
        /^Смт\.\s*/i,
        /^Смт\s+/i,
        /^Village\s+/i,
        /^Town\s+/i,
        /^City\s+/i,
        /^с\.\s*/i,
        /^м\.\s*/i,
    ];
    for (const re of prefixes) {
        city = city.replace(re, '');
    }
    return city.trim();
}

export function parseWeight(raw) {
    if (raw == null || raw === '') return 0;
    if (typeof raw === 'number') return Math.round(raw * 100) / 100;
    let str = raw.toString().replace(',', '.').replace(/\s/g, '');
    const val = parseFloat(str);
    return isNaN(val) ? 0 : Math.round(val * 100) / 100;
}

export function analyzeData(rows) {
    const idxs = state.rawColIndices;
    let clients = {}, totalRev = 0, totalShipments = 0, segmentStats = {}, countryStats = {}, detectedOrigins = new Set();
    let minDate = null, maxDate = null;
    let originStats = {};

    // Channel accumulators
    let senderChannelCounts = {}, receiverChannelCounts = {}, channelFlowMatrix = {};
    let senderChannelRevenue = {}, receiverChannelRevenue = {};
    let senderChannelShipments = {}, receiverChannelShipments = {};

    // Weight accumulators
    let totalWeight = 0, weightedShipmentCount = 0;
    let weightByDirection = {}, weightByChannel = {}, revenueByDirection = {};

    // City accumulators
    let senderCityStats = {}, receiverCityStats = {}, cityRouteStats = {};

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

        if (!clients[name]) clients[name] = {
            name, revenue: 0, count: 0, segment, origin: orig,
            type: row[idxs.idxType], phone: "", items: {}, destinations: {},
            totalWeight: 0, weightedCount: 0,
            senderChannels: {}, receiverChannels: {},
            senderCities: {}, receiverCities: {}
        };
        if (idxs.idxPhone !== -1 && !clients[name].phone && row[idxs.idxPhone]) clients[name].phone = row[idxs.idxPhone];

        clients[name].revenue += revenueEur; clients[name].count += 1;
        if (segment && segment !== "Unknown") clients[name].segment = segment;
        const item = row[idxs.idxDesc] || "N/A";
        const cleanItem = item.toString().trim().substring(0, 30);
        clients[name].items[cleanItem] = (clients[name].items[cleanItem] || 0) + 1;
        clients[name].destinations[dest] = (clients[name].destinations[dest] || 0) + 1;

        // --- Channel data ---
        const senderCh = (idxs.idxSenderChannel !== -1 && row[idxs.idxSenderChannel])
            ? row[idxs.idxSenderChannel].toString().trim() : '';
        const receiverCh = (idxs.idxReceiverChannel !== -1 && row[idxs.idxReceiverChannel])
            ? row[idxs.idxReceiverChannel].toString().trim() : '';

        if (senderCh) {
            senderChannelCounts[senderCh] = (senderChannelCounts[senderCh] || 0) + 1;
            senderChannelRevenue[senderCh] = (senderChannelRevenue[senderCh] || 0) + revenueEur;
            senderChannelShipments[senderCh] = (senderChannelShipments[senderCh] || 0) + 1;
            clients[name].senderChannels[senderCh] = (clients[name].senderChannels[senderCh] || 0) + 1;
        }
        if (receiverCh) {
            receiverChannelCounts[receiverCh] = (receiverChannelCounts[receiverCh] || 0) + 1;
            receiverChannelRevenue[receiverCh] = (receiverChannelRevenue[receiverCh] || 0) + revenueEur;
            receiverChannelShipments[receiverCh] = (receiverChannelShipments[receiverCh] || 0) + 1;
            clients[name].receiverChannels[receiverCh] = (clients[name].receiverChannels[receiverCh] || 0) + 1;
        }
        if (senderCh && receiverCh) {
            const flowKey = `${senderCh}→${receiverCh}`;
            channelFlowMatrix[flowKey] = (channelFlowMatrix[flowKey] || 0) + 1;
        }

        // --- Weight data ---
        const weight = (idxs.idxWeight !== -1) ? parseWeight(row[idxs.idxWeight]) : 0;
        if (weight > 0) {
            totalWeight += weight;
            weightedShipmentCount += 1;
            clients[name].totalWeight += weight;
            clients[name].weightedCount += 1;
            const dirKey = `${orig}→${dest}`;
            if (!weightByDirection[dirKey]) weightByDirection[dirKey] = { totalWeight: 0, count: 0 };
            weightByDirection[dirKey].totalWeight += weight;
            weightByDirection[dirKey].count += 1;
            if (!revenueByDirection[dirKey]) revenueByDirection[dirKey] = 0;
            revenueByDirection[dirKey] += revenueEur;
            if (senderCh) {
                if (!weightByChannel[senderCh]) weightByChannel[senderCh] = { totalWeight: 0, count: 0 };
                weightByChannel[senderCh].totalWeight += weight;
                weightByChannel[senderCh].count += 1;
            }
        }

        // --- City data ---
        const senderCity = (idxs.idxSenderCity !== -1) ? cleanCityName(row[idxs.idxSenderCity]) : '';
        const receiverCity = (idxs.idxReceiverCity !== -1) ? cleanCityName(row[idxs.idxReceiverCity]) : '';

        if (senderCity) {
            if (!senderCityStats[senderCity]) senderCityStats[senderCity] = { count: 0, rev: 0 };
            senderCityStats[senderCity].count += 1;
            senderCityStats[senderCity].rev += revenueEur;
            clients[name].senderCities[senderCity] = (clients[name].senderCities[senderCity] || 0) + 1;
        }
        if (receiverCity) {
            if (!receiverCityStats[receiverCity]) receiverCityStats[receiverCity] = { count: 0, rev: 0 };
            receiverCityStats[receiverCity].count += 1;
            receiverCityStats[receiverCity].rev += revenueEur;
            clients[name].receiverCities[receiverCity] = (clients[name].receiverCities[receiverCity] || 0) + 1;
        }
        if (senderCity && receiverCity) {
            const routeKey = `${senderCity}→${receiverCity}`;
            if (!cityRouteStats[routeKey]) cityRouteStats[routeKey] = { count: 0, rev: 0 };
            cityRouteStats[routeKey].count += 1;
            cityRouteStats[routeKey].rev += revenueEur;
        }

        // --- Shipment History ---
        const shipmentNum = (idxs.idxShipmentNumber !== -1) ? row[idxs.idxShipmentNumber] : '';
        const dateVal = parseDate(row[idxs.idxDate]);

        // Ensure we initialize shipmentHistory array
        if (!clients[name].shipmentHistory) clients[name].shipmentHistory = [];

        if (dateVal && !isNaN(dateVal.getTime())) {
            // Only add if we have a valid date. 
            // If shipmentNum is missing, we can still record the date event, 
            // but ideally we want both.
            clients[name].shipmentHistory.push({
                date: dateVal,
                number: shipmentNum ? shipmentNum.toString().trim() : 'N/A'
            });
        }

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

        // Process shipment history for this client
        c.shipmentHistory.sort((a, b) => a.date - b.date);

        let firstDate = null;
        let lastDate = null;
        let frequencyDays = 0;

        if (c.shipmentHistory.length > 0) {
            firstDate = c.shipmentHistory[0].date;
            lastDate = c.shipmentHistory[c.shipmentHistory.length - 1].date;

            if (c.shipmentHistory.length > 1) {
                const diffTime = Math.abs(lastDate - firstDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                // frequency = total days range / (number of shipments - 1) intervals
                frequencyDays = diffDays / (c.shipmentHistory.length - 1);
            }
        }

        return {
            ...c,
            avgCheck: c.count ? (c.revenue / c.count) : 0,
            topItems: getTopKeys(c.items, 3),
            destinationsMap: c.destinations,
            isHiddenBiz: (c.type === 'Private person' && c.count >= POTENTIAL_BUSINESS_COUNT),
            abcClass,
            firstShipmentDate: firstDate,
            lastShipmentDate: lastDate,
            shipmentFrequency: frequencyDays
        };
    });

    // Channel preference by ABC class
    const channelByAbc = { A: {}, B: {}, C: {} };
    clientList.forEach(c => {
        Object.entries(c.senderChannels).forEach(([ch, cnt]) => {
            channelByAbc[c.abcClass][ch] = (channelByAbc[c.abcClass][ch] || 0) + cnt;
        });
    });

    // Average weight by ABC class
    const weightByAbc = { A: { total: 0, count: 0 }, B: { total: 0, count: 0 }, C: { total: 0, count: 0 } };
    clientList.forEach(c => {
        if (c.weightedCount > 0) {
            weightByAbc[c.abcClass].total += c.totalWeight;
            weightByAbc[c.abcClass].count += c.weightedCount;
        }
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
        dateRange: { min: minDate, max: maxDate },
        // Channel metrics
        senderChannelCounts, receiverChannelCounts, channelFlowMatrix,
        senderChannelRevenue, receiverChannelRevenue,
        senderChannelShipments, receiverChannelShipments,
        channelByAbc,
        // Weight metrics
        totalWeight, weightedShipmentCount,
        avgWeight: weightedShipmentCount ? Math.round((totalWeight / weightedShipmentCount) * 100) / 100 : 0,
        revenuePerKg: totalWeight > 0 ? Math.round((totalRev / totalWeight) * 100) / 100 : 0,
        weightByDirection, weightByChannel, revenueByDirection,
        weightByAbc,
        // City metrics
        senderCityStats, receiverCityStats, cityRouteStats
    };
}
