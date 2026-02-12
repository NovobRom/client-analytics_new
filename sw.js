// Service Worker for Client Analytics PWA
// Caches CDN dependencies and local files for offline functionality

import { APP_VERSION } from './js/config.js';

const CACHE_NAME = `client-analytics-v${APP_VERSION}`;
const CDN_CACHE = 'cdn-cache-v1';

// Files to cache
const LOCAL_FILES = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/analysis.js',
    '/js/charts.js',
    '/js/config.js',
    '/js/currency.js',
    '/js/fileProcessor.js',
    '/js/filters.js',
    '/js/i18n.js',
    '/js/modal.js',
    '/js/render.js',
    '/js/table.js',
    '/js/notifications.js',
    '/js/columnMapper.js',
    '/js/export.js',
    '/manifest.json'
];

const CDN_FILES = [
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0',
    'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js',
    'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js',
    'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/css/flag-icons.min.css'
];

// Install event - cache all files
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_FILES)),
            caches.open(CDN_CACHE).then(cache => cache.addAll(CDN_FILES))
        ]).then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== CDN_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API requests (currency rates)
    if (url.hostname === 'open.er-api.com') {
        event.respondWith(fetch(request));
        return;
    }

    // Cache-first strategy for CDN resources
    if (url.origin !== location.origin) {
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request).then(fetchResponse => {
                    return caches.open(CDN_CACHE).then(cache => {
                        cache.put(request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
        return;
    }

    // Network-first strategy for local files (to get updates)
    event.respondWith(
        fetch(request).then(response => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response.clone());
                return response;
            });
        }).catch(() => {
            return caches.match(request);
        })
    );
});
