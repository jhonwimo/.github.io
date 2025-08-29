self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  clients.claim();
});

self.addEventListener('fetch', e => {
  // Se puede agregar caching si quieres
});
