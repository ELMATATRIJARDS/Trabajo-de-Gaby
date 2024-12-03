const CACHE_NAME = "ruleta-quiz-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./script.js",
  "./manifest.json",
  "./icon-192x192.png",
  "./icon-512x512.png"
];

// Instalar el Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Archivos en caché");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar el Service Worker
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Cache antigua eliminada:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar solicitudes
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
