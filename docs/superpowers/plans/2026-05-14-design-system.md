# BabySleep Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the validated "Terracotta & Miel" nursery design system to all existing BabySleep pages — tokens (light + dark), self-hosted Nunito, Phosphor icons, manual dark mode toggle.

**Architecture:** Three CSS files (`tokens.css`, `base.css`, `components.css`) provide design tokens and utility classes via CSS variables. Dark mode uses CSS `[data-theme]` attribute + `prefers-color-scheme` media query with explicit override priority. SvelteKit's `transformPageChunk` hook injects `data-theme` SSR-side to avoid theme-flash. Phosphor icons via `phosphor-svelte` tree-shakeable imports. Pages migrate one-by-one — same form actions, just CSS + markup polish.

**Tech Stack:** SvelteKit 2 + Svelte 5 + `@fontsource-variable/nunito` (self-hosted Nunito variable font) + `phosphor-svelte` icon library + plain CSS variables (no Tailwind / CSS-in-JS).

**Spec:** `docs/superpowers/specs/2026-05-14-design-system.md`.

---

## File Structure

```
src/
├── app.d.ts                                    [MODIFY — Locals.theme]
├── hooks.server.ts                             [MODIFY — read cookie, inject SSR data-theme]
├── lib/
│   ├── components/
│   │   ├── Icon.svelte                         [NEW — Phosphor wrapper, optional]
│   │   └── ThemeToggle.svelte                  [NEW]
│   └── styles/
│       ├── tokens.css                          [NEW — palette, fonts, sizes, spacing]
│       ├── base.css                            [NEW — element resets]
│       └── components.css                      [NEW — .btn, .card, .key-box, …]
├── routes/
│   ├── +error.svelte                           [MODIFY]
│   ├── +layout.server.ts                       [MODIFY — pass theme to client]
│   ├── +layout.svelte                          [MODIFY — import CSS, manifest theme]
│   ├── account/+page.svelte                    [MODIFY]
│   ├── admin/invitations/+page.svelte          [MODIFY]
│   ├── api/theme/+server.ts                    [NEW — set theme cookie endpoint]
│   ├── app/+layout.svelte                      [MODIFY — header + nav + tabs + ThemeToggle]
│   ├── app/babies/+page.svelte                 [MODIFY]
│   ├── app/babies/[id]/+page.svelte            [MODIFY]
│   ├── app/babies/[id]/today/+page.svelte      [MODIFY]
│   ├── app/babies/[id]/history/+page.svelte    [MODIFY]
│   ├── app/babies/[id]/stats/+page.svelte      [MODIFY]
│   ├── login/+page.svelte                      [MODIFY]
│   └── signup/+page.svelte                     [MODIFY]
└── app.html                                    [MODIFY — manifest theme-color]
```

---

## Phase 0 — Foundation (tokens + fonts + icons)

### Task 1: Install deps + CSS tokens + base + components

**Files:**
- Modify: `package.json` (deps)
- Create: `src/lib/styles/tokens.css`, `src/lib/styles/base.css`, `src/lib/styles/components.css`

- [ ] **Step 1: Install Nunito (self-hosted via fontsource) + Phosphor icons**

```bash
npm install --save @fontsource-variable/nunito phosphor-svelte
```

Verify:
```bash
grep -E '"(@fontsource-variable/nunito|phosphor-svelte)"' package.json
```

Expected: both packages listed under `dependencies`.

- [ ] **Step 2: Create `src/lib/styles/tokens.css`**

```css
@import '@fontsource-variable/nunito/wght.css';

:root {
  /* Couleurs — light mode (par défaut) */
  --c-bg-app: #FBF8F3;
  --c-bg-card: #FFFFFF;
  --c-bg-soft: #F0D9C2;
  --c-bg-muted: #FAF0E6;
  --c-primary: #C97A5D;
  --c-primary-hover: #B6694F;
  --c-accent-honey: #E8B86E;
  --c-accent-sage: #7A9A87;
  --c-text: #3D2E25;
  --c-text-muted: #7A6655;
  --c-border: #E5D5C0;
  --c-danger: #B8514A;
  --c-focus-ring: rgba(201, 122, 93, 0.18);

  /* Typographie */
  --fs-xs: 0.75rem;
  --fs-sm: 0.8125rem;
  --fs-base: 0.875rem;
  --fs-md: 0.9375rem;
  --fs-lg: 1.125rem;
  --fs-xl: 1.375rem;
  --fs-2xl: 1.75rem;

  /* Espacement (4-pt grid) */
  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-5: 24px;
  --s-6: 32px;

  /* Border-radius */
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;
  --r-xl: 20px;

  /* Ombres */
  --shadow-sm: 0 1px 3px rgba(61, 46, 37, 0.08);
  --shadow-md: 0 2px 8px rgba(61, 46, 37, 0.12);
  --shadow-lg: 0 4px 16px rgba(61, 46, 37, 0.16);
}

/* Dark mode = OS prefers dark ET pas d'override "light" */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --c-bg-app: #1F1814;
    --c-bg-card: #2A2117;
    --c-bg-soft: #3D2E25;
    --c-bg-muted: #2A2117;
    --c-primary: #E89876;
    --c-primary-hover: #F4A988;
    --c-accent-honey: #F0C988;
    --c-accent-sage: #94B5A2;
    --c-text: #F5EBE0;
    --c-text-muted: #B4A593;
    --c-border: #3D2E25;
    --c-danger: #E89189;
    --c-focus-ring: rgba(232, 152, 118, 0.25);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.6);
  }
}

/* Override explicite dark (peu importe l'OS) */
:root[data-theme="dark"] {
  --c-bg-app: #1F1814;
  --c-bg-card: #2A2117;
  --c-bg-soft: #3D2E25;
  --c-bg-muted: #2A2117;
  --c-primary: #E89876;
  --c-primary-hover: #F4A988;
  --c-accent-honey: #F0C988;
  --c-accent-sage: #94B5A2;
  --c-text: #F5EBE0;
  --c-text-muted: #B4A593;
  --c-border: #3D2E25;
  --c-danger: #E89189;
  --c-focus-ring: rgba(232, 152, 118, 0.25);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.6);
}
```

- [ ] **Step 3: Create `src/lib/styles/base.css`**

```css
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Nunito Variable', 'Nunito', system-ui, -apple-system, sans-serif;
  font-size: var(--fs-base);
  line-height: 1.5;
  background: var(--c-bg-app);
  color: var(--c-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "tnum" 1, "kern" 1;
}

main {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--s-4);
}

h1, h2, h3, h4 {
  margin: 0 0 var(--s-3);
  line-height: 1.2;
  font-weight: 700;
  color: var(--c-text);
}
h1 { font-size: var(--fs-xl); }
h2 { font-size: var(--fs-lg); font-weight: 600; }
h3 { font-size: var(--fs-md); font-weight: 600; }
h4 { font-size: var(--fs-base); font-weight: 600; }

p { margin: 0 0 var(--s-3); }
p:last-child { margin-bottom: 0; }

a {
  color: var(--c-primary);
  text-decoration: none;
  transition: color 0.15s;
}
a:hover { color: var(--c-primary-hover); text-decoration: underline; }

strong { font-weight: 700; color: var(--c-text); }

table { border-collapse: collapse; width: 100%; }
th, td { padding: var(--s-2) var(--s-3); text-align: left; }
th { font-weight: 600; color: var(--c-text-muted); font-size: var(--fs-sm); border-bottom: 1px solid var(--c-border); }
td { font-size: var(--fs-base); border-bottom: 1px solid var(--c-border); }

ul { padding-left: var(--s-5); margin: 0 0 var(--s-3); }
li { margin: var(--s-1) 0; }

input, select, textarea, button {
  font-family: inherit;
  color: inherit;
}

hr {
  border: 0;
  border-top: 1px solid var(--c-border);
  margin: var(--s-4) 0;
}

::selection {
  background: var(--c-bg-soft);
  color: var(--c-text);
}
```

- [ ] **Step 4: Create `src/lib/styles/components.css`**

```css
/* === Buttons === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  padding: var(--s-3) var(--s-4);
  border-radius: var(--r-md);
  font-family: inherit;
  font-size: var(--fs-md);
  font-weight: 600;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.05s;
  text-decoration: none;
  white-space: nowrap;
}
.btn:active { transform: translateY(1px); }
.btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--c-focus-ring); }

.btn-primary { background: var(--c-primary); color: white; }
.btn-primary:hover { background: var(--c-primary-hover); color: white; text-decoration: none; }

.btn-secondary { background: transparent; color: var(--c-primary); border-color: var(--c-primary); }
.btn-secondary:hover { background: var(--c-bg-soft); text-decoration: none; }

.btn-ghost { background: transparent; color: var(--c-text-muted); }
.btn-ghost:hover { color: var(--c-primary); background: var(--c-bg-muted); text-decoration: none; }

.btn-danger { background: var(--c-danger); color: white; }
.btn-danger:hover { background: var(--c-danger); filter: brightness(0.92); color: white; text-decoration: none; }

.btn-sm { padding: var(--s-2) var(--s-3); font-size: var(--fs-sm); }
.btn-block { width: 100%; }

/* === Form fields === */
.field {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
}
.field-label {
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--c-text-muted);
  display: inline-flex;
  align-items: center;
  gap: var(--s-1);
}
.field-input, .field-select, .field-textarea {
  padding: var(--s-3);
  border-radius: var(--r-md);
  border: 1.5px solid var(--c-border);
  background: var(--c-bg-card);
  color: var(--c-text);
  font-size: var(--fs-md);
  width: 100%;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input:focus, .field-select:focus, .field-textarea:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px var(--c-focus-ring);
}
.field-textarea { resize: vertical; min-height: 60px; }

/* === Card === */
.card {
  background: var(--c-bg-card);
  border-radius: var(--r-lg);
  padding: var(--s-4);
  box-shadow: var(--shadow-sm);
}

/* === Key-box (highlighted result panels) === */
.key-box {
  background: var(--c-bg-soft);
  border: 1.5px solid var(--c-accent-honey);
  border-radius: var(--r-lg);
  padding: var(--s-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s-3);
  margin: var(--s-2) 0;
}
.key-box .key-meta { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.key-box .key-label {
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--c-text-muted);
  display: inline-flex; align-items: center; gap: var(--s-1);
}
.key-box .key-sub { font-size: var(--fs-sm); color: var(--c-text-muted); }
.key-box .key-value {
  font-size: var(--fs-xl);
  font-weight: 700;
  color: var(--c-primary);
  font-feature-settings: "tnum" 1;
}

/* === Nap block (grouped start/end) === */
.nap-block {
  border-left: 3px solid var(--c-accent-honey);
  padding-left: var(--s-3);
  margin-bottom: var(--s-4);
}
.nap-title {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  font-weight: 600;
  font-size: var(--fs-base);
  margin-bottom: var(--s-2);
  color: var(--c-text);
}

/* === Hint === */
.hint {
  background: var(--c-bg-muted);
  color: var(--c-text-muted);
  padding: var(--s-2) var(--s-3);
  border-radius: var(--r-md);
  font-size: var(--fs-sm);
  margin: var(--s-1) 0 var(--s-2);
  display: inline-flex; align-items: center; gap: var(--s-2);
}
.hint strong { color: var(--c-primary); font-weight: 700; }

/* === 2-col grid === */
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-2); }

/* === Badge === */
.badge {
  display: inline-block;
  padding: 2px var(--s-2);
  border-radius: var(--r-sm);
  font-size: var(--fs-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--c-bg-soft);
  color: var(--c-text);
}
.badge-success { background: var(--c-accent-sage); color: white; }
.badge-warning { background: var(--c-accent-honey); color: var(--c-text); }
.badge-danger { background: var(--c-danger); color: white; }

/* === Back link === */
.back { margin: 0 0 var(--s-2); font-size: var(--fs-sm); }
.back a { color: var(--c-text-muted); display: inline-flex; align-items: center; gap: var(--s-1); }
.back a:hover { color: var(--c-primary); text-decoration: underline; }

/* === Status messages === */
.error { color: var(--c-danger); padding: var(--s-2) var(--s-3); background: rgba(184, 81, 74, 0.08); border-radius: var(--r-md); }
.ok    { color: var(--c-accent-sage); padding: var(--s-2) var(--s-3); background: rgba(122, 154, 135, 0.12); border-radius: var(--r-md); }

/* === Brand + Header === */
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  font-weight: 700;
  font-size: var(--fs-lg);
  color: var(--c-text);
  text-decoration: none;
}
.brand:hover { text-decoration: none; }

/* === Nav pills (top nav, sub-nav, baby tabs) === */
.nav-row { display: flex; align-items: center; gap: var(--s-3); flex-wrap: wrap; }

.nav-pill {
  padding: var(--s-2) var(--s-3);
  border-radius: var(--r-md);
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--c-text-muted);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav-pill:hover { color: var(--c-primary); text-decoration: none; }
.nav-pill.active { background: var(--c-primary); color: white; }
.nav-pill.active:hover { color: white; }

.tab {
  padding: var(--s-2) var(--s-3);
  border-radius: var(--r-md);
  font-size: var(--fs-sm);
  font-weight: 500;
  border: 1.5px solid var(--c-border);
  color: var(--c-text-muted);
  text-decoration: none;
  transition: all 0.15s;
}
.tab:hover { color: var(--c-primary); border-color: var(--c-primary); text-decoration: none; }
.tab.active { background: var(--c-primary); color: white; border-color: var(--c-primary); }
.tab.active:hover { color: white; }

.sub-nav {
  display: flex;
  gap: var(--s-4);
  border-bottom: 1px solid var(--c-border);
  margin-bottom: var(--s-4);
  font-size: var(--fs-base);
}
.sub-tab {
  padding: var(--s-2) 0;
  color: var(--c-text-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.sub-tab:hover { color: var(--c-primary); text-decoration: none; }
.sub-tab.active { color: var(--c-primary); font-weight: 600; border-bottom-color: var(--c-primary); }

/* === Summary strip (used on history + stats pages) === */
.summary-strip {
  display: flex;
  gap: var(--s-3);
  flex-wrap: wrap;
  background: var(--c-bg-soft);
  border-radius: var(--r-md);
  padding: var(--s-3);
  margin-bottom: var(--s-4);
  font-size: var(--fs-sm);
}
.summary-strip > div { display: inline-flex; align-items: center; gap: var(--s-1); color: var(--c-text); }
.summary-strip strong { color: var(--c-primary); }

/* === Page utilities === */
.page-meta { color: var(--c-text-muted); font-size: var(--fs-sm); margin-bottom: var(--s-4); }
.tz-info { color: var(--c-text-muted); font-size: var(--fs-xs); }
.empty { color: var(--c-text-muted); font-style: italic; }
```

- [ ] **Step 5: Verify the build doesn't crash with the imports**

```bash
npm run check
```

Expected: 0 errors. CSS files aren't TS-checked but the imports in the next task will work.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/styles/
git commit -m "feat(design): tokens, base, components CSS + self-hosted Nunito + Phosphor deps"
```

---

### Task 2: Update root layout — import CSS, manifest theme

**Files:**
- Modify: `src/routes/+layout.svelte`
- Modify: `src/app.html`
- Modify: `vite.config.ts` (PWA manifest theme + background colors)

- [ ] **Step 1: Read current `src/routes/+layout.svelte`**

You'll see something like:
```svelte
<script lang="ts">
  let { children, data } = $props();
</script>
<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>
<main>{@render children()}</main>
<style>...</style>
```

Replace with:

```svelte
<script lang="ts">
  import '$lib/styles/tokens.css';
  import '$lib/styles/base.css';
  import '$lib/styles/components.css';

  let { children, data } = $props();
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<main>{@render children()}</main>
```

The `<style>` block in this layout disappears — the global styles now come from the imported CSS files.

- [ ] **Step 2: Update `src/app.html`** — change `theme-color` meta to terracotta

Find the line `<meta name="theme-color" content="#1F4E78" />` and replace `#1F4E78` with `#C97A5D`:

```html
<meta name="theme-color" content="#C97A5D" />
```

- [ ] **Step 3: Update PWA manifest in `vite.config.ts`**

Read current `vite.config.ts`. Find the `SvelteKitPWA(...)` block. Change:
- `background_color: '#1F4E78'` → `background_color: '#FBF8F3'`
- `theme_color: '#1F4E78'` → `theme_color: '#C97A5D'`

- [ ] **Step 4: Build and smoke-check**

```bash
npm run check
npm run build
```

Expected: 0 errors. Build emits a new manifest.webmanifest with new colors.

- [ ] **Step 5: Verify in dev**

```bash
docker compose down
docker compose up -d --build
sleep 12
```

Open the app in a browser, navigate to `/login`. You should see Nunito font + the new background color (cream). Layout might look weird because individual pages haven't been migrated yet — that's OK, we fix in subsequent tasks.

- [ ] **Step 6: Commit**

```bash
git add src/routes/+layout.svelte src/app.html vite.config.ts
git commit -m "feat(design): root layout imports design tokens + PWA theme update"
```

---

## Phase 1 — Dark mode infrastructure

### Task 3: hooks.server.ts — read theme cookie + SSR injection

**Files:**
- Modify: `src/app.d.ts`
- Modify: `src/hooks.server.ts`
- Modify: `src/routes/+layout.server.ts`

- [ ] **Step 1: Update `src/app.d.ts`**

Read the file. Inside `App.Locals`, add `theme`:

```ts
import type { Session, User } from '$lib/server/db/schema';

declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: Session | null;
      theme: 'auto' | 'light' | 'dark';
    }
    interface PageData {
      user: User | null;
    }
    interface Error {}
    interface Platform {}
  }
}

export {};
```

- [ ] **Step 2: Update `src/hooks.server.ts`**

Read the file. Inside the `handle` function, after the bootstrap call and BEFORE reading the session cookie, add:

```ts
const rawTheme = event.cookies.get('theme');
event.locals.theme = rawTheme === 'light' || rawTheme === 'dark' ? rawTheme : 'auto';
```

Then at the very end of the function, instead of `return resolve(event);`, return:

```ts
const dataTheme = event.locals.theme === 'auto' ? '' : event.locals.theme;
return resolve(event, {
  transformPageChunk: ({ html }) => {
    if (!dataTheme) return html;
    return html.replace('<html', `<html data-theme="${dataTheme}"`);
  }
});
```

The full handler should look like (key parts):

```ts
export const handle: Handle = async ({ event, resolve }) => {
  await maybeBootstrap();

  const rawTheme = event.cookies.get('theme');
  event.locals.theme = rawTheme === 'light' || rawTheme === 'dark' ? rawTheme : 'auto';

  // ... existing rate-limit block ...

  const sessionId = event.cookies.get('session');
  event.locals.user = null;
  event.locals.session = null;
  if (sessionId) {
    // ... existing session loading ...
  }

  const dataTheme = event.locals.theme === 'auto' ? '' : event.locals.theme;
  return resolve(event, {
    transformPageChunk: ({ html }) => {
      if (!dataTheme) return html;
      return html.replace('<html', `<html data-theme="${dataTheme}"`);
    }
  });
};
```

- [ ] **Step 3: Update `src/routes/+layout.server.ts`** to pass `theme` to client

Read the file. Add `theme: locals.theme` to the returned object:

```ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  return { user: locals.user, theme: locals.theme };
};
```

- [ ] **Step 4: Verify**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 5: Test cookie injection manually**

```bash
docker compose down
docker compose up -d --build
sleep 12
# Set a cookie via curl and verify the response includes data-theme
curl -sSk --resolve babysleep.gavark.fr:443:127.0.0.1 -H "Cookie: theme=dark" https://babysleep.gavark.fr/login | grep -oE 'data-theme="[a-z]+"'
```

Expected: `data-theme="dark"` printed.

```bash
curl -sSk --resolve babysleep.gavark.fr:443:127.0.0.1 -H "Cookie: theme=light" https://babysleep.gavark.fr/login | grep -oE 'data-theme="[a-z]+"'
```

Expected: `data-theme="light"`.

```bash
curl -sSk --resolve babysleep.gavark.fr:443:127.0.0.1 https://babysleep.gavark.fr/login | grep -c 'data-theme'
```

Expected: `0` (no `data-theme` when no cookie = "auto" mode).

- [ ] **Step 6: Commit**

```bash
git add src/app.d.ts src/hooks.server.ts src/routes/+layout.server.ts
git commit -m "feat(theme): SSR theme cookie injection on <html>"
```

---

### Task 4: `/api/theme` endpoint

**Files:**
- Create: `src/routes/api/theme/+server.ts`

- [ ] **Step 1: Write the endpoint**

```ts
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const form = await request.formData();
  const value = String(form.get('value') ?? 'auto');
  if (value !== 'auto' && value !== 'light' && value !== 'dark') {
    return new Response('invalid', { status: 400 });
  }
  if (value === 'auto') {
    cookies.delete('theme', { path: '/' });
  } else {
    cookies.set('theme', value, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365
    });
  }
  return new Response(null, { status: 204 });
};
```

- [ ] **Step 2: Run check**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Manual test**

```bash
docker compose restart app
sleep 8
# Set theme=dark via API
curl -sSk -X POST --resolve babysleep.gavark.fr:443:127.0.0.1 -F "value=dark" -i https://babysleep.gavark.fr/api/theme | head -5
```

Expected: `HTTP/2 204` + a `Set-Cookie: theme=dark; ...` header.

```bash
curl -sSk -X POST --resolve babysleep.gavark.fr:443:127.0.0.1 -F "value=auto" -i https://babysleep.gavark.fr/api/theme | head -5
```

Expected: 204 + `Set-Cookie: theme=; ... Max-Age=0` (deletion).

```bash
curl -sSk -X POST --resolve babysleep.gavark.fr:443:127.0.0.1 -F "value=garbage" -i https://babysleep.gavark.fr/api/theme | head -3
```

Expected: `HTTP/2 400`.

- [ ] **Step 4: Commit**

```bash
git add src/routes/api/theme/+server.ts
git commit -m "feat(theme): /api/theme endpoint to set/clear theme cookie"
```

---

### Task 5: `ThemeToggle.svelte` component

**Files:**
- Create: `src/lib/components/ThemeToggle.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import CircleHalf from 'phosphor-svelte/lib/CircleHalf';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Moon from 'phosphor-svelte/lib/Moon';

  type ThemeValue = 'auto' | 'light' | 'dark';

  let { initial }: { initial: ThemeValue } = $props();
  let theme = $state<ThemeValue>(initial);

  const order: ThemeValue[] = ['auto', 'light', 'dark'];

  async function cycle() {
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    theme = next;

    if (next === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }

    const fd = new FormData();
    fd.set('value', next);
    try {
      await fetch('/api/theme', { method: 'POST', body: fd });
    } catch {
      /* network glitch — UI state remains in sync, cookie may be stale until next request */
    }
  }

  function label(t: ThemeValue): string {
    if (t === 'auto') return 'Thème : automatique (clic pour clair)';
    if (t === 'light') return 'Thème : clair (clic pour sombre)';
    return 'Thème : sombre (clic pour automatique)';
  }
</script>

<button
  type="button"
  class="theme-toggle"
  onclick={cycle}
  title={label(theme)}
  aria-label={label(theme)}
>
  {#if theme === 'auto'}
    <CircleHalf size={20} weight="regular" />
  {:else if theme === 'light'}
    <Sun size={20} weight="regular" />
  {:else}
    <Moon size={20} weight="regular" />
  {/if}
</button>

<style>
  .theme-toggle {
    background: transparent;
    border: 1.5px solid var(--c-border);
    color: var(--c-text-muted);
    border-radius: var(--r-md);
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
    padding: 0;
  }
  .theme-toggle:hover {
    color: var(--c-primary);
    border-color: var(--c-primary);
  }
  .theme-toggle:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--c-focus-ring);
  }
</style>
```

- [ ] **Step 2: Verify check**

```bash
npm run check
```

Expected: 0 errors. The phosphor-svelte import path `phosphor-svelte/lib/CircleHalf` is the official tree-shakeable import format.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/ThemeToggle.svelte
git commit -m "feat(theme): ThemeToggle button component (3-state cycle)"
```

---

## Phase 2 — Page migrations

### Task 6: `/login` and `/signup` pages

**Files:**
- Modify: `src/routes/login/+page.svelte`
- Modify: `src/routes/signup/+page.svelte`

- [ ] **Step 1: Write the new `src/routes/login/+page.svelte`**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import SignIn from 'phosphor-svelte/lib/SignIn';
  let { form } = $props();
</script>

<div class="auth">
  <h1>Connexion</h1>
  {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}

  <form method="POST" use:enhance class="card">
    <label class="field">
      <span class="field-label">Email</span>
      <input class="field-input" type="email" name="email" autocomplete="username" required value={form?.email ?? ''} />
    </label>
    <label class="field">
      <span class="field-label">Mot de passe</span>
      <input class="field-input" type="password" name="password" autocomplete="current-password" required />
    </label>
    <button type="submit" class="btn btn-primary btn-block">
      <SignIn size={18} />
      Se connecter
    </button>
  </form>
</div>

<style>
  .auth { max-width: 380px; margin: var(--s-6) auto 0; }
  .card { display: grid; gap: var(--s-3); }
</style>
```

- [ ] **Step 2: Write the new `src/routes/signup/+page.svelte`**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import UserPlus from 'phosphor-svelte/lib/UserPlus';
  let { data, form } = $props();
</script>

<div class="auth">
  <h1>Inscription</h1>

  {#if data.disabled}
    <p class="error">Inscription désactivée par l'administrateur.</p>
  {:else if !data.tokenValid}
    <p class="empty">Inscription sur invitation uniquement. Demande un lien à l'administrateur.</p>
  {:else}
    {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
    <form method="POST" use:enhance class="card">
      <input type="hidden" name="token" value={data.token} />
      <label class="field">
        <span class="field-label">Email</span>
        <input class="field-input" type="email" name="email" autocomplete="username" required value={form?.email ?? ''} />
      </label>
      <label class="field">
        <span class="field-label">Mot de passe (≥ 10 caractères)</span>
        <input class="field-input" type="password" name="password" autocomplete="new-password" required minlength="10" />
      </label>
      <label class="field">
        <span class="field-label">Confirmer</span>
        <input class="field-input" type="password" name="confirm" autocomplete="new-password" required minlength="10" />
      </label>
      <button type="submit" class="btn btn-primary btn-block">
        <UserPlus size={18} />
        Créer mon compte
      </button>
    </form>
  {/if}
</div>

<style>
  .auth { max-width: 380px; margin: var(--s-6) auto 0; }
  .card { display: grid; gap: var(--s-3); }
</style>
```

- [ ] **Step 3: Verify + commit**

```bash
npm run check
git add src/routes/login src/routes/signup
git commit -m "feat(design): migrate /login and /signup to design system"
```

---

### Task 7: `/app/+layout.svelte` — header + tabs + sub-nav + ThemeToggle

**Files:**
- Modify: `src/routes/app/+layout.svelte`

- [ ] **Step 1: Write the new layout**

```svelte
<script lang="ts">
  import { page } from '$app/state';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import Bed from 'phosphor-svelte/lib/Bed';
  import UserCircle from 'phosphor-svelte/lib/UserCircle';
  import Envelope from 'phosphor-svelte/lib/Envelope';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';

  let { children, data } = $props();

  function subActive(suffix: string): string {
    const p = page.url.pathname;
    if (suffix === 'edit') return /\/babies\/\d+$/.test(p) ? 'sub-tab active' : 'sub-tab';
    return p.endsWith('/' + suffix) ? 'sub-tab active' : 'sub-tab';
  }

  function tabClass(id: number): string {
    return id === data.currentBabyId ? 'tab active' : 'tab';
  }
</script>

<header class="app-header">
  <a class="brand" href="/app">
    <Bed size={22} weight="duotone" />
    BabySleep
  </a>
  <div class="header-right">
    <nav class="nav-row">
      <a class="nav-pill" href="/app/babies">Bébés</a>
      {#if data.isAdmin}
        <a class="nav-pill" href="/admin/invitations">
          <Envelope size={14} /> Invitations
        </a>
      {/if}
      <a class="nav-pill" href="/account">
        <UserCircle size={14} /> Compte
      </a>
    </nav>
    <ThemeToggle initial={data.theme ?? 'auto'} />
  </div>
</header>

<div class="baby-tabs">
  {#each data.babies as b}
    <a class={tabClass(b.id)} href="/app/babies/{b.id}/today">{b.name}</a>
  {/each}
</div>

{#if data.currentBabyId}
  <p class="back"><a href="/app/babies"><ArrowLeft size={14} /> Tous les bébés</a></p>
  <nav class="sub-nav">
    <a class={subActive('today')}   href="/app/babies/{data.currentBabyId}/today">Aujourd'hui</a>
    <a class={subActive('history')} href="/app/babies/{data.currentBabyId}/history">Historique</a>
    <a class={subActive('stats')}   href="/app/babies/{data.currentBabyId}/stats">Stats</a>
    <a class={subActive('edit')}    href="/app/babies/{data.currentBabyId}">Éditer</a>
  </nav>
{/if}

{@render children()}

<style>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--s-3);
    gap: var(--s-3);
    flex-wrap: wrap;
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    flex-wrap: wrap;
  }
  .baby-tabs {
    display: flex;
    gap: var(--s-2);
    flex-wrap: wrap;
    margin-bottom: var(--s-3);
  }
</style>
```

- [ ] **Step 2: Update `src/routes/app/+layout.server.ts` to pass `theme` from root**

Read the file. The `load` currently returns `{ babies, currentBabyId, isAdmin }`. Add `theme` from parent data:

```ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listBabies } from '$lib/server/babies';

export const load: LayoutServerLoad = async ({ locals, cookies, params, parent }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  const babies = listBabies(db, locals.user.id);
  const currentId = Number(params.id);
  if (currentId && babies.some((b) => b.id === currentId)) {
    cookies.set('last_baby_id', String(currentId), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    });
  }
  const parentData = await parent();
  return {
    babies,
    currentBabyId: currentId || null,
    isAdmin: !!locals.user.isAdmin,
    theme: parentData.theme
  };
};
```

- [ ] **Step 3: Verify + smoke test**

```bash
npm run check
docker compose restart app
sleep 8
curl -sSk --resolve babysleep.gavark.fr:443:127.0.0.1 https://babysleep.gavark.fr/healthz
```

Expected: `ok`. Open app in browser, login, see new header with Phosphor brand icon + theme toggle button on the right.

- [ ] **Step 4: Click the theme toggle, verify it cycles**

In browser: click toggle button 3 times → `auto → light → dark → auto`. The page bg/text should switch instantly. Reload — the chosen mode persists.

- [ ] **Step 5: Commit**

```bash
git add src/routes/app/+layout.svelte src/routes/app/+layout.server.ts
git commit -m "feat(design): /app layout with new header, tabs, sub-nav, ThemeToggle"
```

---

### Task 8: `/app/babies/[id]/today` page

**Files:**
- Modify: `src/routes/app/babies/[id]/today/+page.svelte`

- [ ] **Step 1: Rewrite the today page**

Read the current file. Replace its content with:

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { idealBedtime, suggestNextNap, suggestedBedtime } from '$lib/sleep-calc';
  import { isValidHHMM } from '$lib/time';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import Clock from 'phosphor-svelte/lib/Clock';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Star from 'phosphor-svelte/lib/Star';
  import Globe from 'phosphor-svelte/lib/Globe';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';

  let { data, form } = $props();

  let wake       = $state('');
  let nap1Start  = $state('');
  let nap1End    = $state('');
  let nap2Start  = $state('');
  let nap2End    = $state('');
  let nap3Start  = $state('');
  let nap3End    = $state('');
  let nap4Start  = $state('');
  let nap4End    = $state('');
  let bedtime    = $state('');
  let notes      = $state('');
  let entryTz    = $state('');

  let syncedFor = $state<string | number>('__init__');

  $effect(() => {
    const id = data.entry?.id ?? 'none';
    if (id !== syncedFor) {
      syncedFor = id;
      wake      = data.entry?.wakeTime  ?? '';
      nap1Start = data.entry?.nap1Start ?? '';
      nap1End   = data.entry?.nap1End   ?? '';
      nap2Start = data.entry?.nap2Start ?? '';
      nap2End   = data.entry?.nap2End   ?? '';
      nap3Start = data.entry?.nap3Start ?? '';
      nap3End   = data.entry?.nap3End   ?? '';
      nap4Start = data.entry?.nap4Start ?? '';
      nap4End   = data.entry?.nap4End   ?? '';
      bedtime   = data.entry?.bedtime   ?? '';
      notes     = data.entry?.notes     ?? '';
      entryTz   = data.entry?.timezone  ?? '';
    }
  });

  function safeNextNap(t: string) {
    return isValidHHMM(t) ? suggestNextNap(t, data.ageParams.awakeWindowMin) : '';
  }
  function safeIdeal(t: string) {
    return isValidHHMM(t) ? idealBedtime(t, data.ageParams.nightSleepH) : '';
  }

  const ideal = $derived(safeIdeal(data.baby.desiredWakeTime ?? '') || safeIdeal(wake));
  const sugg1 = $derived(safeNextNap(wake));
  const sugg2 = $derived(safeNextNap(nap1End));
  const sugg3 = $derived(safeNextNap(nap2End));
  const sugg4 = $derived(safeNextNap(nap3End));
  const suggBed = $derived(
    isValidHHMM(wake)
      ? (suggestedBedtime(
          { wake, napEnds: [nap1End, nap2End, nap3End, nap4End].filter(isValidHHMM) },
          data.ageParams
        ) ?? '')
      : ''
  );

  function read(e: Event) {
    return (e.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
  }
</script>

<h1>{data.baby.name} — {data.today}</h1>
<p class="page-meta">
  <strong>{data.ageMonths} mois</strong> ({data.ageParams.label}) ·
  {data.ageParams.naps} sieste(s) · fenêtre {data.ageParams.awakeWindowMin} min · nuit {data.ageParams.nightSleepH}h
</p>
<p class="tz-info"><Globe size={12} /> Fuseau actif : <strong>{data.effectiveTz}</strong></p>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form
  method="POST"
  action="?/save"
  use:enhance={() => async ({ update }) => update({ reset: false })}
  autocomplete="off"
  class="today-form"
>
  <input type="hidden" name="date" value={data.today} />

  <label class="field">
    <span class="field-label"><Globe size={12} /> Fuseau (cette journée)</span>
    <select
      class="field-select"
      name="timezone"
      autocomplete="off"
      value={entryTz}
      oninput={(e) => entryTz = read(e)}
      onchange={(e) => entryTz = read(e)}
    >
      <option value="">Hériter ({data.effectiveTz})</option>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={entryTz === tz}>{tz}</option>
      {/each}
    </select>
  </label>

  <div class="card">
    <label class="field">
      <span class="field-label"><Sun size={12} /> Réveil</span>
      <input class="field-input" type="time" name="wake_time" autocomplete="off"
        value={wake}
        oninput={(e) => wake = read(e)} onchange={(e) => wake = read(e)} onblur={(e) => wake = read(e)} />
    </label>
  </div>

  {#each [
    { idx: 1, suggValue: sugg1, startVal: nap1Start, endVal: nap1End, setStart: (v: string) => nap1Start = v, setEnd: (v: string) => nap1End = v },
    { idx: 2, suggValue: sugg2, startVal: nap2Start, endVal: nap2End, setStart: (v: string) => nap2Start = v, setEnd: (v: string) => nap2End = v },
    { idx: 3, suggValue: sugg3, startVal: nap3Start, endVal: nap3End, setStart: (v: string) => nap3Start = v, setEnd: (v: string) => nap3End = v },
    { idx: 4, suggValue: sugg4, startVal: nap4Start, endVal: nap4End, setStart: (v: string) => nap4Start = v, setEnd: (v: string) => nap4End = v }
  ] as nap (nap.idx)}
    <div class="nap-block">
      <div class="nap-title"><Sun size={16} weight="regular" /> Sieste {nap.idx}</div>
      <div class="hint">Suggérée vers <strong>{nap.suggValue || '—'}</strong></div>
      <div class="pair">
        <label class="field">
          <span class="field-label">Début</span>
          <input class="field-input" type="time" name="nap{nap.idx}_start" autocomplete="off"
            value={nap.startVal}
            oninput={(e) => nap.setStart(read(e))} onchange={(e) => nap.setStart(read(e))} onblur={(e) => nap.setStart(read(e))} />
        </label>
        <label class="field">
          <span class="field-label">Fin</span>
          <input class="field-input" type="time" name="nap{nap.idx}_end" autocomplete="off"
            value={nap.endVal}
            oninput={(e) => nap.setEnd(read(e))} onchange={(e) => nap.setEnd(read(e))} onblur={(e) => nap.setEnd(read(e))} />
        </label>
      </div>
    </div>
  {/each}

  <div class="key-box">
    <div class="key-meta">
      <span class="key-label"><Star size={12} weight="fill" /> Coucher idéal</span>
      <span class="key-sub">Pour réveil souhaité {data.baby.desiredWakeTime ?? '—'}</span>
    </div>
    <span class="key-value">{ideal || '—'}</span>
  </div>

  <div class="key-box">
    <div class="key-meta">
      <span class="key-label"><Star size={12} weight="fill" /> Coucher suggéré</span>
      <span class="key-sub">Basé sur les siestes saisies</span>
    </div>
    <span class="key-value">{suggBed || '—'}</span>
  </div>

  <div class="card">
    <label class="field">
      <span class="field-label"><Moon size={12} /> Coucher effectif</span>
      <input class="field-input" type="time" name="bedtime" autocomplete="off"
        value={bedtime}
        oninput={(e) => bedtime = read(e)} onchange={(e) => bedtime = read(e)} onblur={(e) => bedtime = read(e)} />
    </label>
  </div>

  <label class="field">
    <span class="field-label">Notes</span>
    <textarea class="field-textarea" name="notes" autocomplete="off" rows="2"
      value={notes}
      oninput={(e) => notes = read(e)}></textarea>
  </label>

  <button type="submit" class="btn btn-primary btn-block">
    <FloppyDisk size={18} weight="regular" />
    Enregistrer la journée
  </button>
</form>

<h2>7 derniers jours</h2>
<ul class="recent">
  {#each data.recent as r}
    <li><strong>{r.date}</strong> — réveil {r.wakeTime ?? '?'} / coucher {r.bedtime ?? '?'}</li>
  {/each}
</ul>

<style>
  .today-form { display: grid; gap: var(--s-3); }
  .recent { padding-left: var(--s-4); }
  .recent li { color: var(--c-text-muted); }
  .recent strong { color: var(--c-text); }
</style>
```

- [ ] **Step 2: Verify + smoke**

```bash
npm run check
docker compose restart app
sleep 8
```

Open Today page in browser, fill some values, save. Verify:
- New design system styling visible
- Suggestions compute as typed
- Save → toast appears + values stay populated
- Switch theme toggle: page recolors instantly

- [ ] **Step 3: Commit**

```bash
git add src/routes/app/babies/[id]/today/+page.svelte
git commit -m "feat(design): migrate Today page to design system"
```

---

### Task 9: `/app/babies/[id]/history` page

**Files:**
- Modify: `src/routes/app/babies/[id]/history/+page.svelte`

- [ ] **Step 1: Rewrite**

```svelte
<script lang="ts">
  import { parseHHMM, formatHHMM } from '$lib/time';
  import Download from 'phosphor-svelte/lib/Download';
  import Calendar from 'phosphor-svelte/lib/Calendar';
  let { data } = $props();

  function napCount(r: any) {
    return [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length;
  }

  function prevNight(curr: any, prev: any | undefined): string {
    if (!prev || !curr.wakeTime || !prev.bedtime) return '';
    const dayDiff = (new Date(curr.date).getTime() - new Date(prev.date).getTime()) / 86400000;
    if (Math.round(dayDiff) !== 1) return '';
    const dur = ((parseHHMM(curr.wakeTime) - parseHHMM(prev.bedtime)) % 1440 + 1440) % 1440;
    return formatHHMM(dur);
  }
</script>

<h1>Historique — {data.baby.name}</h1>

<form method="GET" class="filter-row">
  <label class="field">
    <span class="field-label"><Calendar size={12} /> De</span>
    <input class="field-input" type="date" name="from" value={data.from} />
  </label>
  <label class="field">
    <span class="field-label"><Calendar size={12} /> À</span>
    <input class="field-input" type="date" name="to" value={data.to} />
  </label>
  <button type="submit" class="btn btn-secondary">Filtrer</button>
  <a class="btn btn-primary" href="/api/babies/{data.baby.id}/export.csv?from={data.from}&to={data.to}">
    <Download size={16} /> CSV
  </a>
</form>

<section class="summary-strip">
  <div>📅 <strong>{data.summary.entryCount}</strong> jour(s)</div>
  <div>🌅 Réveil moyen <strong>{data.summary.meanWakeHHMM || '—'}</strong></div>
  <div>🌙 Coucher moyen <strong>{data.summary.meanBedtimeHHMM || '—'}</strong></div>
  <div>🛏️ Nuit moyenne <strong>{data.summary.meanPrevNightHHMM || '—'}</strong></div>
  <div>☀️ Jour moyen <strong>{data.summary.meanDaySleepHHMM || '—'}</strong></div>
  <div>💤 Siestes/jour <strong>{data.summary.meanNaps}</strong></div>
</section>

{#if data.entries.length === 0}
  <p class="empty">Aucune entrée sur cette période.</p>
{:else}
  <div class="card" style="padding: 0; overflow-x: auto;">
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Réveil</th>
          <th>S1</th><th>S2</th><th>S3</th><th>S4</th>
          <th>Coucher</th><th>Nuit préc.</th><th>Nb</th><th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {#each data.entries as r, i}
          <tr>
            <td><strong>{r.date}</strong></td>
            <td>{r.wakeTime ?? ''}</td>
            <td>{r.nap1End ?? ''}</td>
            <td>{r.nap2End ?? ''}</td>
            <td>{r.nap3End ?? ''}</td>
            <td>{r.nap4End ?? ''}</td>
            <td>{r.bedtime ?? ''}</td>
            <td>{prevNight(r, data.entries[i + 1])}</td>
            <td>{napCount(r)}</td>
            <td>{r.notes ?? ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if data.totalPages > 1}
    <nav class="pager">
      {#if data.page > 1}
        <a class="btn btn-ghost btn-sm" href="?from={data.from}&to={data.to}&page={data.page - 1}">‹ Précédent</a>
      {/if}
      <span class="tz-info">Page {data.page} / {data.totalPages}</span>
      {#if data.page < data.totalPages}
        <a class="btn btn-ghost btn-sm" href="?from={data.from}&to={data.to}&page={data.page + 1}">Suivant ›</a>
      {/if}
    </nav>
  {/if}
{/if}

<style>
  .filter-row {
    display: flex;
    gap: var(--s-3);
    align-items: end;
    flex-wrap: wrap;
    margin-bottom: var(--s-4);
  }
  .filter-row .field { min-width: 140px; }
  .pager {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-4);
    margin-top: var(--s-4);
  }
</style>
```

- [ ] **Step 2: Verify + commit**

```bash
npm run check
git add src/routes/app/babies/[id]/history/+page.svelte
git commit -m "feat(design): migrate History page to design system"
```

---

### Task 10: `/app/babies/[id]/stats` page

**Files:**
- Modify: `src/routes/app/babies/[id]/stats/+page.svelte`

- [ ] **Step 1: Update only the period selector + summary strip styling**

Read the current file. The Chart.js charts themselves stay unchanged (they render in their own canvas). We update the surrounding markup.

Find the script section — keep the imports + computed data sections as-is. Find the form/period selector + the section headers and replace as follows.

The new template (everything after `</script>`):

```svelte
<h1>Statistiques — {data.baby.name}</h1>

<form method="GET" class="period-selector">
  <div class="presets">
    <a class="tab" class:active={data.preset === '7'} href="?preset=7">7 jours</a>
    <a class="tab" class:active={data.preset === '14'} href="?preset=14">14 jours</a>
    <a class="tab" class:active={data.preset === '30'} href="?preset=30">30 jours</a>
    <a class="tab" class:active={data.preset === '90'} href="?preset=90">90 jours</a>
    <a class="tab" class:active={data.preset === 'all'} href="?preset=all">Tout</a>
  </div>
  <div class="custom">
    <label class="field"><span class="field-label">De</span>
      <input class="field-input" type="date" name="from" value={data.from} />
    </label>
    <label class="field"><span class="field-label">À</span>
      <input class="field-input" type="date" name="to" value={data.to} />
    </label>
    <input type="hidden" name="preset" value="custom" />
    <button type="submit" class="btn btn-secondary">Filtrer</button>
  </div>
</form>

<p class="tz-info">Fuseau : <strong>{data.effectiveTz}</strong> · Période : {data.from} → {data.to} · {data.entries.length} jour(s)</p>

{#if data.entries.length === 0}
  <p class="empty">Pas de données sur cette période.</p>
{:else}
  <section class="chart-card">
    <h2>🌅 Heure de réveil</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [{ label: 'Réveil', data: wakeData, borderColor: 'rgba(201,122,93,1)', backgroundColor: 'rgba(201,122,93,0.18)', tension: 0.2, spanGaps: true }] }}
      options={timeOfDayOpts} />
  </section>

  <section class="chart-card">
    <h2>🌙 Heure de coucher</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [{ label: 'Coucher', data: bedtimeData, borderColor: 'rgba(184,81,74,1)', backgroundColor: 'rgba(184,81,74,0.18)', tension: 0.2, spanGaps: true }] }}
      options={timeOfDayOpts} />
  </section>

  <section class="chart-card">
    <h2>🛏️ Durée nuit précédente</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [{ label: 'Nuit (h)', data: prevNightData, borderColor: 'rgba(122,154,135,1)', backgroundColor: 'rgba(122,154,135,0.18)', tension: 0.2, spanGaps: true }] }}
      options={hourOpts} />
  </section>

  <section class="chart-card">
    <h2>☀️ Sommeil total de jour</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [{ label: 'Jour (h)', data: napTotalData, borderColor: 'rgba(232,184,110,1)', backgroundColor: 'rgba(232,184,110,0.18)', tension: 0.2, spanGaps: true }] }}
      options={hourOpts} />
  </section>

  <section class="chart-card">
    <h2>💤 Nombre de siestes</h2>
    <ChartCanvas type="bar"
      data={{ labels, datasets: [{ label: 'Siestes', data: napCountData, backgroundColor: 'rgba(232,184,110,0.7)' }] }}
      options={countOpts} />
  </section>
{/if}

<style>
  .period-selector { display: flex; flex-direction: column; gap: var(--s-3); margin-bottom: var(--s-3); }
  .presets { display: flex; gap: var(--s-2); flex-wrap: wrap; }
  .custom { display: flex; gap: var(--s-3); align-items: end; flex-wrap: wrap; }
  .custom .field { min-width: 140px; }
  .chart-card { background: var(--c-bg-card); border-radius: var(--r-lg); padding: var(--s-4); box-shadow: var(--shadow-sm); margin-bottom: var(--s-4); }
  .chart-card h2 { font-size: var(--fs-base); margin-bottom: var(--s-3); display: flex; align-items: center; gap: var(--s-2); }
</style>
```

(Note: chart colors updated to use the new palette in RGBA so Chart.js can apply transparency.)

- [ ] **Step 2: Verify + commit**

```bash
npm run check
git add src/routes/app/babies/[id]/stats/+page.svelte
git commit -m "feat(design): migrate Stats page to design system"
```

---

### Task 11: `/app/babies` (list + create) and `/app/babies/[id]` (edit)

**Files:**
- Modify: `src/routes/app/babies/+page.svelte`
- Modify: `src/routes/app/babies/[id]/+page.svelte`

- [ ] **Step 1: Rewrite `src/routes/app/babies/+page.svelte`**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import Plus from 'phosphor-svelte/lib/Plus';
  import Pencil from 'phosphor-svelte/lib/Pencil';
  let { data, form } = $props();
</script>

<h1>Mes bébés</h1>

<ul class="baby-list">
  {#each data.babies as b}
    <li class="card">
      <div>
        <strong>{b.name}</strong>
        <p class="page-meta" style="margin: 0;">né(e) le {b.birthDate}</p>
      </div>
      <div class="row-actions">
        <a class="btn btn-ghost btn-sm" href="/app/babies/{b.id}/today">Aujourd'hui</a>
        <a class="btn btn-secondary btn-sm" href="/app/babies/{b.id}"><Pencil size={14} /> Éditer</a>
      </div>
    </li>
  {/each}
</ul>

<h2>Ajouter un bébé</h2>
{#if form?.error}<p class="error">{form.error}</p>{/if}
<form method="POST" action="?/create" use:enhance class="card create-form">
  <label class="field"><span class="field-label">Prénom</span>
    <input class="field-input" name="name" required />
  </label>
  <label class="field"><span class="field-label">Date de naissance</span>
    <input class="field-input" type="date" name="birth_date" required />
  </label>
  <label class="field"><span class="field-label">Heure de réveil souhaitée (facultatif)</span>
    <input class="field-input" type="time" name="desired_wake" />
  </label>
  <label class="field"><span class="field-label">Âge corrigé (mois, facultatif)</span>
    <input class="field-input" type="number" name="age_override" min="0" max="60" />
  </label>
  <button type="submit" class="btn btn-primary"><Plus size={16} /> Créer</button>
</form>

<style>
  .baby-list { list-style: none; padding: 0; margin: 0 0 var(--s-5); display: grid; gap: var(--s-3); }
  .baby-list li { display: flex; justify-content: space-between; align-items: center; gap: var(--s-3); }
  .row-actions { display: flex; gap: var(--s-2); flex-wrap: wrap; }
  .create-form { display: grid; gap: var(--s-3); max-width: 480px; }
</style>
```

- [ ] **Step 2: Rewrite `src/routes/app/babies/[id]/+page.svelte`**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import Trash from 'phosphor-svelte/lib/Trash';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';
  let { data, form } = $props();
</script>

<h1>Bébé : {data.baby.name}</h1>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/update" use:enhance class="card edit-form">
  <label class="field"><span class="field-label">Prénom</span>
    <input class="field-input" name="name" value={data.baby.name} required />
  </label>
  <label class="field"><span class="field-label">Date de naissance</span>
    <input class="field-input" type="date" name="birth_date" value={data.baby.birthDate} required />
  </label>
  <label class="field"><span class="field-label">Heure de réveil souhaitée</span>
    <input class="field-input" type="time" name="desired_wake" value={data.baby.desiredWakeTime ?? ''} />
  </label>
  <label class="field"><span class="field-label">Âge corrigé (mois)</span>
    <input class="field-input" type="number" name="age_override" min="0" max="60" value={data.baby.ageOverrideMonths ?? ''} />
  </label>
  <label class="field"><span class="field-label">Fuseau horaire (override)</span>
    <select class="field-select" name="timezone">
      <option value="">Hériter du compte</option>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={data.baby.timezone === tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> Enregistrer</button>
</form>

<form method="POST" action="?/delete" use:enhance
  onsubmit={(e) => { if (!confirm('Supprimer ce bébé et tout son historique ?')) e.preventDefault(); }}
  style="margin-top: var(--s-4);"
>
  <button type="submit" class="btn btn-danger"><Trash size={16} /> Supprimer ce bébé</button>
</form>

<style>
  .edit-form { display: grid; gap: var(--s-3); max-width: 480px; }
</style>
```

- [ ] **Step 3: Verify + commit**

```bash
npm run check
git add src/routes/app/babies/+page.svelte src/routes/app/babies/[id]/+page.svelte
git commit -m "feat(design): migrate babies list + edit pages to design system"
```

---

### Task 12: `/account` page

**Files:**
- Modify: `src/routes/account/+page.svelte`

- [ ] **Step 1: Rewrite**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import SignOut from 'phosphor-svelte/lib/SignOut';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';
  import Trash from 'phosphor-svelte/lib/Trash';
  let { data, form } = $props();
</script>

<p class="back"><a href="/app"><ArrowLeft size={14} /> Application</a></p>

<h1>Mon compte</h1>
<p class="page-meta">Connecté en tant que <strong>{data.account.email}</strong>{#if data.account.isAdmin} <span class="badge">admin</span>{/if}</p>

<h2>Fuseau horaire par défaut</h2>
{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}
<form method="POST" action="?/updateTimezone" use:enhance class="card tz-form">
  <label class="field">
    <span class="field-label">Fuseau</span>
    <select class="field-select" name="timezone">
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={data.user.timezone === tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> Enregistrer</button>
</form>

<h2>Changer mon mot de passe</h2>
<form method="POST" action="?/changePassword" use:enhance class="card pw-form">
  <label class="field"><span class="field-label">Mot de passe actuel</span>
    <input class="field-input" type="password" name="current_password" required autocomplete="current-password" />
  </label>
  <label class="field"><span class="field-label">Nouveau (≥ 10 caractères)</span>
    <input class="field-input" type="password" name="new_password" required minlength="10" autocomplete="new-password" />
  </label>
  <label class="field"><span class="field-label">Confirmer</span>
    <input class="field-input" type="password" name="confirm" required minlength="10" autocomplete="new-password" />
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> Modifier le mot de passe</button>
</form>

<h2>Sessions actives</h2>
<ul class="sessions">
  {#each data.sessions as s}
    <li class="card session-row">
      <div>
        <strong>{s.userAgent}</strong>{#if s.isCurrent} <span class="badge badge-success">cet appareil</span>{/if}
        <p class="page-meta" style="margin:0;">Dernière activité : {new Date(s.lastUsedAt * 1000).toLocaleString('fr-FR')} · expire le {new Date(s.expiresAt * 1000).toLocaleDateString('fr-FR')}</p>
      </div>
      {#if !s.isCurrent}
        <form method="POST" action="/account/sessions/{s.id}" use:enhance>
          <button type="submit" class="btn btn-ghost btn-sm"><Trash size={14} /> Révoquer</button>
        </form>
      {/if}
    </li>
  {/each}
</ul>

<form method="POST" action="/logout" style="margin-top: var(--s-4);">
  <button type="submit" class="btn btn-secondary"><SignOut size={16} /> Se déconnecter</button>
</form>

<style>
  .tz-form, .pw-form { display: grid; gap: var(--s-3); max-width: 480px; }
  .sessions { list-style: none; padding: 0; margin: 0 0 var(--s-3); display: grid; gap: var(--s-2); }
  .session-row { display: flex; justify-content: space-between; align-items: center; gap: var(--s-3); }
</style>
```

- [ ] **Step 2: Verify + commit**

```bash
npm run check
git add src/routes/account/+page.svelte
git commit -m "feat(design): migrate /account to design system"
```

---

### Task 13: `/admin/invitations` page

**Files:**
- Modify: `src/routes/admin/invitations/+page.svelte`

- [ ] **Step 1: Rewrite**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import Plus from 'phosphor-svelte/lib/Plus';
  import Copy from 'phosphor-svelte/lib/Copy';
  let { data } = $props();

  function statusOf(inv: any): string {
    const now = Math.floor(Date.now() / 1000);
    if (inv.usedAt) return 'utilisée';
    if (inv.expiresAt < now) return 'expirée';
    return 'en attente';
  }

  function badgeClass(status: string): string {
    if (status === 'utilisée') return 'badge';
    if (status === 'expirée') return 'badge badge-danger';
    return 'badge badge-warning';
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
  }
</script>

<p class="back"><a href="/app"><ArrowLeft size={14} /> Application</a></p>

<h1>Invitations</h1>

<form method="POST" action="?/create" use:enhance>
  <button type="submit" class="btn btn-primary"><Plus size={16} /> Générer une invitation</button>
</form>

{#if data.invitations.length === 0}
  <p class="empty">Aucune invitation. Génère le premier lien.</p>
{:else}
  <div class="card" style="padding: 0; overflow-x: auto; margin-top: var(--s-4);">
    <table>
      <thead><tr><th>Créée</th><th>Expire</th><th>Statut</th><th>Lien</th></tr></thead>
      <tbody>
        {#each data.invitations as inv}
          {@const st = statusOf(inv)}
          <tr>
            <td>{new Date(inv.createdAt * 1000).toLocaleDateString('fr-FR')}</td>
            <td>{new Date(inv.expiresAt * 1000).toLocaleDateString('fr-FR')}</td>
            <td><span class={badgeClass(st)}>{st}</span></td>
            <td>
              <button type="button" class="btn btn-ghost btn-sm" onclick={() => copy(inv.link)} title={inv.link}>
                <Copy size={14} /> Copier
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run check
git add src/routes/admin/invitations/+page.svelte
git commit -m "feat(design): migrate /admin/invitations to design system"
```

---

### Task 14: `/+error.svelte`

**Files:**
- Modify: `src/routes/+error.svelte`

- [ ] **Step 1: Rewrite**

```svelte
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
```

- [ ] **Step 2: Verify + commit**

```bash
npm run check
git add src/routes/+error.svelte
git commit -m "feat(design): migrate error page to design system"
```

---

## Phase 3 — Final verification

### Task 15: Full smoke test + rebuild

**Files:** none (verification only)

- [ ] **Step 1: Build + restart**

```bash
docker compose down
docker compose up -d --build
sleep 12
```

- [ ] **Step 2: Public HTTPS healthz**

```bash
curl -sSk --resolve babysleep.gavark.fr:443:127.0.0.1 https://babysleep.gavark.fr/healthz
```

Expected: `ok`.

- [ ] **Step 3: Verify Nunito served**

```bash
curl -sSI --resolve babysleep.gavark.fr:443:127.0.0.1 https://babysleep.gavark.fr/_app/immutable/assets/index.css | head -5
```

Just confirms CSS is served. Then in browser, open DevTools → Network → reload login page, filter by "woff2" → at least one Nunito file should load 200.

- [ ] **Step 4: Manual smoke browser**

In an incognito window (no SW cache to fight with):
1. Login → see new look
2. Today → fill fields, save, verify suggestions + persistence
3. History → table styled, CSV button works
4. Stats → charts render with new palette
5. Account → change theme via toggle button in header; reload page; theme persists
6. Toggle to dark mode → page should re-color across the board
7. Toggle back to auto → reload page → matches OS preference

- [ ] **Step 5: All vitest tests still green**

```bash
npm test
```

Expected: 107 passing (no new tests added in this plan — design changes don't touch logic).

- [ ] **Step 6: Final commit if any cleanups**

```bash
git status
# Should be clean. If there's any drift (e.g., generated .svelte-kit changes), commit them.
```

- [ ] **Step 7: Push**

```bash
git push origin master
```

---

## Self-Review

**Spec coverage (`docs/superpowers/specs/2026-05-14-design-system.md`):**

| Spec section | Plan task | ✓ |
|---|---|---|
| §2 Décisions (palette, typo, icônes, dark mode auto+toggle) | Tasks 1, 3, 4, 5, 7 | ✓ |
| §3 Tokens (couleurs light/dark, typo, spacing, radius, shadows) | Task 1 step 2 | ✓ |
| §4 Composants (button, input, card, key-box, nap-block, hint, nav, badge) | Task 1 step 4 | ✓ |
| §5 Inventaire icônes Phosphor (Bed, Clock, Sun, Moon, Star, ListChecks, ChartLine, Pencil, ArrowLeft, Plus, Trash, SignOut, UserCircle, Envelope, FloppyDisk, Globe) | Across Tasks 5-14 | ✓ |
| §6.1 Fichiers nouveaux (tokens.css, base.css, components.css, ThemeToggle.svelte) | Tasks 1, 5 | ✓ |
| §6.2 Modification du layout racine + SSR data-theme | Tasks 2, 3 | ✓ |
| §6.3 Toggle dark mode (3 états, cookie, endpoint, SSR-safe) | Tasks 3, 4, 5, 7 | ✓ |
| §6.4 Migration ordre (login → signup → app layout → today → history → stats → babies → account → admin → error) | Tasks 6-14 | ✓ |
| §6.5 Stratégie progressive (un commit par page) | Each task = one commit | ✓ |
| §6.6 Tests (Vitest reste vert) | Task 15 step 5 | ✓ |
| §7 Compat CSP/manifest | Task 2 step 3 (manifest) ; CSP unchanged (no Google Fonts) | ✓ |
| §9 Critères de succès (Nunito visible, toggle fonctionnel, light+dark sur tous les écrans, manifest cohérent, tests verts, pas de régression fonctionnelle) | Task 15 | ✓ |

**Placeholder scan:** No TBDs or empty steps. All code blocks complete. Commands include expected outputs.

**Type consistency:** State variable names in Today match between $state declarations and event handlers. Phosphor icon import paths consistent across tasks (`phosphor-svelte/lib/IconName`). CSS class names (`btn`, `card`, `key-box`, `nap-block`, `hint`, `field`, `field-label`, `field-input`, `field-select`, `field-textarea`, `tab`, `nav-pill`, `sub-nav`, `sub-tab`, `back`, `badge`, `summary-strip`) appear consistently between component definitions (Task 1) and consumers (Tasks 6-14).
