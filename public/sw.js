/* Service worker Fail Forward ESP — écrit à la main, cache-first, hors-ligne complet (EF-19).
 * La liste PRECACHE et VERSION sont injectées par scripts/build-sw.mjs après `next build`.
 * Aucun skipWaiting automatique : une nouvelle version ne s'active jamais en plein parcours. */
const VERSION = "__VERSION__";
const PRECACHE = /*__PRECACHE__*/ [];
const CACHE = `ffesp-${VERSION}`;
const SCOPE = new URL(self.registration.scope).pathname;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(PRECACHE.map((p) => SCOPE + p.replace(/^\//, ""))),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("ffesp-") && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      clients.forEach((c) => c.postMessage({ type: "FFESP_PRECACHED", version: VERSION }));
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      // Navigation : toujours la page d'accueil en cache (application à une seule route).
      if (req.mode === "navigate") {
        const cached = (await cache.match(req, { ignoreSearch: true })) || (await cache.match(SCOPE));
        if (cached) return cached;
      } else {
        const cached = await cache.match(req, { ignoreSearch: true });
        if (cached) return cached;
      }
      try {
        const res = await fetch(req);
        if (res.ok && res.type === "basic") cache.put(req, res.clone());
        return res;
      } catch {
        const fallback = await cache.match(SCOPE);
        return fallback || new Response("Hors ligne", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
    })(),
  );
});
