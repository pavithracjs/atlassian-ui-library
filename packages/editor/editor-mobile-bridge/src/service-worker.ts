declare function importScripts(url: string): void;
declare var workbox: any;

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js',
);

workbox.loadModule('workbox-strategies');
workbox.loadModule('workbox-expiration');

const urlMatching = (matches: string[], url: string) =>
  !!url.match(`(${matches.join('|')})`);

if (!workbox) {
  console.log(`Boo! Workbox didn't load 😬`);
} else {
  console.log(`Yay! Workbox is loaded 🎉`);

  const itemsQueue = new workbox.backgroundSync.Queue('itemsQueue');

  self.addEventListener('fetch', (event: any) => {
    if (urlMatching(['/items'], event.request.url)) {
      console.log(`Background Sync URL: ${event.request.url}`);

      event.waitUntil(
        fetch(event.request.clone()).catch(e => {
          console.warn(e);
          return itemsQueue.pushRequest({ request: event.request });
        }),
      );
    }

    if (urlMatching(['/file'], event.request.url)) {
      console.log(`Cache First URL: ${event.request.url}`);

      // Referencing workbox.strategies will now work as expected.
      const cacheFirst = new workbox.strategies.CacheFirst({
        cacheName: 'media-cache',
        plugins: [
          new workbox.expiration.Plugin({
            // Only cache requests for a week
            maxAgeSeconds: 7 * 24 * 60 * 60,
            // Only cache 50 requests.
            maxEntries: 50,
          }),
        ],
      });
      event.respondWith(cacheFirst.makeRequest({ request: event.request }));
    }
  });
}
