// --- Column Mapper: Flexible column detection with fallback wizard ---

import { state } from './config.js';
import { TRANSLATIONS } from './i18n.js';
import { showToast } from './notifications.js';

// Column definitions with known aliases
export const COLUMN_DEFINITIONS = [
    {
        key: 'idxName',
        required: true,
        aliases: ['Контрагент відправник по МЕН', 'Client Name', 'Sender', 'Відправник', 'Name'],
        labelKey: 'colClientName'
    },
    {
        key: 'idxRev',
        required: true,
        aliases: ['Shipment вартість послуг', 'Revenue', 'Cost', 'Вартість', 'Price', 'Amount'],
        labelKey: 'colRevenue'
    },
    {
        key: 'idxCountry',
        required: true,
        aliases: ['Країна-відправник', 'Sender Country', 'Origin Country', 'From Country', 'Country'],
        labelKey: 'colOriginCountry'
    },
    {
        key: 'idxDestCountry',
        required: true,
        aliases: ['Країна отримувач', 'Receiver Country', 'Destination Country', 'To Country', 'Dest Country'],
        labelKey: 'colDestCountry'
    },
    {
        key: 'idxType',
        required: false,
        aliases: ['Тип відправника по МЕН', 'Sender Type', 'Client Type', 'Type'],
        labelKey: 'colClientType'
    },
    {
        key: 'idxDesc',
        required: false,
        aliases: ['Опис відправлення', 'Description', 'Item Description', 'Goods', 'Content'],
        labelKey: 'colDescription'
    },
    {
        key: 'idxSegment',
        required: false,
        aliases: ['Сегмент відправника_', 'Segment', 'Client Segment', 'Category'],
        labelKey: 'colSegment'
    },
    {
        key: 'idxPhone',
        required: false,
        aliases: ['тел отправитель', 'Телефон відправника', 'Phone', 'Telephone', 'Contact'],
        labelKey: 'colPhone'
    },
    {
        key: 'idxDate',
        required: false,
        aliases: ['IWB дата створення', 'Дата оформлення', 'Shipment Date', 'Date', 'Дата', 'Created Date'],
        labelKey: 'colDate'
    },
    {
        key: 'idxCurr',
        required: false,
        aliases: ['Shipment валюта вартості послуг', 'Currency', 'Валюта'],
        labelKey: 'colCurrency'
    },
    {
        key: 'idxSenderChannel',
        required: false,
        aliases: ['Тип підрозділу відправника', 'Sender Channel', 'Pickup Type', 'From Channel'],
        labelKey: 'colSenderChannel'
    },
    {
        key: 'idxReceiverChannel',
        required: false,
        aliases: ['Тип підрозділу отримувача', 'Receiver Channel', 'Delivery Type', 'To Channel'],
        labelKey: 'colReceiverChannel'
    },
    {
        key: 'idxWeight',
        required: false,
        aliases: ['Розрахункова вага', 'Weight', 'Вага', 'Calculated Weight'],
        labelKey: 'colWeight'
    },
    {
        key: 'idxSenderCity',
        required: false,
        aliases: ['Місто відправник', 'Sender City', 'From City', 'Origin City'],
        labelKey: 'colSenderCity'
    },
    {
        key: 'idxReceiverCity',
        required: false,
        aliases: ['Місто отримувач', 'Receiver City', 'To City', 'Destination City'],
        labelKey: 'colReceiverCity'
    },
    {
        key: 'idxShipmentNumber',
        required: false,
        aliases: ['МЕН Shipment', 'Номер відправлення', 'Shipment Number', 'Tracking Number', 'Waybill'],
        labelKey: 'colShipmentNumber'
    }
];

/**
 * Fuzzy match a header against aliases
 */
function fuzzyMatch(header, aliases) {
    const h = header.toLowerCase().trim();

    // Exact match
    for (const alias of aliases) {
        if (h === alias.toLowerCase()) return 100;
    }

    // Contains match
    for (const alias of aliases) {
        if (h.includes(alias.toLowerCase()) || alias.toLowerCase().includes(h)) return 80;
    }

    return 0;
}

/**
 * Auto-map columns from headers
 * @param {Array} headers - Array of column headers from the file
 * @returns {Object} { mapped: {key: index}, unmapped: [definitions] }
 */
export function autoMapColumns(headers) {
    const mapped = {};
    const unmapped = [];

    COLUMN_DEFINITIONS.forEach(def => {
        let bestMatch = -1;
        let bestScore = 0;

        headers.forEach((header, idx) => {
            if (!header || typeof header !== 'string') return;
            const score = fuzzyMatch(header, def.aliases);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = idx;
            }
        });

        if (bestScore >= 80) {
            mapped[def.key] = bestMatch;
        } else if (def.required) {
            unmapped.push(def);
        } else {
            mapped[def.key] = -1; // Optional column not found
        }
    });

    return { mapped, unmapped };
}

/**
 * Show mapping wizard modal for unmapped required columns
 * @param {Array} headers - File headers
 * @param {Array} unmappedDefs - Array of unmapped column definitions
 * @returns {Promise<Object>} Resolved mapping
 */
/**
 * Show mapping wizard modal for ALL columns (manual or auto-triggered)
 * @param {Array} headers - File headers
 * @param {Object} currentMapping - Current mapping object {key: index} (optional)
 * @param {Array} unmappedDefs - Array of specific columns to highlight/prompt (optional, forces open if not empty)
 * @returns {Promise<Object>} Resolved mapping
 */
export function showMappingWizard(headers, currentMapping = {}, unmappedDefs = []) {
    return new Promise((resolve) => {
        const modal = document.getElementById('mappingWizardModal');
        const container = document.getElementById('mappingWizardContent');
        const t = TRANSLATIONS[state.currentLang];

        // Sort: Required first, then by internal order
        const sortedDefs = [...COLUMN_DEFINITIONS].sort((a, b) => {
            if (a.required === b.required) return 0;
            return a.required ? -1 : 1;
        });

        // Helper to check if a specific def needs attention
        const isUnmappedAndRequired = (def) => unmappedDefs.find(d => d.key === def.key);

        container.innerHTML = `
            <div class="mb-4">
                <p class="text-sm text-gray-600">
                    ${unmappedDefs.length > 0
                ? (t.mappingWizardDesc || 'Деякі обов\'язкові колонки не знайдено автоматично. Будь ласка, оберіть їх:')
                : (t.mappingWizardEditDesc || 'Налаштування відповідності колонок вашого файлу полям системи:')}
                </p>
            </div>
            <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                ${sortedDefs.map(def => {
                    const savedIndex = currentMapping[def.key];
                    const hasError = isUnmappedAndRequired(def);
                    return `
                    <div class="border-b border-gray-100 pb-3 last:border-0">
                        <label class="block text-sm font-medium ${hasError ? 'text-red-700' : 'text-gray-700'} mb-1">
                            ${t[def.labelKey] || def.key} ${def.required ? '<span class="text-red-500">*</span>' : '<span class="text-gray-400 text-xs font-normal">(' + (t.optional || 'опціонально') + ')</span>'}
                        </label>
                        <select class="w-full border ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" data-key="${def.key}" data-required="${def.required}">
                            <option value="-1">-- ${t.selectColumn || 'Оберіть колонку (не використовується)'} --</option>
                            ${headers.map((h, idx) => `
                                <option value="${idx}" ${savedIndex === idx ? 'selected' : ''}>
                                    ${idx + 1}. ${h || `(Column ${idx + 1})`}
                                </option>
                            `).join('')}
                        </select>
                         ${def.aliases && def.aliases.length > 0 ? `<p class="text-xs text-gray-400 mt-1 truncate">Alias: ${def.aliases.slice(0, 3).join(', ')}...</p>` : ''}
                    </div>
                `;
                }).join('')}
            </div>
        `;

        modal.classList.remove('hidden');

        const confirmBtn = document.getElementById('mappingWizardConfirm');
        const cancelBtn = document.getElementById('mappingWizardCancel');

        const cleanup = () => {
            modal.classList.add('hidden');
            confirmBtn.replaceWith(confirmBtn.cloneNode(true)); // remove listeners
            cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        };

        // Re-query buttons after cloning in cleanup (safe pattern: bind on new instances)
        // Actually, better to just bind 'onclick' directly to element as in original code
        // But we need to be careful not to stack listeners if we didn't clone...
        // The original code did `replaceWith(clone)` inside cleanup, which is good.
        // We will stick to `document.getElementById(...).onclick = ...` pattern for simplicity here.

        document.getElementById('mappingWizardConfirm').onclick = () => {
            const selects = container.querySelectorAll('select');
            const userMapping = {};
            let allRequiredValid = true;

            selects.forEach(select => {
                const key = select.dataset.key;
                const required = select.dataset.required === 'true';
                const value = parseInt(select.value);

                if (required && value === -1) {
                    allRequiredValid = false;
                    select.classList.add('border-red-500', 'bg-red-50');
                } else {
                    select.classList.remove('border-red-500', 'bg-red-50');
                }

                userMapping[key] = value;
            });

            if (!allRequiredValid) {
                showToast(t.mappingIncomplete || 'Будь ласка, оберіть всі обов\'язкові колонки', 'warning');
                return;
            }

            cleanup();
            resolve(userMapping);
        };

        document.getElementById('mappingWizardCancel').onclick = () => {
            cleanup();
            resolve(null);
        };
    });
}

/**
 * Save column mapping to localStorage
 */
export function saveMappingToStorage(mapping, headers) {
    try {
        const mappingData = {
            mapping,
            headers: headers.map(h => (h || '').toString().toLowerCase().trim()),
            timestamp: Date.now()
        };
        localStorage.setItem('ca-column-mapping', JSON.stringify(mappingData));
    } catch (e) {
        console.warn('Could not save mapping to localStorage:', e);
    }
}

/**
 * Load column mapping from localStorage
 * @param {Array} currentHeaders - Current file headers
 * @returns {Object|null} Saved mapping if headers match
 */
export function loadMappingFromStorage(currentHeaders) {
    try {
        const saved = localStorage.getItem('ca-column-mapping');
        if (!saved) return null;

        const data = JSON.parse(saved);
        const currentNormalized = currentHeaders.map(h => (h || '').toString().toLowerCase().trim());

        // Check if headers match (same order and names)
        if (JSON.stringify(data.headers) === JSON.stringify(currentNormalized)) {
            return data.mapping;
        }
    } catch (e) {
        console.warn('Could not load mapping from localStorage:', e);
    }
    return null;
}
