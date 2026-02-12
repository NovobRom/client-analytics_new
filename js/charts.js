// --- Charts: all Chart.js rendering logic ---
// Chart and ChartDataLabels are global CDN objects.
// ChartDataLabels is registered once in app.js before any charts are drawn.

import { state } from './config.js';
import { TRANSLATIONS, getCountryName } from './i18n.js';
import { triggerCountryFilter, triggerClientSearch } from './filters.js';

const CHANNEL_COLORS = { 'Door': '#3b82f6', 'Warehouse': '#f59e0b', 'PUDO': '#10b981', 'Postomat': '#8b5cf6' };
const getChColor = (ch) => CHANNEL_COLORS[ch] || '#6b7280';

export function renderCharts(data) {
    const { clients, countryStats,
        senderChannelCounts, receiverChannelCounts, channelFlowMatrix,
        senderChannelRevenue, receiverChannelRevenue,
        senderChannelShipments, receiverChannelShipments,
        weightByDirection, weightByChannel, revenueByDirection,
        senderCityStats, receiverCityStats, cityRouteStats } = data;
    const t = TRANSLATIONS[state.currentLang];

    // Destroy previous chart instances to avoid canvas reuse errors
    ['revenue', 'revenueCountry', 'avgCheck', 'avgCheckCountry', 'count', 'dest',
        'senderChannel', 'receiverChannel', 'channelRevenue', 'channelFlow',
        'weightDirection', 'weightChannel',
        'senderCity', 'receiverCity', 'cityRoute', 'revPerKg'
    ].forEach(k => {
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
            layout: { padding: { right: 50 } },
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
            layout: { padding: { right: 50 } },
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
            scales: { x: { ticks: { callback: function (val) { return this.getLabelForValue(val).substr(0, 10) + '...'; } } } }
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
            scales: { x: { ticks: { callback: function (val) { return this.getLabelForValue(val).substr(0, 10) + '...'; } } } }
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
            scales: { x: { ticks: { callback: function (val) { return this.getLabelForValue(val).substr(0, 10) + '...'; } } } }
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
                    display: 'auto',
                    color: 'white', font: { size: 9 }, formatter: Math.round
                }
            },
            scales: {
                x: { stacked: true, ticks: { callback: function (val) { return this.getLabelForValue(val).substr(0, 10) + '...'; } } },
                y: { stacked: true }
            }
        }
    });

    // ========== NEW CHARTS ==========

    // --- Sender Channel Distribution (doughnut) ---
    const senderChEntries = Object.entries(senderChannelCounts).sort((a, b) => b[1] - a[1]);
    if (senderChEntries.length > 0) {
        const ctxSenderCh = document.getElementById('senderChannelChart').getContext('2d');
        state.charts.senderChannel = new Chart(ctxSenderCh, {
            type: 'doughnut',
            data: {
                labels: senderChEntries.map(e => `${e[0]} (${e[1]})`),
                datasets: [{
                    data: senderChEntries.map(e => e[1]),
                    backgroundColor: senderChEntries.map(e => getChColor(e[0]))
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        display: 'auto',
                        color: '#fff', font: { weight: 'bold', size: 11 },
                        formatter: (val, ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            return ((val / total) * 100).toFixed(1) + '%';
                        }
                    }
                }
            }
        });
    }

    // --- Receiver Channel Distribution (doughnut) ---
    const receiverChEntries = Object.entries(receiverChannelCounts).sort((a, b) => b[1] - a[1]);
    if (receiverChEntries.length > 0) {
        const ctxReceiverCh = document.getElementById('receiverChannelChart').getContext('2d');
        state.charts.receiverChannel = new Chart(ctxReceiverCh, {
            type: 'doughnut',
            data: {
                labels: receiverChEntries.map(e => `${e[0]} (${e[1]})`),
                datasets: [{
                    data: receiverChEntries.map(e => e[1]),
                    backgroundColor: receiverChEntries.map(e => getChColor(e[0]))
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        color: '#fff', font: { weight: 'bold', size: 11 },
                        formatter: (val, ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            return ((val / total) * 100).toFixed(1) + '%';
                        }
                    }
                }
            }
        });
    }

    // --- Revenue by Sender Channel (horizontal bar) ---
    const chRevEntries = Object.entries(senderChannelRevenue).sort((a, b) => b[1] - a[1]);
    if (chRevEntries.length > 0) {
        const ctxChRev = document.getElementById('channelRevenueChart').getContext('2d');
        state.charts.channelRevenue = new Chart(ctxChRev, {
            type: 'bar',
            data: {
                labels: chRevEntries.map(e => e[0]),
                datasets: [{
                    label: t.chartLabelRev,
                    data: chRevEntries.map(e => e[1]),
                    backgroundColor: chRevEntries.map(e => getChColor(e[0])),
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                layout: { padding: { right: 50 } },
                plugins: { datalabels: { ...dlConfigH, formatter: v => Math.round(v).toLocaleString() } }
            }
        });
    }

    // --- Channel Flow Matrix (stacked bar) ---
    const senderChannelsArr = Object.keys(senderChannelCounts).sort();
    const receiverChannelsArr = Object.keys(receiverChannelCounts).sort();
    if (senderChannelsArr.length > 0 && receiverChannelsArr.length > 0) {
        const flowDatasets = receiverChannelsArr.map(rCh => ({
            label: rCh,
            data: senderChannelsArr.map(sCh => channelFlowMatrix[`${sCh}→${rCh}`] || 0),
            backgroundColor: getChColor(rCh),
            stack: 'Stack 0'
        }));
        const ctxFlow = document.getElementById('channelFlowChart').getContext('2d');
        state.charts.channelFlow = new Chart(ctxFlow, {
            type: 'bar',
            data: { labels: senderChannelsArr, datasets: flowDatasets },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                scales: { x: { stacked: true }, y: { stacked: true } },
                plugins: {
                    datalabels: {
                        display: 'auto',
                        color: 'white', font: { size: 9 }, formatter: Math.round
                    }
                }
            }
        });
    }

    // --- Avg Weight by Direction Top-10 (horizontal bar) ---
    const weightDirEntries = Object.entries(weightByDirection)
        .map(([dir, v]) => ({ dir, avgWeight: v.totalWeight / v.count, count: v.count }))
        .filter(x => x.count >= 3)
        .sort((a, b) => b.avgWeight - a.avgWeight)
        .slice(0, 10);
    if (weightDirEntries.length > 0) {
        const ctxWeightDir = document.getElementById('weightDirectionChart').getContext('2d');
        state.charts.weightDirection = new Chart(ctxWeightDir, {
            type: 'bar',
            data: {
                labels: weightDirEntries.map(e => e.dir),
                datasets: [{
                    label: t.chartLabelAvgWeight || 'Avg Weight (kg)',
                    data: weightDirEntries.map(e => Math.round(e.avgWeight * 100) / 100),
                    backgroundColor: '#14b8a6', borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                layout: { padding: { right: 50 } },
                plugins: { datalabels: { ...dlConfigH, formatter: v => v.toFixed(2) + ' kg' } }
            }
        });
    }

    // --- Avg Weight by Channel (bar) ---
    const weightChEntries = Object.entries(weightByChannel)
        .map(([ch, v]) => ({ ch, avgWeight: v.totalWeight / v.count }))
        .sort((a, b) => b.avgWeight - a.avgWeight);
    if (weightChEntries.length > 0) {
        const ctxWeightCh = document.getElementById('weightChannelChart').getContext('2d');
        state.charts.weightChannel = new Chart(ctxWeightCh, {
            type: 'bar',
            data: {
                labels: weightChEntries.map(e => e.ch),
                datasets: [{
                    label: t.chartLabelAvgWeight || 'Avg Weight (kg)',
                    data: weightChEntries.map(e => Math.round(e.avgWeight * 100) / 100),
                    backgroundColor: weightChEntries.map(e => getChColor(e.ch)),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { datalabels: { ...dlConfig, formatter: v => v.toFixed(2) } }
            }
        });
    }

    // --- Top Sender Cities by Revenue (horizontal bar) ---
    const topSenderCities = Object.entries(senderCityStats)
        .sort((a, b) => b[1].rev - a[1].rev).slice(0, 10);
    if (topSenderCities.length > 0) {
        const ctxSenderCity = document.getElementById('senderCityChart').getContext('2d');
        state.charts.senderCity = new Chart(ctxSenderCity, {
            type: 'bar',
            data: {
                labels: topSenderCities.map(e => e[0]),
                datasets: [{
                    label: t.chartLabelRev, data: topSenderCities.map(e => e[1].rev),
                    backgroundColor: '#6366f1', borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                layout: { padding: { right: 50 } },
                plugins: { datalabels: { ...dlConfigH, formatter: v => Math.round(v).toLocaleString() } }
            }
        });
    }

    // --- Top Receiver Cities by Revenue (horizontal bar) ---
    const topReceiverCities = Object.entries(receiverCityStats)
        .sort((a, b) => b[1].rev - a[1].rev).slice(0, 10);
    if (topReceiverCities.length > 0) {
        const ctxReceiverCity = document.getElementById('receiverCityChart').getContext('2d');
        state.charts.receiverCity = new Chart(ctxReceiverCity, {
            type: 'bar',
            data: {
                labels: topReceiverCities.map(e => e[0]),
                datasets: [{
                    label: t.chartLabelRev, data: topReceiverCities.map(e => e[1].rev),
                    backgroundColor: '#ec4899', borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                layout: { padding: { right: 50 } },
                plugins: { datalabels: { ...dlConfigH, formatter: v => Math.round(v).toLocaleString() } }
            }
        });
    }

    // --- Top City Routes by Count (horizontal bar) ---
    const topRoutes = Object.entries(cityRouteStats)
        .sort((a, b) => b[1].count - a[1].count).slice(0, 10);
    if (topRoutes.length > 0) {
        const ctxRoute = document.getElementById('cityRouteChart').getContext('2d');
        state.charts.cityRoute = new Chart(ctxRoute, {
            type: 'bar',
            data: {
                labels: topRoutes.map(e => e[0]),
                datasets: [{
                    label: t.chartLabelCount, data: topRoutes.map(e => e[1].count),
                    backgroundColor: '#f97316', borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                layout: { padding: { right: 50 } },
                plugins: { datalabels: dlConfigH }
            }
        });
    }

    // --- Revenue per kg by Direction Top-10 (horizontal bar) ---
    const revPerKgEntries = Object.entries(weightByDirection)
        .filter(([dir, v]) => v.totalWeight > 0 && v.count >= 3)
        .map(([dir, v]) => ({
            dir,
            revPerKg: (revenueByDirection[dir] || 0) / v.totalWeight
        }))
        .sort((a, b) => b.revPerKg - a.revPerKg)
        .slice(0, 10);
    if (revPerKgEntries.length > 0) {
        const ctxRevPerKg = document.getElementById('revPerKgChart').getContext('2d');
        state.charts.revPerKg = new Chart(ctxRevPerKg, {
            type: 'bar',
            data: {
                labels: revPerKgEntries.map(e => e.dir),
                datasets: [{
                    label: t.chartLabelRevPerKg || '€/kg',
                    data: revPerKgEntries.map(e => Math.round(e.revPerKg * 100) / 100),
                    backgroundColor: '#059669', borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                layout: { padding: { right: 50 } },
                plugins: { datalabels: { ...dlConfigH, formatter: v => v.toFixed(2) + ' €/kg' } }
            }
        });
    }
}
