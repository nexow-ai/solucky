/**
 * The service worker that makes S☉Lucky installable (app/plugins/pwa.client.ts
 * registers it). Pages go to the network first and fall back to the copy of
 * the last visit when offline; the build's /_nuxt/ and /_fonts/ files are
 * named by their content, so they come from the cache. Everything else (RPC,
 * API, the live table, the build check) goes straight to the network. It also
 * shows the draw notifications a player turned on.
 *
 * The build writes its id below (nuxt.config.ts), so a deploy installs a new
 * worker, which takes over at once and deletes the previous build's cache.
 */
const CACHE = 'solucky-__BUILD_ID__';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.registration.navigationPreload?.enable();
      for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

/** The response, kept in the cache when it is a complete one. */
function keep(event, response) {
  if (response.ok) {
    const copy = response.clone();
    event.waitUntil(caches.open(CACHE).then((cache) => cache.put(event.request, copy)));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { origin, pathname } = new URL(request.url);
  if (request.method !== 'GET' || origin !== location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return keep(event, (await event.preloadResponse) ?? (await fetch(request)));
        } catch (error) {
          const copy = await caches.match(request);
          if (copy) return copy;
          throw error;
        }
      })(),
    );
  } else if (/^\/_(nuxt|fonts)\//.test(pathname) && !pathname.startsWith('/_nuxt/builds/')) {
    event.respondWith(caches.match(request).then((copy) => copy ?? fetch(request).then((r) => keep(event, r))));
  }
});

// Draw notifications (server/api/push/draw.post.ts): the result, in the
// language the browser subscribed in, and the round's page to open.
self.addEventListener('push', (event) => {
  const { title, body, url, tag } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title, { body, tag, renotify: true, icon: '/favicon.png', data: { url } }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.url));
});
