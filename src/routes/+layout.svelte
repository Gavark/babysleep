<script lang="ts">
  import '$lib/styles/tokens.css';
  import '$lib/styles/base.css';
  import '$lib/styles/components.css';
  import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
  import { page } from '$app/state';

  let { children, data } = $props();

  // The public landing page lays out its own full-width shell and renders its
  // own topbar, so it opts out of the 720px column and the anonymous switcher.
  const isLanding = $derived(page.url.pathname === '/');
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<!-- Topbar with locale switcher is rendered ONLY for anonymous visitors
     (login / signup / setup / public error pages). Once logged in, the
     app layout renders its own switcher inside the app header — so we
     skip this one to avoid showing the globe icon twice. -->
{#if !data.user && !isLanding}
  <header class="public-topbar">
    <LocaleSwitcher current={data.locale} />
  </header>
{/if}

{#if isLanding}
  {@render children()}
{:else}
  <main>
    {@render children()}
  </main>
{/if}

<style>
  .public-topbar {
    display: flex;
    justify-content: flex-end;
    padding: var(--s-2) var(--s-3);
  }
</style>
