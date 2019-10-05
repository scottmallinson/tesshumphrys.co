const version = 'V0.09';
const staticCacheName = `${version}staticfiles`;

// eslint-disable-next-line no-restricted-globals
addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticCacheName)
      .then((staticCache) => {
        staticCache.addAll([
          '/img/android-chrome-192x192.png',
          '/img/android-chrome-512x512.png',
          '/img/apple-touch-icon.png',
          '/img/favicon-16x16.png',
          '/img/favicon-32x32.png',
          '/img/favicon.ico',
        ]);
        return staticCache.addAll([
          '/img/tess.jpg',
          '/offline.html',
        ]);
      }),
  );
});

// eslint-disable-next-line no-restricted-globals
addEventListener('activate', (activateEvent) => {
  activateEvent.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== staticCacheName) {
            return caches.delete(cacheName);
          }
        }),
      ))
      // eslint-disable-next-line no-undef
      .then(() => clients.claim()),
  );
});

// eslint-disable-next-line no-restricted-globals
addEventListener('fetch', (fetchEvent) => {
  const { request } = fetchEvent;
  fetchEvent.respondWith(
    caches.match(request)
      .then((responseFromCache) => {
        if (responseFromCache) {
          return responseFromCache;
        }
        return fetch(request)
          .catch(() => caches.match('/offline.html'));
      }),
  );
});
