const VERSION = "2026-10-08-1";
const CACHE_NAME = `avil13-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/",
  "/manifest.json",
  "/favicon.svg",
  "/images/app-icon/android-icon-192x192.png",
  "/images/app-icon/icon-512x512.png",
  "/images/app-icon/maskable-icon-512x512.png",
];
const GENERATED_CACHE_LIST = "/offline-cached-list.json";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" })));

      try {
        const response = await fetch(new Request(GENERATED_CACHE_LIST, { cache: "reload" }));
        if (response.ok) {
          const { pages = [], styles = [], images = [], otherFiles = [] } = await response.json();
          const urls = [...pages, ...styles, ...images, ...otherFiles].filter(Boolean);
          await cache.addAll(urls);
        }
      } catch (error) {
        console.warn("Generated cache list is unavailable", error);
      }
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith("avil13-") && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );

      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(event));
    return;
  }

  event.respondWith(handleAssetRequest(request));
});

async function handleNavigationRequest(event) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const preloadResponse = await event.preloadResponse;
    const networkResponse = preloadResponse || await fetch(event.request);

    if (networkResponse.ok) {
      await cache.put(event.request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    return await cache.match(event.request)
      || await cache.match(new URL(event.request.url).pathname)
      || await cache.match(OFFLINE_URL);
  }
}

async function handleAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);

  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}
