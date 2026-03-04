const CACHE_NAME = 'iris-art-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'ICON.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap'
];

// 1. 安裝 Service Worker 並快取檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在快取靜態資源');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. 啟動時清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. 攔截請求：優先從快取讀取，若無則連網抓取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});