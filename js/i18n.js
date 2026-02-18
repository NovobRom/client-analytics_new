// --- Internationalisation: Translations & Language Helpers ---

import { state, COUNTRY_MAP } from './config.js';

export const TRANSLATIONS = {
    ua: {
        appTitle: "Аналітика Клієнтів v18.1",
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
        manualTitle: "Інструкція користувача",
        chartLabelRev: "Дохід (€)",
        chartLabelAvg: "Сер. Чек (€)",
        chartLabelCount: "Кількість",
        lblTotalRows: "Всього рядків:",
        btnPrev: "Назад",
        btnNext: "Вперед",
        lblPage: "Стор.",
        // Weight
        totalWeight: "Загальна вага",
        avgWeightShipment: "Сер. вага / відправлення",
        revenuePerKg: "Дохід за кг",
        shipmentsWithWeight: "Відправок з вагою",
        thWeight: "Вага (кг)",
        // Channel charts
        chartSenderChannels: "📤 Розподіл каналів відправлення",
        chartReceiverChannels: "📥 Розподіл каналів отримання",
        chartChannelRevenue: "💰 Дохід за каналом відправлення",
        chartChannelFlow: "🔀 Матриця потоку каналів",
        channelAbcTitle: "Канальні вподобання за ABC класом",
        // Weight charts
        chartWeightByDirection: "📦 Середня вага за напрямком (Топ-10)",
        chartWeightByChannel: "⚖️ Середня вага за каналом",
        weightAbcTitle: "Середня вага за ABC класом",
        chartLabelAvgWeight: "Сер. вага (кг)",
        // City charts
        chartTopSenderCities: "🏙️ Топ-10 міст відправлення (дохід)",
        chartTopReceiverCities: "🏙️ Топ-10 міст отримання (дохід)",
        chartTopCityRoutes: "🛤️ Топ-10 маршрутів місто→місто",
        chartRevPerKgDirection: "💎 Дохід за кг по напрямку (Топ-10)",

        chartLabelRevPerKg: "€/кг",
        // Modal additions
        modalTotalWeight: "Вага",
        modalAvgWeightTitle: "Сер. Вага",
        modalSenderChTitle: "📤 Канали відправлення",
        modalReceiverChTitle: "📥 Канали отримання",
        modalSenderCitiesTitle: "🏙️ Міста відправлення (Топ-5)",
        modalReceiverCitiesTitle: "🏙️ Міста отримання (Топ-5)",
        // Column mapping wizard
        mappingWizardTitle: "Налаштування колонок",
        mappingWizardDesc: "Деякі обов'язкові колонки не знайдено автоматично. Будь ласка, оберіть відповідні колонки з вашого файлу:",
        selectColumn: "Оберіть колонку",
        mappingIncomplete: "Будь ласка, оберіть всі обов'язкові колонки",
        mappingCancelled: "Маппінг колонок скасовано",
        mappingSaved: "Налаштування колонок збережено",
        btnConfirm: "Підтвердити",
        btnCancel: "Скасувати",
        // Column labels
        colClientName: "Ім'я клієнта",
        colRevenue: "Дохід",
        colOriginCountry: "Країна відправлення",
        colDestCountry: "Країна отримання",
        colClientType: "Тип клієнта",
        colDescription: "Опис відправлення",
        colSegment: "Сегмент",
        colPhone: "Телефон",
        colDate: "Дата",
        colCurrency: "Валюта",
        colSenderChannel: "Канал відправлення",
        colReceiverChannel: "Канал отримання",
        colWeight: "Вага",
        colSenderCity: "Місто відправлення",
        colReceiverCity: "Місто отримання",
        // Error messages
        unsupportedFileType: "Непідтримуваний тип файлу. Використовуйте CSV або XLSX",
        csvParseError: "Помилка парсингу CSV",
        excelProcessError: "Помилка обробки Excel файлу",
        headerNotFound: "Не знайдено рядок з заголовками колонок",
        // Export
        btnExport: "Експорт в Excel",
        exportNoData: "Немає даних для експорту",
        exportSuccess: "Експортовано успішно",
        exportError: "Помилка експорту",
        // НОВИЙ РОЗДІЛ: Підказки для графіків
        hints: {
            abc: "Розподіл наших клієнтів за важливістю для бізнесу (80/15/5)",
            topCountriesAvg: "Де наші клієнти платять найбільше за одне відправлення?",
            topDestinations: "Географія відправок наших найприбутковіших клієнтів",
            channelFlow: "Які комбінації (Забір → Вручення) найпопулярніші в нашій мережі?",
            cityRoutes: "Найзавантаженіші логістичні маршрути між містами",
            revPerKg: "Які напрямки приносять нам найбільше доходу за кожен кілограм?",
            weightAbc: "Чи відправляють наші VIP-клієнти важчі вантажі, ніж інші?",
            senderChannel: "Яким способом наші клієнти найчастіше відправляють вантаж?",
            receiverChannel: "Як кінцеві отримувачі воліють забирати посилки?",
            topClientsRev: "Хто є нашими ключовими фінансовими партнерами?",
            topClientsCount: "Хто створює найбільше навантаження на операційні процеси?",
            weightDirection: "Куди ми возимо 'повітря', а куди — важкі вантажі?"
        },
        exportSheetName: "Аналіз Клієнтів"
    },
    en: {
        appTitle: "Client Analytics v18.1",
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
        manualTitle: "User Manual",
        chartLabelRev: "Revenue (€)",
        chartLabelAvg: "Avg Check (€)",
        chartLabelCount: "Count",
        lblTotalRows: "Total rows:",
        btnPrev: "Prev",
        btnNext: "Next",
        lblPage: "Page",
        // Weight
        totalWeight: "Total Weight",
        avgWeightShipment: "Avg Weight / Shipment",
        revenuePerKg: "Revenue per kg",
        shipmentsWithWeight: "Shipments with Weight",
        thWeight: "Weight (kg)",
        // Channel charts
        chartSenderChannels: "📤 Sender Channel Distribution",
        chartReceiverChannels: "📥 Receiver Channel Distribution",
        chartChannelRevenue: "💰 Revenue by Sender Channel",
        chartChannelFlow: "🔀 Channel Flow Matrix",
        channelAbcTitle: "Channel Preferences by ABC Class",
        // Weight charts
        chartWeightByDirection: "📦 Avg Weight by Direction (Top 10)",
        chartWeightByChannel: "⚖️ Avg Weight by Channel",
        weightAbcTitle: "Avg Weight by ABC Class",
        chartLabelAvgWeight: "Avg Weight (kg)",
        // City charts
        chartTopSenderCities: "🏙️ Top 10 Sender Cities (Revenue)",
        chartTopReceiverCities: "🏙️ Top 10 Receiver Cities (Revenue)",
        chartTopCityRoutes: "🛤️ Top 10 City-to-City Routes",
        chartRevPerKgDirection: "💎 Revenue per kg by Direction (Top 10)",

        chartLabelRevPerKg: "€/kg",
        // Modal additions
        modalTotalWeight: "Weight",
        modalAvgWeightTitle: "Avg Weight",
        modalSenderChTitle: "📤 Sender Channels",
        modalReceiverChTitle: "📥 Receiver Channels",
        modalSenderCitiesTitle: "🏙️ Sender Cities (Top 5)",
        modalReceiverCitiesTitle: "🏙️ Receiver Cities (Top 5)",
        // Column mapping wizard
        mappingWizardTitle: "Column Mapping",
        mappingWizardDesc: "Some required columns were not found automatically. Please select the corresponding columns from your file:",
        selectColumn: "Select column",
        mappingIncomplete: "Please select all required columns",
        mappingCancelled: "Column mapping cancelled",
        mappingSaved: "Column mapping saved",
        btnConfirm: "Confirm",
        btnCancel: "Cancel",
        // Column labels
        colClientName: "Client Name",
        colRevenue: "Revenue",
        colOriginCountry: "Origin Country",
        colDestCountry: "Destination Country",
        colClientType: "Client Type",
        colDescription: "Description",
        colSegment: "Segment",
        colPhone: "Phone",
        colDate: "Date",
        colCurrency: "Currency",
        colSenderChannel: "Sender Channel",
        colReceiverChannel: "Receiver Channel",
        colWeight: "Weight",
        colSenderCity: "Sender City",
        colReceiverCity: "Receiver City",
        // Error messages
        unsupportedFileType: "Unsupported file type. Use CSV or XLSX",
        csvParseError: "CSV parsing error",
        excelProcessError: "Excel processing error",
        headerNotFound: "Header row not found",
        // Export
        btnExport: "Export to Excel",
        exportNoData: "No data to export",
        exportSuccess: "Exported successfully",
        exportError: "Export error",
        exportSheetName: "Client Analysis",
        hints: {
            abc: "Distribution of our clients by business value (80/15/5)",
            topCountriesAvg: "Where do our clients pay the most per shipment?",
            topDestinations: "Shipping geography of our top revenue clients",
            channelFlow: "Which combinations (Pickup → Delivery) are most popular in our network?",
            cityRoutes: "Busiest logistics routes between cities",
            revPerKg: "Which routes generate the most revenue per kg for us?",
            weightAbc: "Do our VIP clients ship heavier items compared to others?",
            senderChannel: "How do our clients most frequently send shipments?",
            receiverChannel: "How do final recipients prefer to collect parcels?",
            topClientsRev: "Who are our key financial partners?",
            topClientsCount: "Who creates the most operational workload?",
            weightDirection: "Where do we ship 'air' vs heavy cargo?"
        }
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
        // Handle nested keys like "hints.abc"
        const parts = key.split('.');
        let val = t;
        for (const p of parts) {
            val = val ? val[p] : undefined;
        }
        if (val) el.textContent = val;
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
