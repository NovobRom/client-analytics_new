// --- Internationalisation: Translations & Language Helpers ---

import { state, COUNTRY_MAP } from './config.js';

export const TRANSLATIONS = {
    ua: {
        appTitle: "Аналітика Клієнтів v14.1",
        btnUpload: "Завантажити файл",
        loadingText: "Обробка даних...",
        loadingSub: "Це може зайняти кілька секунд",
        lblPeriod: "Період:",
        lblDateNotFound: "Дата не знайдена",
        settingsTitle: "Налаштування Аналізу (Глобальний фільтр)",
        lblOrigins: "📤 Країни відправлення",
        lblDestinations: "📥 Країни отримання",
        btnSelectAll: "Всі",
        btnUnselectAll: "Жодної",
        abcTitle: "ABC АНАЛІЗ (РОЗПОДІЛ ПАРЕТО)",
        classA: "Клас A (VIP)",
        classB: "Клас B",
        classC: "Клас C",
        percIncome80: "80% Доходу",
        percIncome15: "15% Доходу",
        percIncome5: "5% Доходу",
        abcFilterActive: "Фільтр активний (Клікніть, щоб скинути)",
        totalClients: "Всього Клієнтів",
        totalRevenue: "Загальний Дохід",
        avgCheckGlobal: "Середній Чек (Global)",
        lblOriginBreakdown: "Вклад країн відправників (Дохід)",
        topCountriesRev: "🌍 Топ Країн-отримувачів (Дохід)",
        clickToFilterCountry: "Натисни на країну, щоб відфільтрувати список клієнтів",
        topCountriesAvg: "📊 Топ Країн за СЕРЕДНІМ ЧЕКОМ",
        topClientsRev: "💰 Топ-10 Клієнтів за Доходом",
        topClientsAvg: "💎 Топ-10 Клієнтів за СЕРЕДНІМ ЧЕКОМ",
        topClientsCount: "📦 Топ-10 Клієнтів за Кількістю",
        clickToFindClient: "Натисни на стовпчик, щоб знайти клієнта в таблиці",
        topDestinations: "✈️ Куди відправляють Топ-10 (за доходом)",
        clickNameX: "Натисни на ім'я клієнта (вісь X), щоб знайти його",
        filterBySegment: "ФІЛЬТР ПО СЕГМЕНТАХ",
        detailedList: "Детальний список клієнтів",
        resetSearch: "Скинути пошук",
        searchPlaceholder: "Пошук клієнта...",
        emptyStateText: "Завантаж файл (.csv, .xlsx, .xls), щоб почати аналіз",
        thClient: "Клієнт",
        thSegment: "Сегмент",
        thRevenue: "Дохід (EUR)",
        thCount: "К-сть",
        thAvgCheck: "Сер. Чек",
        thDest: "Куди (Топ)",
        thItem: "Що (Топ)",
        lblSegment: "Сегмент",
        lblCountry: "Країна",
        lblAll: "Всі",
        modalPhone: "📞 Телефон:",
        modalRevTitle: "Дохід",
        modalABCTitle: "Клас ABC",
        modalCountTitle: "Відправок",
        modalAvgTitle: "Сер. Чек",
        modalGeoTitle: "🌍 Географія відправок",
        modalItemsTitle: "📦 Що відправляли",
        modalOriginTitle: "Країна походження:",
        modalSegTitle: "Сегмент:",
        btnClose: "Закрити",
        chartLabelRev: "Дохід (€)",
        chartLabelAvg: "Сер. Чек (€)",
        chartLabelCount: "Кількість",
        lblTotalRows: "Всього рядків:",
        btnPrev: "Назад",
        btnNext: "Вперед",
        lblPage: "Стор."
    },
    en: {
        appTitle: "Client Analytics v14.1",
        btnUpload: "Upload File",
        loadingText: "Processing Data...",
        loadingSub: "This may take a few seconds",
        lblPeriod: "Period:",
        lblDateNotFound: "Date not found",
        settingsTitle: "Analysis Settings (Global Filter)",
        lblOrigins: "📤 Origin Countries",
        lblDestinations: "📥 Destination Countries",
        btnSelectAll: "All",
        btnUnselectAll: "None",
        abcTitle: "ABC ANALYSIS (PARETO DISTRIBUTION)",
        classA: "Class A (VIP)",
        classB: "Class B",
        classC: "Class C",
        percIncome80: "80% Revenue",
        percIncome15: "15% Revenue",
        percIncome5: "5% Revenue",
        abcFilterActive: "Filter Active (Click to Reset)",
        totalClients: "Total Clients",
        totalRevenue: "Total Revenue",
        avgCheckGlobal: "Avg Check (Global)",
        lblOriginBreakdown: "Revenue by Origin Country",
        topCountriesRev: "🌍 Top Destination Countries (Revenue)",
        clickToFilterCountry: "Click on a country bar to filter client list",
        topCountriesAvg: "📊 Top Countries by AVG CHECK",
        topClientsRev: "💰 Top 10 Clients by Revenue",
        topClientsAvg: "💎 Top 10 Clients by AVG CHECK",
        topClientsCount: "📦 Top 10 Clients by Count",
        clickToFindClient: "Click bar to find client in table",
        topDestinations: "✈️ Where Top 10 (Revenue) ship to",
        clickNameX: "Click client name (X-axis) to find them",
        filterBySegment: "FILTER BY SEGMENT",
        detailedList: "Detailed Client List",
        resetSearch: "Reset Search",
        searchPlaceholder: "Search client...",
        emptyStateText: "Upload file (.csv, .xlsx, .xls) to start analysis",
        thClient: "Client",
        thSegment: "Segment",
        thRevenue: "Revenue (EUR)",
        thCount: "Count",
        thAvgCheck: "Avg Check",
        thDest: "Where (Top)",
        thItem: "What (Top)",
        lblSegment: "Segment",
        lblCountry: "Country",
        lblAll: "All",
        modalPhone: "📞 Phone:",
        modalRevTitle: "Revenue",
        modalABCTitle: "ABC Class",
        modalCountTitle: "Shipments",
        modalAvgTitle: "Avg Check",
        modalGeoTitle: "🌍 Geography",
        modalItemsTitle: "📦 Top Items",
        modalOriginTitle: "Origin:",
        modalSegTitle: "Segment:",
        btnClose: "Close",
        chartLabelRev: "Revenue (€)",
        chartLabelAvg: "Avg Check (€)",
        chartLabelCount: "Count",
        lblTotalRows: "Total rows:",
        btnPrev: "Prev",
        btnNext: "Next",
        lblPage: "Page"
    }
};

/**
 * Updates all [data-i18n] elements and dynamic UI text to the current language.
 * Charts and table are re-rendered by the caller after this runs.
 */
export function updateInterfaceLanguage() {
    const t = TRANSLATIONS[state.currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    document.getElementById('loadingText').textContent = t.loadingText;
    document.getElementById('searchTable').placeholder = t.searchPlaceholder;
}

/**
 * Returns the localised country name for a given ISO-2 code.
 */
export function getCountryName(code) {
    if (!code) return "Unknown";
    const upper = code.toUpperCase().trim();
    if (COUNTRY_MAP[upper]) {
        return COUNTRY_MAP[upper][state.currentLang];
    }
    return upper;
}

/**
 * Returns an HTML string for a country flag using the flag-icons CSS library.
 */
export function getFlagHtml(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '';
    const lowerCode = countryCode.toLowerCase();
    return `<span class="fi fi-${lowerCode} rounded shadow-sm" style="font-size: 1.2em;"></span>`;
}
