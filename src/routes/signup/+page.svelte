<script lang="ts">
  import { enhance } from '$app/forms';
  import UserPlus from 'phosphor-svelte/lib/UserPlus';
  import * as m from '$paraglide/messages';
  let { data, form } = $props();
</script>

<div class="auth">
  <h1>{m.auth_signup_title()}</h1>

  {#if data.disabled}
    <p class="error">{m.auth_signup_disabled_admin()}</p>
  {:else if !data.tokenValid}
    <p class="empty">{m.auth_signup_invite_only()}</p>
  {:else}
    {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
    <form method="POST" use:enhance class="card">
      <input type="hidden" name="token" value={data.token} />
      <label class="field">
        <span class="field-label">{m.auth_email_label()}</span>
        <input class="field-input" type="email" name="email" autocomplete="username" required value={form?.email ?? ''} />
      </label>
      <label class="field">
        <span class="field-label">{m.auth_password_label_with_min()}</span>
        <input class="field-input" type="password" name="password" autocomplete="new-password" required minlength="10" />
      </label>
      <label class="field">
        <span class="field-label">{m.auth_signup_confirm_label()}</span>
        <input class="field-input" type="password" name="confirm" autocomplete="new-password" required minlength="10" />
      </label>
      <button type="submit" class="btn btn-primary btn-block">
        <UserPlus size={18} />
        {m.auth_signup_submit()}
      </button>
    </form>
  {/if}
</div>

<style>
  .auth { max-width: 380px; margin: var(--s-6) auto 0; }
  .card { display: grid; gap: var(--s-3); }
</style>
