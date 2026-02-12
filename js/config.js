// --- Configuration: Constants & Shared State ---

export const POTENTIAL_BUSINESS_COUNT = 3;
export const ITEMS_PER_PAGE = 50;

export const FALLBACK_RATES = {
    'EUR': 1.0,
    'USD': 1.19,
    'UAH': 51.13,
    'PLN': 4.22,
    'GBP': 0.87,
    'CZK': 24.26,
    'RON': 5.09,
    'MDL': 20.11,
    'HUF': 379.5
};

export const COUNTRY_MAP = {
    'AT': { ua: 'Австрія', en: 'Austria' },
    'CN': { ua: 'Китай', en: 'China' },
    'CZ': { ua: 'Чехія', en: 'Czech Republic' },
    'DE': { ua: 'Німеччина', en: 'Germany' },
    'EE': { ua: 'Естонія', en: 'Estonia' },
    'ES': { ua: 'Іспанія', en: 'Spain' },
    'FR': { ua: 'Франція', en: 'France' },
    'GB': { ua: 'Велика Британія', en: 'Great Britain' },
    'HU': { ua: 'Угорщина', en: 'Hungary' },
    'IT': { ua: 'Італія', en: 'Italy' },
    'LT': { ua: 'Литва', en: 'Lithuania' },
    'LV': { ua: 'Латвія', en: 'Latvia' },
    'MD': { ua: 'Молдова', en: 'Moldova' },
    'NL': { ua: 'Нідерланди', en: 'Netherlands' },
    'PL': { ua: 'Польща', en: 'Poland' },
    'RO': { ua: 'Румунія', en: 'Romania' },
    'SK': { ua: 'Словаччина', en: 'Slovakia' }
};

// Shared mutable application state — imported and mutated by all modules
export const state = {
    rawHeaders: [],
    rawRows: [],
    rawColIndices: {},
    globalClientData: [],
    displayedClientData: [],
    charts: {},
    segmentStatsGlobal: {},
    currentPage: 1,
    currentRates: { ...FALLBACK_RATES },
    isRatesLive: false,
    currentLang: 'ua',
    activeSegmentFilter: 'ALL',
    activeCountryFilter: null,
    activeAbcFilter: null,
};
