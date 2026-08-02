const CACHE = 'sahayak-v2'
const ASSETS = ['/', '/manifest.json', '/favicon.svg', '/icons.svg']

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const url = e.request.url
  if (e.request.method !== 'GET' || !url.startsWith(self.location.origin)) return

  e.respondWith(
    caches.match(e.request).then(
      (cached) =>
        cached ||
        fetch(e.request)
          .then((res) => {
            const copy = res.clone()
            if (res.ok && (url.includes('/assets/') || url.includes('.svg') || url.includes('.json'))) {
              caches.open(CACHE).then((c) => c.put(e.request, copy))
            }
            return res
          })
          .catch(() => caches.match('/')),
    ),
  )
})
