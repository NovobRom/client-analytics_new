// --- File Processor: CSV/Excel upload, header detection, column mapping ---
// Papa and XLSX are global CDN objects (window.Papa / window.XLSX)

import { state } from './config.js';
import { setupGlobalFilters } from './filters.js';
import { recalculateDashboard } from './analysis.js';
import { updateRateBadge } from './currency.js';
import { TRANSLATIONS } from './i18n.js';
import { showToast } from './notifications.js';
import {
    autoMapColumns,
    showMappingWizard,
    loadMappingFromStorage,
    saveMappingToStorage,
    COLUMN_DEFINITIONS
} from './columnMapper.js';

export function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('hidden');
    loadingOverlay.classList.add('flex');
    setTimeout(() => {
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.csv')) processCSV(file);
        else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) processExcel(file);
        else {
            const t = TRANSLATIONS[state.currentLang];
            showToast(t.unsupportedFileType || 'Непідтримуваний тип файлу. Використовуйте CSV або XLSX', 'error');
            hideLoading();
        }
    }, 100);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('hidden');
    loadingOverlay.classList.remove('flex');
    document.getElementById('csvInput').value = '';
}

function processCSV(file) {
    Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: function (results) { findHeaderAndProcess(results.data); },
        error: function (err) {
            const t = TRANSLATIONS[state.currentLang];
            showToast(`${t.csvParseError || 'Помилка парсингу CSV'}: ${err.message}`, 'error');
            hideLoading();
        }
    });
}

function processExcel(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
            findHeaderAndProcess(jsonData);
        } catch (error) {
            const t = TRANSLATIONS[state.currentLang];
            showToast(t.excelProcessError || 'Помилка обробки Excel файлу', 'error');
            hideLoading();
        }
    };
    reader.readAsArrayBuffer(file);
}

async function findHeaderAndProcess(rows) {
    const t = TRANSLATIONS[state.currentLang];

    // Try to find header row by checking for known column aliases
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(rows.length, 30); i++) {
        const row = rows[i];
        if (!row || row.length < 3) continue;

        // Count how many known aliases we find in this row
        let matchCount = 0;
        COLUMN_DEFINITIONS.forEach(def => {
            row.forEach(cell => {
                if (!cell || typeof cell !== 'string') return;
                const cellLower = cell.toLowerCase().trim();
                if (def.aliases.some(alias => cellLower.includes(alias.toLowerCase()))) {
                    matchCount++;
                }
            });
        });

        // If we find at least 3 known columns, consider this the header row
        if (matchCount >= 3) {
            headerRowIndex = i;
            break;
        }
    }

    if (headerRowIndex === -1) {
        showToast(t.headerNotFound || 'Не знайдено рядок з заголовками колонок', 'error');
        hideLoading();
        return;
    }

    state.rawHeaders = rows[headerRowIndex];
    state.rawRows = rows.slice(headerRowIndex + 1);

    // Try to load saved mapping first
    let mapping = loadMappingFromStorage(state.rawHeaders);

    if (!mapping) {
        // Auto-map columns
        const { mapped, unmapped } = autoMapColumns(state.rawHeaders);

        if (unmapped.length > 0) {
            // Show wizard for unmapped required columns
            const userMapping = await showMappingWizard(state.rawHeaders, unmapped);

            if (!userMapping) {
                // User cancelled
                showToast(t.mappingCancelled || 'Маппінг колонок скасовано', 'warning');
                hideLoading();
                return;
            }

            // Merge auto-mapped and user-mapped
            mapping = { ...mapped, ...userMapping };

            // Save for future use
            saveMappingToStorage(mapping, state.rawHeaders);
            showToast(t.mappingSaved || 'Налаштування колонок збережено', 'success', 3000);
        } else {
            // All columns auto-mapped successfully
            mapping = mapped;
        }
    }

    state.rawColIndices = mapping;
    setupGlobalFilters();
    recalculateDashboard();
    updateRateBadge();
    hideLoading();
}

/**
 * Open the column mapping wizard manually
 */
export async function openColumnWizard() {
    if (!state.rawHeaders || state.rawHeaders.length === 0) {
        const t = TRANSLATIONS[state.currentLang];
        showToast(t.noFileLoaded || 'Спершу завантажте файл', 'warning');
        return;
    }

    const t = TRANSLATIONS[state.currentLang];
    const userMapping = await showMappingWizard(state.rawHeaders, state.rawColIndices);

    if (userMapping) {
        state.rawColIndices = userMapping;
        saveMappingToStorage(userMapping, state.rawHeaders);
        setupGlobalFilters();
        recalculateDashboard();
        updateRateBadge();
        showToast(t.mappingSaved || 'Налаштування колонок збережено', 'success');
    }
}
