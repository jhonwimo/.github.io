// service-worker.js
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activado');
});

self.addEventListener('fetch', event => {
  // Passthrough: no hace caching aún
  event.respondWith(fetch(event.request));
});
