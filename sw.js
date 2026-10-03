// BAGU LEGACY HOMES — offline-first cache
var CACHE = 'bagu-legacy-homes-v3';
var ASSETS = [
  './', './index.html', './manifest.json', './favicon.png', './images/logo_small.png', './images/logo.png',
  './images/g01.jpg','./images/g02.jpg','./images/g03.jpg','./images/g04.jpg',
  './images/g05.jpg','./images/g06.jpg','./images/g07.jpg','./images/g08.jpg',
  './images/g09.jpg','./images/g10.jpg',
  './images/t01.jpg','./images/t02.jpg','./images/t03.jpg','./images/t04.jpg',
  './images/t05.jpg','./images/t06.jpg','./images/t07.jpg','./images/t08.jpg',
  './images/t09.jpg','./images/t10.jpg','./images/g11.jpg','./images/t11.jpg'
];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}).then(function(){self.skipWaiting();}));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){self.clients.claim();}));
});
self.addEventListener('fetch', function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(hit){return hit||fetch(e.request);}));
});
