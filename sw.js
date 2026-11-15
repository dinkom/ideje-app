// Verzija aplikacije: povećaj kod svake veće promjene (npr. ideje-v4).
const VERZIJA = 'ideje-v4';
const OSNOVNO = ['./', 'index.html', 'cards.json', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERZIJA).then(c => c.addAll(OSNOVNO)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('ideje-') && k !== VERZIJA).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Prvo mreža (uvijek svježe kartice), a ako nema interneta, spremljena kopija.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const kopija = r.clone(); caches.open(VERZIJA).then(c => c.put(e.request, kopija)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});