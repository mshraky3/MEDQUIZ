/**
 * Minimal service worker for SQB.
 *
 * Its ONLY job is to make the app installable (Chrome/Android require a
 * registered SW with a fetch listener before it will fire `beforeinstallprompt`
 * and offer "Add to Home Screen"). It deliberately does NOT cache anything:
 * the `fetch` handler is a no-op that never calls `respondWith`, so every
 * request goes straight to the network. That avoids the classic PWA failure
 * mode where a caching SW keeps serving a stale build after a deploy.
 */
self.addEventListener('install', () => {
    // Activate this SW immediately instead of waiting for old tabs to close.
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// No-op: present so the app counts as installable, but never intercepts.
self.addEventListener('fetch', () => { });
