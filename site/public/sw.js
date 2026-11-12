/* Global AI News service worker: offline reading for pages a reader has
   opened, fast repeat visits for static assets. Network-first for pages so
   news is never stale online. Never touches other origins (ads, analytics). */
const VERSION = 'gan-v1';
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const OFFLINE = '/offline/';
const MAX_PAGES = 40;
const MAX_ASSETS = 120;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(PAGES).then((c) => c.addAll([OFFLINE, '/'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trim(name, max) {
  const c = await caches.open(name);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (/^\/(build-info\.json|healthz|sitemap\.xml|news-sitemap\.xml|feed\.xml|robots\.txt|ads\.txt|sw\.js)/.test(url.pathname)) return;

  // Pages: network first, fall back to the cached copy, then the offline page.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy)).then(() => trim(PAGES, MAX_PAGES));
          }
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match(OFFLINE))),
    );
    return;
  }

  // Static assets: cache first (hashed or rarely changing files).
  if (/^\/(_astro|fonts|images)\//.test(url.pathname) || /\.(svg|png|jpg|webp|avif|woff2)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(ASSETS).then((c) => c.put(req, copy)).then(() => trim(ASSETS, MAX_ASSETS));
        }
        return res;
      })),
    );
  }
});
