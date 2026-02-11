// --- Table: paginated client list rendering, sorting, pagination ---

import { state, ITEMS_PER_PAGE } from './config.js';
import { getCountryName } from './i18n.js';
import { openModal } from './modal.js';

// Module-local sort direction state (not shared globally)
const sortDir = { name: 1, abcClass: 1, segment: 1, revenue: -1, count: -1, avgCheck: -1 };

export function renderTable(clients) {
    const tbody = document.getElementById('clientTableBody');
    tbody.innerHTML = '';

    const totalItems = clients.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

    // Clamp current page
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    if (state.currentPage < 1) state.currentPage = 1;

    const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
    const visibleClients = clients.slice(startIndex, endIndex);

    // Update pagination controls
    document.getElementById('pagTotal').textContent = totalItems;
    document.getElementById('pagCurrent').textContent = state.currentPage;
    document.getElementById('pagMax').textContent = totalPages;
    document.getElementById('btnPrev').disabled = state.currentPage === 1;
    document.getElementById('btnNext').disabled = state.currentPage === totalPages || totalItems === 0;

    if (totalItems === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-gray-400">No data found</td></tr>';
        return;
    }

    visibleClients.forEach(c => {
        const row = document.createElement('tr');
        row.className = "bg-white border-b hover:bg-gray-50 transition-colors cursor-pointer group";

        // Segment badge colour
        let segClass = "bg-gray-100 text-gray-800";
        const sl = c.segment ? c.segment.toLowerCase() : "";
        if (sl.includes('new')) segClass = "bg-green-100 text-green-800 border border-green-200";
        else if (sl.includes('lost') || sl.includes('inactive')) segClass = "bg-red-100 text-red-800 border border-red-200";
        else if (sl.includes('active')) segClass = "bg-blue-100 text-blue-800 border border-blue-200";

        // ABC badge colour
        let abcClass = "bg-orange-50 text-orange-800 border-orange-200";
        if (c.abcClass === 'A') abcClass = "bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm";
        if (c.abcClass === 'B') abcClass = "bg-gray-100 text-gray-800 border-gray-300";

        const bizBadge = c.isHiddenBiz ? `<span class="text-orange-500 font-bold ml-1" title="High Freq">⚠️</span>` : "";
        const topDestString = Object.entries(c.destinationsMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(e => `${getCountryName(e[0])} (${e[1]})`)
            .join(", ");

        row.addEventListener('click', () => {
            try { openModal(c); } catch (e) { console.error("Error opening modal:", e); }
        });

        row.innerHTML = `
            <td class="px-4 py-3 font-medium text-blue-600 group-hover:underline">${c.name} ${bizBadge}</td>
            <td class="px-4 py-3 text-center"><span class="${abcClass} text-xs font-bold px-2 py-0.5 rounded border">${c.abcClass}</span></td>
            <td class="px-4 py-3"><span class="${segClass} text-xs font-medium px-2 py-0.5 rounded">${c.segment}</span></td>
            <td class="px-4 py-3 text-right font-bold text-gray-800">${c.revenue.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}</td>
            <td class="px-4 py-3 text-center">${c.count}</td>
            <td class="px-4 py-3 text-right text-xs font-semibold text-blue-600 bg-yellow-50">${c.avgCheck.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}</td>
            <td class="px-4 py-3 bg-blue-50 text-xs text-gray-700 whitespace-pre-wrap">${topDestString}</td>
            <td class="px-4 py-3 bg-green-50 text-xs text-gray-600 italic whitespace-pre-wrap">${c.topItems}</td>
        `;
        tbody.appendChild(row);
    });
}

export function sortTable(key) {
    sortDir[key] = -sortDir[key];
    state.displayedClientData.sort((a, b) => {
        let valA = a[key]; let valB = b[key];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return -1 * sortDir[key];
        if (valA > valB) return 1 * sortDir[key];
        return 0;
    });
    state.currentPage = 1;
    renderTable(state.displayedClientData);
}

export function changePage(direction) {
    state.currentPage += direction;
    renderTable(state.displayedClientData);
}
