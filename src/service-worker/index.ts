/// <reference lib="webworker" />
/* eslint-disable */
import { immutable, assets } from '$app/manifest';
import { version } from '$app/env';

declare const self: ServiceWorkerGlobalScope;

// Precache the hashed app assets plus the static files the shell needs.
// Landing-page and README screenshots in static/screenshots/ are marketing
// material, not app shell: keep them out, or every install would download
// ~300 kB of images it never shows offline. HTML is never cached, so pages
// still need the network.
const CACHE = `babysleep-${version}`;
// $app/manifest paths are relative to the base path (e.g. `screenshots/x.png`).
// Resolve them against the service worker's own URL, which sits at the base
// path, so the filter and the fetch handler below see absolute pathnames.
const toPathname = (path: string) => new URL(path, self.location.href).pathname;
const PRECACHE = [
  ...immutable.map((f) => toPathname(f.path)),
  ...assets.map((f) => toPathname(f.path)).filter((p) => !p.startsWith('/screenshots/'))
];
const PRECACHED = new Set(PRECACHE);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Drop every other cache, including the workbox-precache-* ones left on
// devices by the previous vite-pwa service worker.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !PRECACHED.has(url.pathname)) return;
  event.respondWith(caches.match(event.request).then((hit) => hit ?? fetch(event.request)));
});

type PushPayload = {
  kind: string;
  babyId: number;
  babyName: string;
  locale: 'fr' | 'en';
  title: string;
  body: string;
  url: string;
};

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload: PushPayload;
  try {
    payload = event.data.json() as PushPayload;
  } catch {
    return;
  }
  event.waitUntil(handlePush(payload));
});

async function handlePush(p: PushPayload) {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const todayUrl = `/app/babies/${p.babyId}/today`;
  // If a focused tab on this baby's Today page is already open, postMessage
  // to it instead of showing the OS notification (no redundant nag).
  const focusedTarget = clients.find((c) => {
    try {
      const url = new URL(c.url);
      return url.pathname === todayUrl && (c as any).focused === true;
    } catch {
      return false;
    }
  });
  if (focusedTarget) {
    (focusedTarget as Client).postMessage({ type: 'wake-window-exceeded', payload: p });
    return;
  }

  await self.registration.showNotification(p.title, {
    body: p.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: `wake-window-${p.babyId}`,
    data: { url: p.url }
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string } | undefined)?.url ?? '/app';
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window' });
      const existing = clients.find((c) => c.url.includes(url));
      if (existing) {
        await (existing as WindowClient).focus();
        return;
      }
      await self.clients.openWindow(url);
    })()
  );
});
