// BAGU LEGACY HOMES — offline-first cache
var CACHE = 'bagu-legacy-homes-v10';
var ASSETS = [
  './', './index.html', './manifest.json', './favicon.png', './images/logo_small.png', './images/logo.png',
  './images/g01.webp','./images/g02.webp','./images/g03.webp','./images/g04.webp',
  './images/g05.webp','./images/g06.webp','./images/g07.webp','./images/g08.webp',
  './images/g09.webp','./images/g10.webp',
  './images/t01.webp','./images/t02.webp','./images/t03.webp','./images/t04.webp',
  './images/t05.webp','./images/t06.webp','./images/t07.webp','./images/t08.webp',
  './images/t09.webp','./images/t10.webp','./images/g11.webp','./images/t11.webp'
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
  var isPage = e.request.mode==='navigate' || e.request.url.indexOf('index.html')>-1 || /bagu-legacy-homes\/$/.test(e.request.url);
  if(isPage){
    // network-first for the page itself: visitors always get the latest version, cache is only the offline fallback
    e.respondWith(fetch(e.request).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      return res;
    }).catch(function(){ return caches.match(e.request); }));
    return;
  }
  // cache-first for images/icons: fast, and they rarely change
  e.respondWith(caches.match(e.request).then(function(hit){return hit||fetch(e.request);}));
});
