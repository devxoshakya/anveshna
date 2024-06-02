const CACHE_NAME = 'anveshna-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/anveshna.html',
  '/static/js/bundle.js',
  '/static/js/0.chunk.js',
  '/static/js/main.chunk.js',
  '/static/css/main.css',
  '/images/favicon-16x16.png',
  '/images/favicon-32x32.png',
  '/images/favicon.ico',
  '/images/apple-touch-icon.png',
  '/images/image-144x144.png',
  '/images/android-chrome-192x192.png',
  '/images/image-256x256.png',
  '/images/image-384x384.png',
  '/images/android-chrome-512x512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request).catch(() => caches.match('/anveshna.html')))
  );
});
