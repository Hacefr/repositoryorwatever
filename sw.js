// Increment this version number (v1 to v2, etc.) whenever you add new games
const CACHE_NAME = 'unblocked-games-v1';

// The exact list of local files to store in the device's offline memory
const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'games/sample-game-1.html',
  'games/sample-game-2.html'
];

// Installs the Service Worker and forces assets into device cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Downloading assets to cache folder...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Activates the new worker immediately
  );
});

// Cleans up out-of-date cache storages when version numbers change
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Removing old cache files...');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Takes control of open pages immediately
  );
});

// Intercepts network calls to stream straight from local device cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return local asset copy first, otherwise request over network connection
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback safety layer if user has zero network and asset is missing
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
