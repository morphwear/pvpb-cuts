// Offline copy of the sealed pages: network first (so a new meet shows up), the saved copy when offline or slow.
const V = 'cuts-5a3886f4ce29', FILES = ["./", "2026-27_athlete_tables.html", "icon-180.png", "icon-192.png", "icon-512.png", "index.html", "manifest.webmanifest"];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(V).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys()
  .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(V);
    const net = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; });
    const hit = await cache.match(req, { ignoreSearch: true });
    if (!hit) return net;
    return Promise.race([net.catch(() => hit), new Promise(r => setTimeout(() => r(hit), 3000))]);
  })());
});
