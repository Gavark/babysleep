<script lang="ts">
  import { page } from '$app/state';
</script>
<h1>Erreur {page.status}</h1>
<p>{page.error?.message ?? 'Une erreur est survenue.'}</p>
<p><a href="/">Retour à l'accueil</a></p>
