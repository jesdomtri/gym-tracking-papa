const CACHE_NAME = "entrenamiento-padre-v3";
const FILES = ["./", "./index.html", "./style.css", "./app.js", "./plan.json", "./recommendation.json", "./manifest.json"];

self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))));
