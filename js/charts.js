// --- Charts: all Chart.js rendering logic ---
// Chart and ChartDataLabels are global CDN objects.
// ChartDataLabels is registered once in app.js before any charts are drawn.

import { state } from './config.js';
import { TRANSLATIONS, getCountryName } from './i18n.js';
import { triggerCountryFilter, triggerClientSearch } from './filters.js';

export function renderCharts(clients, countryStats) {
    const t = TRANSLATIONS[state.currentLang];

    // Destroy previous chart instances to avoid canvas reuse errors
    ['revenue', 'revenueCountry', 'avgCheck', 'avgCheckCountry', 'count', 'dest'].forEach(k => {
        if (state.charts[k]) state.charts[k].destroy();
    });

    const topByRev = [...clients].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
    const topByCount = [...clients].sort((a, b) => b.count - a.count).slice(0, 10);
    const topByAvgCheck = [...clients].filter(c => c.count > 1).sort((a, b) => b.avgCheck - a.avgCheck).slice(0, 10);

    // Shared datalabels configs
    const dlConfig = { color: 'white', font: { weight: 'bold', size: 10 }, formatter: Math.round, anchor: 'end', align: 'start', offset: -4 };
    const dlConfigH = { ...dlConfig, align: 'end', anchor: 'end', color: '#555', offset: 0 };

    // --- Country Revenue (horizontal bar) ---
    const sortedCountriesRev = Object.entries(countryStats).sort((a, b) => b[1].rev - a[1].rev).slice(0, 10);
    const ctxCountryRev = document.getElementById('countryRevenueChart').getContext('2d');
    state.charts.revenueCountry = new Chart(ctxCountryRev, {
        type: 'bar',
        data: {
            _rawCodes: sortedCountriesRev.map(x => x[0]),
            labels: sortedCountriesRev.map(x => getCountryName(x[0])),
            datasets: [{ label: t.chartLabelRev, data: sortedCountriesRev.map(x => x[1].rev), backgroundColor: '#8b5cf6', borderRadius: 4 }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            onClick: (evt, elements, chart) => { if (elements.length > 0) triggerCountryFilter(chart.data._rawCodes[elements[0].index]); },
            plugins: { datalabels: dlConfigH }
        }
    });

    // --- Country Avg Check (horizontal bar) ---
    const sortedCountriesAvg = Object.entries(countryStats)
        .map(([k, v]) => ({ code: k, avg: v.count ? v.rev / v.count : 0 }))
        .filter(x => x.avg > 0)
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 10);
    const ctxCountryAvg = document.getElementById('countryAvgCheckChart').getContext('2d');
    state.charts.avgCheckCountry = new Chart(ctxCountryAvg, {
        type: 'bar',
        data: {
            labels: sortedCountriesAvg.map(x => getCountryName(x.code)),
            datasets: [{ label: t.chartLabelAvg, data: sortedCountriesAvg.map(x => x.avg), backgroundColor: '#14b8a6', borderRadius: 4 }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            plugins: { datalabels: { ...dlConfigH, formatter: v => v.toFixed(1) } }
        }
    });

    // --- Top-10 Clients by Revenue ---
    const ctxRev = document.getElementById('revenueChart').getContext('2d');
    state.charts.revenue = new Chart(ctxRev, {
        type: 'bar',
        data: { labels: topByRev.map(c => c.name), datasets: [{ label: t.chartLabelRev, data: topByRev.map(c => c.revenue), backgroundColor: '#3b82f6', borderRadius: 4 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            onClick: (evt, el, chart) => { if (el.length) triggerClientSearch(chart.data.labels[el[0].index]); },
            plugins: { datalabels: dlConfig },
            scales: { x: { ticks: { callback: function(val) { return this.getLabelForValue(val).substr(0, 10) + '...'; } } } }
        }
    });

    // --- Top-10 Clients by Avg Check ---
    const ctxAvgCheck = document.getElementById('avgCheckChart').getContext('2d');
    state.charts.avgCheck = new Chart(ctxAvgCheck, {
        type: 'bar',
        data: { labels: topByAvgCheck.map(c => c.name), datasets: [{ label: t.chartLabelAvg, data: topByAvgCheck.map(c => c.avgCheck), backgroundColor: '#f43f5e', borderRadius: 4 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            onClick: (evt, el, chart) => { if (el.length) triggerClientSearch(chart.data.labels[el[0].index]); },
            plugins: { datalabels: { ...dlConfig, formatter: v => v.toFixed(0) } },
            scales: { x: { ticks: { callback: function(val) { return this.getLabelForValue(val).substr(0, 10) + '...'; } } } }
        }
    });

    // --- Top-10 Clients by Count ---
    const ctxCount = document.getElementById('countChart').getContext('2d');
    state.charts.count = new Chart(ctxCount, {
        type: 'bar',
        data: { labels: topByCount.map(c => c.name), datasets: [{ label: t.chartLabelCount, data: topByCount.map(c => c.count), backgroundColor: '#f59e0b', borderRadius: 4 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            onClick: (evt, el, chart) => { if (el.length) triggerClientSearch(chart.data.labels[el[0].index]); },
            plugins: { datalabels: dlConfig },
            scales: { x: { ticks: { callback: function(val) { return this.getLabelForValue(val).substr(0, 10) + '...'; } } } }
        }
    });

    // --- Destination stacked bar (Top-10 by revenue) ---
    const topClientsDest = topByRev;
    const allCountriesCodes = new Set();
    topClientsDest.forEach(c => Object.keys(c.destinationsMap).forEach(ctry => allCountriesCodes.add(ctry)));
    const countriesList = Array.from(allCountriesCodes).slice(0, 8);
    const datasets = countriesList.map((countryCode, index) => {
        const hue = (index * 360 / countriesList.length) % 360;
        return {
            label: getCountryName(countryCode),
            data: topClientsDest.map(c => c.destinationsMap[countryCode] || 0),
            backgroundColor: `hsl(${hue}, 60%, 65%)`,
            stack: 'Stack 0'
        };
    });
    const ctxDest = document.getElementById('destinationChart').getContext('2d');
    state.charts.dest = new Chart(ctxDest, {
        type: 'bar',
        data: { labels: topClientsDest.map(c => c.name), datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            onClick: (evt, el, chart) => { if (el.length) triggerClientSearch(chart.data.labels[el[0].index]); },
            plugins: {
                datalabels: {
                    display: context => context.dataset.data[context.dataIndex] > 0,
                    color: 'white', font: { size: 9 }, formatter: Math.round
                }
            },
            scales: {
                x: { stacked: true, ticks: { callback: function(val) { return this.getLabelForValue(val).substr(0, 10) + '...'; } } },
                y: { stacked: true }
            }
        }
    });
}
