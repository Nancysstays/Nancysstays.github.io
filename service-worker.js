const CACHE_NAME = 'nancys-stays-cache-v1'; 

const urlsToCache = [
  '/',
  './index.js',
  './style.css',
  './images/hotel1.jpg', 
  './fonts/myfont.woff2',
  '/index.html', // Added from the other example
  // '/your-script.js', // Added from the other example
  'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css' // Added from the other example
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); 
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then( 
          (response) => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache); 
              });

            return response;
          }
        );
      })
  );
});
