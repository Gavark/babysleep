<script lang="ts">
  import { page } from '$app/state';
  import House from 'phosphor-svelte/lib/House';
  import * as m from '$paraglide/messages';
</script>

<div class="error-page">
  <h1>{m.error_title({ status: page.status })}</h1>
  <p class="page-meta">{page.error?.message ?? m.error_generic_message()}</p>
  <a class="btn btn-primary" href="/"><House size={16} /> {m.error_home_link()}</a>
</div>

<style>
  .error-page { text-align: center; padding: var(--s-6) var(--s-4); }
  .error-page h1 { font-size: var(--fs-2xl); margin-bottom: var(--s-3); }
</style>
