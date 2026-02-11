// --- Currency: live rate fetching and badge rendering ---

import { state } from './config.js';

export async function fetchCurrencyRates() {
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/EUR');
        if (res.ok) {
            const data = await res.json();
            if (data && data.rates) {
                state.currentRates = { ...state.currentRates, ...data.rates };
                state.isRatesLive = true;
                updateRateBadge();
            }
        }
    } catch (e) {
        console.warn("Could not fetch live rates, using fallback.", e);
    }
}

export function updateRateBadge() {
    const el = document.getElementById('rateBadge');
    const icon = document.getElementById('rateIcon');
    const txt = document.getElementById('rateText');

    el.classList.remove('hidden');
    if (state.isRatesLive) {
        el.className = "bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1";
        icon.textContent = "🟢";
        txt.textContent = state.currentLang === 'ua' ? "Курс: Live" : "Rates: Live";
    } else {
        el.className = "bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1";
        icon.textContent = "🟡";
        txt.textContent = state.currentLang === 'ua' ? "Курс: Fixed" : "Rates: Fixed";
    }
}
