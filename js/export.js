// --- Export: Export processed data to Excel ---

import { state } from './config.js';
import { TRANSLATIONS } from './i18n.js';
import { showToast } from './notifications.js';
import { getCountryName } from './i18n.js';

/**
 * Export current table data to Excel
 */
export function exportToExcel() {
    if (!state.displayedClientData || state.displayedClientData.length === 0) {
        const t = TRANSLATIONS[state.currentLang];
        showToast(t.exportNoData || 'Немає даних для експорту', 'warning');
        return;
    }

    try {
        const t = TRANSLATIONS[state.currentLang];

        // Prepare data for export
        const exportData = state.displayedClientData.map(client => ({
            [t.thClient || 'Client']: client.name,
            'ABC': client.abcClass,
            [t.thSegment || 'Segment']: client.segment,
            [t.thRevenue || 'Revenue (EUR)']: parseFloat(client.revenue.toFixed(2)),
            [t.thCount || 'Count']: client.count,
            [t.thWeight || 'Weight (kg)']: parseFloat(client.totalWeight.toFixed(2)),
            [t.thAvgCheck || 'Avg Check']: parseFloat(client.avgCheck.toFixed(2)),
            [t.thDest || 'Top Destinations']: Object.entries(client.destinationsMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([code, count]) => `${getCountryName(code)} (${count})`)
                .join(', '),
            [t.thItem || 'Top Items']: client.topItems
        }));

        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Auto-size columns
        const colWidths = [
            { wch: 30 }, // Client
            { wch: 5 },  // ABC
            { wch: 15 }, // Segment
            { wch: 12 }, // Revenue
            { wch: 8 },  // Count
            { wch: 10 }, // Weight
            { wch: 12 }, // Avg Check
            { wch: 40 }, // Destinations
            { wch: 40 }  // Items
        ];
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, t.exportSheetName || 'Client Analysis');

        // Generate filename with date
        const date = new Date().toISOString().split('T')[0];
        const filename = `client-analytics-${date}.xlsx`;

        // Trigger download
        XLSX.writeFile(wb, filename);

        showToast(t.exportSuccess || `Експортовано ${exportData.length} записів`, 'success', 3000);
    } catch (error) {
        console.error('Export error:', error);
        const t = TRANSLATIONS[state.currentLang];
        showToast(t.exportError || 'Помилка експорту', 'error');
    }
}
