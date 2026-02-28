const CACHE = 'local10-v1';
const ASSETS = ['/', 'index.html', 'grievances.html', 'safety.html', 'meetings.html', 'benefits.html', 'contract.pdf', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const clone = res.clone();
    if (e.request.url.startsWith(self.location.origin) && !e.request.url.includes('mozilla')) {
      caches.open(CACHE).then(c => c.put(e.request, clone));
    }
    return res;
  })));
});
