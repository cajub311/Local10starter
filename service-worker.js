const CACHE_NAME = 'local10-v8';
const CDN_CACHE = 'local10-cdn-v1';

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
  '/shop-floor-poster.pdf',
  '/manifest.json',
  '/_shared.css',
  '/_shared.js',
  '/icon-192.png',
  '/icon-512.png'
];

// CDN assets to cache on first use (PDF.js ~1.3MB + fonts)
const CDN_HOSTS = [
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== CDN_CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // CDN assets: cache-first, very long-lived (PDF.js, Google Fonts)
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(CDN_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // HTML: network-first so updates always show immediately
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // CSS/JS/PDF/images: cache-first (these change less often)
  if (
    url.pathname.endsWith('.pdf') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.json')
  ) {
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

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
