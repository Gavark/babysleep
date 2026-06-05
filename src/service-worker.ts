/// <reference lib="webworker" />
/* eslint-disable */
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

// The build pipeline injects the manifest into self.__WB_MANIFEST.
// @ts-ignore - injected at build time
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

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
