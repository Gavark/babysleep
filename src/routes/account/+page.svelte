<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import SignOut from 'phosphor-svelte/lib/SignOut';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';
  import Trash from 'phosphor-svelte/lib/Trash';
  import { formatDate, formatDateTime } from '$lib/format';
  import * as m from '$paraglide/messages';
  let { data, form } = $props();
</script>

<p class="back"><a href="/app"><ArrowLeft size={14} /> {m.account_back_to_app()}</a></p>

<h1>{m.account_title()}</h1>
<p class="page-meta">{m.account_connected_as()} <strong>{data.account.email}</strong>{#if data.account.isAdmin} <span class="badge">{m.account_badge_admin()}</span>{/if}</p>

<h2>{m.account_timezone_title()}</h2>
{#if form?.tzError}<p class="error" role="alert">{form.tzError}</p>{/if}
{#if form?.tzSuccess}<p class="ok">{form.tzSuccess}</p>{/if}
<form method="POST" action="?/updateTimezone" use:enhance class="card tz-form">
  <label class="field">
    <span class="field-label">{m.account_timezone_label()}</span>
    <select class="field-select" name="timezone">
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={data.userTimezone === tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> {m.common_btn_save()}</button>
</form>

<h2>{m.account_locale_title()}</h2>
{#if form?.localeError}<p class="error" role="alert">{form.localeError}</p>{/if}
{#if form?.localeSuccess}<p class="ok">{form.localeSuccess}</p>{/if}
<form method="POST" action="?/updateLocale" use:enhance class="card tz-form">
  <label class="field">
    <span class="field-label">{m.account_locale_label()}</span>
    <select class="field-select" name="locale" autocomplete="off">
      <option value="fr" selected={data.userLocale === 'fr'}>{m.account_locale_option_fr()}</option>
      <option value="en" selected={data.userLocale === 'en'}>{m.account_locale_option_en()}</option>
    </select>
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> {m.common_btn_save()}</button>
</form>

<h2>{m.account_notifications_title()}</h2>
<p class="page-meta">
  {m.account_notifications_intro()} <a href="/account/notifications">{m.account_notifications_link()}</a>
</p>

<h2>{m.account_password_title()}</h2>
{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}
<form method="POST" action="?/changePassword" use:enhance class="card pw-form">
  <label class="field"><span class="field-label">{m.account_password_current_label()}</span>
    <input class="field-input" type="password" name="current_password" required autocomplete="current-password" />
  </label>
  <label class="field"><span class="field-label">{m.account_password_new_label()}</span>
    <input class="field-input" type="password" name="new_password" required minlength="10" autocomplete="new-password" />
  </label>
  <label class="field"><span class="field-label">{m.account_password_confirm_label()}</span>
    <input class="field-input" type="password" name="confirm" required minlength="10" autocomplete="new-password" />
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> {m.account_password_submit()}</button>
</form>

<h2>{m.account_sessions_title()}</h2>
<ul class="sessions">
  {#each data.sessions as s}
    <li class="card session-row">
      <div>
        <strong>{s.userAgent}</strong>{#if s.isCurrent} <span class="badge badge-success">{m.account_sessions_current_device()}</span>{/if}
        <p class="page-meta" style="margin:0;">{m.account_sessions_last_used({ when: formatDateTime(s.lastUsedAt * 1000, data.locale) })} · {m.account_sessions_expires_on({ when: formatDate(s.expiresAt * 1000, data.locale) })}</p>
      </div>
      {#if !s.isCurrent}
        <form method="POST" action="/account/sessions/{s.id}" use:enhance>
          <button type="submit" class="btn btn-ghost btn-sm"><Trash size={14} /> {m.account_sessions_revoke()}</button>
        </form>
      {/if}
    </li>
  {/each}
</ul>

<form method="POST" action="/logout" style="margin-top: var(--s-4);">
  <button type="submit" class="btn btn-secondary"><SignOut size={16} /> {m.account_logout()}</button>
</form>

<style>
  .tz-form, .pw-form { display: grid; gap: var(--s-3); max-width: 480px; }
  .sessions { list-style: none; padding: 0; margin: 0 0 var(--s-3); display: grid; gap: var(--s-2); }
  .session-row { display: flex; justify-content: space-between; align-items: center; gap: var(--s-3); }
</style>
