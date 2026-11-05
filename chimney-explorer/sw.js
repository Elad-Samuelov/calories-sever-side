/* Offline cache for Chimney Explorer (used only when served from a web host). */
const CACHE = 'chimney-explorer-v4';
const FILES = ['./', 'index.html', 'css/app.css', 'css/vendor/photoswipe.css', 'js/vendor/panzoom.min.js', 'js/vendor/photoswipe.umd.min.js', 'js/vendor/img-comparison-slider.js', 'js/content.js', 'js/scenes.js', 'js/seed.js', 'js/app.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // network first so updates show up, cache as the offline fallback
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))));
});
