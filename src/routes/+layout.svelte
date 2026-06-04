<script lang="ts">
  import '$lib/styles/tokens.css';
  import '$lib/styles/base.css';
  import '$lib/styles/components.css';
  import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';

  let { children, data } = $props();
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<header class="public-topbar">
  <LocaleSwitcher current={data.locale} />
</header>

<main>
  {@render children()}
</main>

<style>
  .public-topbar {
    display: flex;
    justify-content: flex-end;
    padding: var(--s-2) var(--s-3);
  }
</style>
