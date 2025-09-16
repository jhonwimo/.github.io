const CACHE_NAME = "wshome-v1";
const urlsToCache = [
  "/appCliente.html",
  "/css/inquilino.css",
  "/css/appCliente.css",
  "/css/map.css",
  "/js/appCliente.js",
  "/js/map.js",
  "./icons/logo-192.png",
  "./icons/logo-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});
