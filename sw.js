self.addEventListener("install", (event) => {
  // Se instala sin guardar nada
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  // Siempre responde desde la red (sin cache)
  event.respondWith(fetch(event.request));
});
