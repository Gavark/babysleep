<script lang="ts">
  let { children, data } = $props();
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<main>
  {@render children()}
</main>

<style>
  :global(body) {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    margin: 0;
    background: #f7f7f7;
    color: #1f2937;
  }
  main { max-width: 800px; margin: 0 auto; padding: 1rem; }
</style>
