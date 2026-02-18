// --- Modal: client detail overlay ---

import { getCountryName } from './i18n.js';

export function openModal(client) {
    if (!client) {
        console.error("Attempted to open modal with invalid client data");
        return;
    }

    try {
        const modal = document.getElementById('clientModal');
        const panel = document.getElementById('modalPanel');

        document.getElementById('modalClientName').textContent = client.name;
        document.getElementById('modalClientType').textContent = client.type;
        document.getElementById('modalRevenue').textContent = client.revenue.toLocaleString('uk-UA', { minimumFractionDigits: 2 }) + ' €';
        document.getElementById('modalCount').textContent = client.count;
        document.getElementById('modalAvg').textContent = client.avgCheck.toLocaleString('uk-UA', { minimumFractionDigits: 2 }) + ' €';
        document.getElementById('modalABC').textContent = `Class ${client.abcClass}`;
        document.getElementById('modalOrigin').textContent = getCountryName(client.origin);
        document.getElementById('modalSegment').textContent = client.segment;
        document.getElementById('modalPhone').textContent = client.phone || "---";

        const renderList = (map, elId, countId, isCountry) => {
            const el = document.getElementById(elId);
            const sortedEntries = Object.entries(map).sort((a, b) => b[1] - a[1]);
            document.getElementById(countId).textContent = sortedEntries.length;
            el.innerHTML = sortedEntries.map(([k, v]) => {
                const label = isCountry ? getCountryName(k) : k;
                return `
                <div class="flex justify-between border-b border-gray-200 last:border-0 py-1">
                    <span class="text-gray-700 truncate w-3/4" title="${label}">${label}</span>
                    <span class="font-bold text-gray-500">${v}</span>
                </div>`;
            }).join('');
        };

        renderList(client.destinationsMap, 'modalDestList', 'modalDestCount', true);
        renderList(client.items, 'modalItemsList', 'modalItemCount', false);

        // Weight info
        document.getElementById('modalTotalWeight').textContent =
            client.totalWeight.toFixed(2) + ' kg';
        document.getElementById('modalAvgWeight').textContent =
            (client.weightedCount > 0 ? (client.totalWeight / client.weightedCount).toFixed(2) : '0') + ' kg';

        // Channel badges
        const renderChannelBadges = (map, elId) => {
            const el = document.getElementById(elId);
            const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
            const total = entries.reduce((s, e) => s + e[1], 0);
            el.innerHTML = total === 0 ? '<span class="text-xs text-gray-400">—</span>' : entries.map(([ch, cnt]) => {
                const pct = total ? ((cnt / total) * 100).toFixed(0) : 0;
                return `<span class="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded mr-1 mb-1">${ch}: ${cnt} (${pct}%)</span>`;
            }).join('');
        };
        renderChannelBadges(client.senderChannels, 'modalSenderChannels');
        renderChannelBadges(client.receiverChannels, 'modalReceiverChannels');

        // Top cities
        const renderCityList = (map, elId) => {
            const el = document.getElementById(elId);
            const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
            el.innerHTML = sorted.length === 0 ? '<span class="text-xs text-gray-400">—</span>' : sorted.map(([city, cnt]) =>
                `<div class="flex justify-between text-xs py-0.5"><span>${city}</span><span class="font-bold">${cnt}</span></div>`
            ).join('');
        };
        renderCityList(client.senderCities, 'modalSenderCities');
        renderCityList(client.receiverCities, 'modalReceiverCities');

        // Shipment History & Analysis
        const formatDate = (d) => {
            if (!d) return '-';
            return d.getDate().toString().padStart(2, '0') + '.' + (d.getMonth() + 1).toString().padStart(2, '0') + '.' + d.getFullYear();
        };

        document.getElementById('modalFirstDate').textContent = formatDate(client.firstShipmentDate);
        document.getElementById('modalLastDate').textContent = formatDate(client.lastShipmentDate);

        const freq = client.shipmentFrequency;
        let freqText = '-';
        if (freq > 0) {
            if (freq < 1) freqText = "Often (<1 day)";
            else freqText = `Every ~${Math.round(freq)} days`;
        }
        document.getElementById('modalFrequency').textContent = freqText;

        const historyEl = document.getElementById('modalHistoryList');
        const historyCount = document.getElementById('modalHistoryCount');

        if (client.shipmentHistory && client.shipmentHistory.length > 0) {
            historyCount.textContent = client.shipmentHistory.length;
            // Reverse sort for display (newest first) ??? User asked for "sorted by IWB date creation"
            // usually history is best seen newest first. But user said "analyze when was first, when last".
            // "I want to see MEN Shipment sorted by IWB creation date".
            // Let's show newest first as it is more standard for "History", but keep underlying array sorted ascending for calculations.

            const historySorted = [...client.shipmentHistory].sort((a, b) => b.date - a.date);

            historyEl.innerHTML = historySorted.map(item => `
                <div class="flex justify-between border-b border-gray-200 last:border-0 py-1">
                    <span class="text-gray-700 font-mono">${item.number}</span>
                    <span class="text-xs text-gray-500">${formatDate(item.date)}</span>
                </div>
            `).join('');
        } else {
            historyCount.textContent = '0';
            historyEl.innerHTML = '<span class="text-xs text-gray-400">—</span>';
        }

        modal.classList.remove('hidden');
        setTimeout(() => {
            panel.classList.remove('scale-95', 'opacity-0');
            panel.classList.add('scale-100', 'opacity-100');
        }, 10);
    } catch (e) {
        console.error("Error inside openModal:", e);
    }
}

export function closeModal() {
    const modal = document.getElementById('clientModal');
    const panel = document.getElementById('modalPanel');
    panel.classList.remove('scale-100', 'opacity-100');
    panel.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}
