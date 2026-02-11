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
