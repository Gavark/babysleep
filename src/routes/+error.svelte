<script lang="ts">
  import { page } from '$app/state';
  import House from 'phosphor-svelte/lib/House';
</script>

<div class="error-page">
  <h1>Erreur {page.status}</h1>
  <p class="page-meta">{page.error?.message ?? 'Une erreur est survenue.'}</p>
  <a class="btn btn-primary" href="/"><House size={16} /> Retour à l'accueil</a>
</div>

<style>
  .error-page { text-align: center; padding: var(--s-6) var(--s-4); }
  .error-page h1 { font-size: var(--fs-2xl); margin-bottom: var(--s-3); }
</style>
