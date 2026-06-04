<script lang="ts">
  import { enhance } from '$app/forms';
  import SignIn from 'phosphor-svelte/lib/SignIn';
  import * as m from '$paraglide/messages';
  let { form } = $props();
</script>

<div class="auth">
  <h1>{m.auth_login_title()}</h1>
  {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}

  <form method="POST" use:enhance class="card">
    <label class="field">
      <span class="field-label">{m.auth_email_label()}</span>
      <input class="field-input" type="email" name="email" autocomplete="username" required value={form?.email ?? ''} />
    </label>
    <label class="field">
      <span class="field-label">{m.auth_password_label()}</span>
      <input class="field-input" type="password" name="password" autocomplete="current-password" required />
    </label>
    <button type="submit" class="btn btn-primary btn-block">
      <SignIn size={18} />
      {m.auth_login_submit()}
    </button>
  </form>
</div>

<style>
  .auth { max-width: 380px; margin: var(--s-6) auto 0; }
  .card { display: grid; gap: var(--s-3); }
</style>
