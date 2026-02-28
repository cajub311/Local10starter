const CACHE_NAME = 'local10-v5-legacy';
const PRECACHE = [
  '/',
  '/index.html',
  '/qr.html',
  '/grievances.html',
  '/safety.html',
  '/meetings.html',
  '/benefits.html',
  '/404.html',
  '/contract.pdf',
  '/manifest.json',
  '/_shared.css',
  '/_shared.js'
];

// Install — cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate — delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for HTML/PDF, network-first for everything else
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin requests
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Cache-first for HTML pages and PDF
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('.pdf')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Network-first for fonts, CDN resources
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
