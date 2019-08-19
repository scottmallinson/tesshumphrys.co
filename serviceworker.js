const version = 'V0.06';
const staticCacheName = version + 'staticfiles';

addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open(staticCacheName)
      .then(staticCache => {
        // Nice to have
        staticCache.addAll([
          '/img/android-chrome-192x192.png',
          '/img/android-chrome-512x512.png',
          '/img/apple-touch-icon.png',
          '/img/favicon-16x16.png',
          '/img/favicon-32x32.png',
          '/img/favicon.ico'
        ]); // end return addAll
        // Must have
        return staticCache.addAll([
          '/img/tess.jpg',
          '/offline.html'
        ])
      }) // end open then
  ); // end waitUntil
}); // end addEventListener

addEventListener('activate', activateEvent => {
  activateEvent.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName != staticCacheName) {
              return caches.delete(cacheName);
            } // end if
          }) // end map
        ); // end return Promise.all
      }) // end keys then
      .then(() => {
        return clients.claim();
      }) // end then
  ); // end waitUntil
}); // end addEventListener

// When the browser requests a file...
addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  fetchEvent.respondWith(
    // First, look in the cache
    caches.match(request)
      .then(responseFromCache => {
        if (responseFromCache) {
          return responseFromCache;
        } // end if
        // Otherwise fetch from the network return fetch(request);
        return fetch(request)
          .catch(error => {
            // Show a fallback page instead
            return caches.match('/offline.html');
          }); // end fetch catch and return
      }) // end match then
  ); // end respondWith
}); // end addEventListener