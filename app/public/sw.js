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
  // A push without a readable draw (a push service's test, a malformed one) shows nothing.
  let draw;
  try {
    draw = event.data?.json();
  } catch {
    return;
  }
  if (!draw?.title) return;
  const { title, body, url, tag } = draw;
  event.waitUntil(
    self.registration.showNotification(title, { body, tag, renotify: true, icon: '/favicon.png', data: { url } }),
  );
});

// Opens the round's page in a S☉Lucky tab that is already open, or in a new one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url ?? '/', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => new URL(client.url).origin === self.location.origin);
      // `navigate` only works on a tab this worker controls; any other opens a new one.
      if (!open) return self.clients.openWindow(url);
      return open
        .navigate(url)
        .then((client) => (client ?? open).focus())
        .catch(() => self.clients.openWindow(url));
    }),
  );
});
