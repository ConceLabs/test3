const CACHE_NAME = 'biblioteca-juridica-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: index.tsx is compiled to JS. If you know the exact bundled JS file name, add it.
  // For esm.sh, it's harder to predict. This basic SW might not cache dynamically imported JS effectively without more complex setup.
  // '/index.tsx' itself won't be fetched by browser, but its processed output.
  // For simplicity, we'll cache the main HTML and manifest.
  '/manifest.json',
  '/icons/app-icon-192.png',
  '/icons/app-icon-512.png',
  '/apple-touch-icon.png',
  '/calculators/abono-arresto-nocturno.html' // Added new calculator HTML
  // Add other critical static assets here (e.g., main CSS file if not using Tailwind CDN, logo files)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache files during install: ', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request); // Fetch from network
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});