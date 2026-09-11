const CACHE = "safe112-v4-design-20260911";
const ASSETS = [
  "./index.html",
  "./css/styles.css",
  "./js/i18n.js",
  "./js/app.js",
  "./manifest.json",
  "./data/config.json",
  "./data/crimes.json",
  "./data/contacts.json",
  "./data/show.json",
  "./data/checklist.json",
  "./data/jobs.json",
  "./data/embassies.json",
  "./i18n/ko.json",
  "./i18n/en.json",
  "./i18n/zh-CN.json",
  "./i18n/th.json",
  "./i18n/ms.json",
  "./i18n/vi.json",
  "./assets/icons/icon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.startsWith("safe112-") && k !== CACHE; }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req).then(function (cached) {
      const net = fetch(req).then(function (res) {
        if (res && res.status === 200 && req.url.indexOf("http") === 0) {
          const copy = res.clone();
          caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return cached || caches.match("./index.html");
      });
      return cached || net;
    })
  );
});
