'use strict';

const CACHE_NAME = 'wet-track-v1';

const FILES_TO_CACHE = [
    'images/icons/favicon.ico',
    'images/logo.png',
    'images/background-theme.jpg',
    'images/footer-bg.jpg',
    'images/park-1.jpg',
    'images/park-2.jpg',
    'images/park-3.jpg',
    'images/waterworld-1.jpg',
    'images/waterworld-2.jpg',
    'images/waterworld-3.jpg',
    'images/waterworld-4.jpg',
    'css/styles.css',
    'bootstrap/css/bootstrap.min.css',
    'bootstrap/css/bootstrap.min.css.map',
    'bootstrap/js/bootstrap.min.js',
    'bootstrap/js/bootstrap.min.js.map',
    'js/jquery-3.5.1.min.js',
    'js/popper.min.js',
    'js/popper.min.js.map',
    'js/app.js',
    'dados.json',
    '/',
];

//Instala o service worker no browser
self.addEventListener('install', (evt) => {

    console.log('[ServiceWorker] Instalando...');

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            console.log('[ServiceWorker] Fazendo cache dos arquivos da aplicação');
            return cache.addAll(FILES_TO_CACHE);
        })

    );
    self.skipWaiting();
});

//Gera o CACHE dos arquivos estáticos
self.addEventListener('activate', (evt) => {

    console.log('[ServiceWorker] Ativando...');

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {

                //console.log('[ServiceWorker] Removendo cache antigo...');
                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

//Responder a versão offline do app
// self.addEventListener('fetch', (evt) => {
//     console.log('[ServiceWorker] Recebendo', evt.request.url);

//     if (evt.request.mode !== 'navigate') {
//         return;
//     }
//     evt.respondWith(
//         fetch(evt.request)
//             .catch(() => {
//                 return caches.open(CACHE_NAME)
//                     .then((cache) => {
//                         return cache.match('/offline.html');
//                     });
//             })
//     );

// });

self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              return cache.match(event.request)
            })
        })
    )
  });
