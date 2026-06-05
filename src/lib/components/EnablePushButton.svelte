<script lang="ts">
  import { onMount } from 'svelte';
  import Bell from 'phosphor-svelte/lib/Bell';

  type PushState = 'idle' | 'checking' | 'subscribing' | 'active' | 'denied' | 'unsupported';
  let pushState = $state<PushState>('checking');
  let isStandalonePwa = $state(false);
  let isIOS = $state(false);

  onMount(async () => {
    isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    isStandalonePwa =
      // legacy iOS
      (navigator as any).standalone === true ||
      // standard
      window.matchMedia('(display-mode: standalone)').matches;

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      pushState = 'unsupported';
      return;
    }
    if (Notification.permission === 'denied') {
      pushState = 'denied';
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    pushState = existing ? 'active' : 'idle';
  });

  async function enable() {
    pushState = 'subscribing';
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') { pushState = 'denied'; return; }

      const key = await fetch('/api/push/vapid-public-key').then((r) => r.text());

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key)
      });

      const subJson = sub.toJSON();
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
          userAgent: navigator.userAgent
        })
      });
      pushState = 'active';
    } catch (e) {
      console.error('[push] enable failed', e);
      pushState = 'idle';
    }
  }

  function urlBase64ToUint8Array(b64: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (b64.length % 4)) % 4);
    const padded = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(padded);
    const buffer = new ArrayBuffer(raw.length);
    const arr = new Uint8Array(buffer);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }
</script>

{#if pushState === 'checking'}
  <!-- silent — avoid flicker -->
{:else if pushState === 'unsupported'}
  <p class="hint">Notifications not supported on this browser.</p>
{:else if pushState === 'denied'}
  <p class="hint">Notifications blocked — enable them from your browser settings to receive alerts.</p>
{:else if pushState === 'active'}
  <p class="ok"><Bell size={14} weight="fill" /> Alerts active on this device.</p>
{:else if isIOS && !isStandalonePwa}
  <p class="hint">On iPhone: add BabySleep to your home screen first, then come back here to enable alerts.</p>
{:else}
  <button
    type="button"
    class="btn btn-secondary btn-sm"
    onclick={enable}
    disabled={pushState === 'subscribing'}
  >
    <Bell size={14} /> Enable wake-window alerts
  </button>
{/if}

<style>
  .hint { font-size: var(--fs-sm); color: var(--c-text-muted); margin: 0; }
  .ok { font-size: var(--fs-sm); color: var(--c-text); margin: 0; display: inline-flex; align-items: center; gap: var(--s-1); }
</style>
