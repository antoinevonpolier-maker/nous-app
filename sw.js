// Service Worker — Nous
// Cache minimal pour permettre l'installation en tant que PWA.
// On NE met pas en cache les données Firebase (toujours fraîches).

const CACHE = "nous-v1";
const FICHIERS = [
  "index.html",
  "photos.html",
  "agenda.html",
  "dessin.html",
  "manifest.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(FICHIERS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cles) =>
      Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = e.request.url;
  // On laisse passer Firebase, les APIs et le stockage sans cache
  if (url.includes("firebase") || url.includes("googleapis") ||
      url.includes("gstatic") || url.includes("open-meteo")) {
    return;
  }
  // Pour nos pages : réseau d'abord, cache en secours (hors-ligne)
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
