const CACHE_NAME = 'local10-v5';
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

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  const results = await Promise.allSettled(PRECACHE.map((p) => cache.add(p)));
  const anyOk = results.some((r) => r.status === 'fulfilled');
  if (!anyOk) throw new Error('Precache failed');
}

async function cleanupOldCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
}

function isHtmlRequest(request) {
  if (request.mode === 'navigate') return true;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return cache.match('/index.html');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => undefined);
  return cached || fetchPromise || cache.match('/index.html');
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(cleanupOldCaches().then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  if (isHtmlRequest(event.request) || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (url.pathname.endsWith('.pdf')) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});
