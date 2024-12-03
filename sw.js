const CACHE_NAME = 'ruleta-cache-v1';
const FILES_TO_CACHE = [
  './',               // Raíz del sitio
  './index.html',      // Archivo HTML principal
  './manifest.json',   // Manifiesto de la PWA
  './icon.png',        // Icono de la PWA
  './style.css',       // Estilos CSS
  './script.js',       // Script principal
];

// Evento de instalación: Se ejecuta cuando el Service Worker se instala
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);  // Guardar los archivos en caché
    })
  );
});

// Evento de activación: Se ejecuta cuando el Service Worker se activa
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];  // Solo mantener el caché actual
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // Eliminar cachés antiguos
          }
        })
      );
    })
  );
});

// Evento de fetch: Intercepta las peticiones de red y sirve desde el caché si es posible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);  // Si está en caché, devuelve desde ahí; si no, realiza la petición
    })
  );
});
