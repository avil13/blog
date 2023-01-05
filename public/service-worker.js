// Incrementing VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const VERSION = 6;
const CACHE_NAME = "offline";
// Customize this with a different URL if needed.
const OFFLINE_URL = "/offline.html";

const ALL_PAGES_FILE = "/offline-cached-list.json";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      if (await caches.has(CACHE_NAME)) {
        await caches.delete(CACHE_NAME);
      }

      const cache = await caches.open(CACHE_NAME);
      // Setting {cache: 'reload'} in the new request will ensure that the
      // response isn't fulfilled from the HTTP cache; i.e., it will be from
      // the network.
      // await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));

      const response = await fetch(ALL_PAGES_FILE);
      const dataForCache = await response.json();

      const fileCachePromises = [
        dataForCache.pages,
        dataForCache.styles,
        // dataForCache.images,
        // dataForCache.otherFiles,
      ]
        .filter((item) => item && Array.isArray(item))
        .map((files) => cache.addAll(files));

      await Promise.all(fileCachePromises);
    })()
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Respond from the cache if we can
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Else, use the preloaded response, if it's there
      const response = await event.preloadResponse;
      if (response) {
        return response;
      }

      // Else try the network.
      return fetch(event.request).then((response) => {
        cache.put(response.clone());
        return response;
      });
    })()
  );
});
