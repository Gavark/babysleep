# Configuration

All runtime configuration is environment variables, read at container start.
The canonical list with sane defaults lives in [`.env.example`](../.env.example);
this page adds context, edge cases, and the few vars that aren't in the example
because they only apply to specific topologies.

## Core

### Sessions — no `SESSION_SECRET` needed

Earlier versions of this file documented a `SESSION_SECRET` env var. It was
never read by the application and has been removed from `.env.example` and
the compose files. Drop it from your `.env` if you set it.

Sessions are protected by 256-bit cryptographically random IDs generated via
`crypto.randomBytes(32)` and stored server-side in the `sessions` table. The
session cookie is set with `HttpOnly`, `Secure` (in production), and
`SameSite=Lax`. Each request looks the ID up against the DB, so there is no
shared secret to rotate.

To force-logout everyone, delete rows from the `sessions` table or use the
"sign out other devices" UI on `/account`.

### `DATABASE_PATH` _(default `/data/babysleep.sqlite`)_

Absolute path to the SQLite file inside the container. The default matches the
Docker volume layout in the shipped compose files. Override only if you mount
the data volume somewhere else.

The directory holding the file must exist and be writable by the `node` user
(uid 1000 in the official image). The shipped Dockerfile `chown`s `/data` at
build time; if you point at a custom path you have to handle ownership.

### `TZ` _(default `Europe/Paris`)_

Container timezone. Affects log timestamps, the backup cron schedule, and the
default `formatHHMM` rendering server-side (the app also resolves a per-user
and per-baby timezone for in-app display, so this only matters for log lines
and the backup cron).

### `NODE_ENV`

The runtime image hard-codes `NODE_ENV=production`. Do not override unless
you're running a custom build for development inside Docker.

## Setup wizard

### `ADMIN_EMAIL`, `ADMIN_PASSWORD` _(optional)_

If **both** are set when the container starts on an empty `users` table, the
admin account is created silently from these values and the `/setup` wizard
never appears. Useful for scripted/automated deployments (Terraform, Ansible,
unattended provisioning).

If either is unset, or if a user already exists, these variables are ignored.
The first visitor will go through the wizard at `/setup` instead.

Password must be ≥ 10 characters. The validator is identical to the wizard's
and to the password-reset script; weak values cause the container to crash
at startup with an explicit error.

### `DISABLE_SIGNUP` _(default `false`)_

`true` blocks the `/signup` endpoint entirely (returns a "disabled" notice).
Invitation links generated from `/admin/invitations` still work — they bypass
the signup gate because the admin explicitly issued them.

Use this when you want a fully-private instance where only invitees can
join, OR when you've decided your instance is "full".

## Reverse-proxy / origin

### `ORIGIN` _(required behind a proxy)_

Public HTTPS URL of the deployment, e.g. `https://babysleep.example.com`.
SvelteKit checks the `Origin` header on POSTs against this value as CSRF
protection. If unset behind a proxy, every form submission gets rejected with
a 403.

For local HTTP testing without a proxy, set `ORIGIN=http://localhost:3000`.

### `PROTOCOL_HEADER`, `HOST_HEADER`

Set to `x-forwarded-proto` and `x-forwarded-host` respectively in the shipped
compose files. They tell SvelteKit which headers your reverse proxy uses to
declare the original protocol/host. Caddy, Traefik, and Nginx all use these
defaults. Leave them as-is unless your proxy uses different header names.

## Backup sidecar (full compose only)

These apply only when you run `docker-compose.full.yml`, which includes the
nightly backup container.

### `BACKUP_RETENTION` _(default `30`)_

How many SQLite snapshot files to keep in `./backups/`. The oldest are pruned
after each successful backup. Set to a higher number if you have disk space
and want a longer history (the DB is tiny — a few KB per snapshot).

### `BACKUP_SCHEDULE` _(default `0 3 * * *`)_

Standard 5-field cron expression. The default runs once a day at 03:00 local
time (`TZ`). Examples:

| Value | Meaning |
|---|---|
| `0 3 * * *` | Daily at 03:00 |
| `0 */6 * * *` | Every 6 hours |
| `0 3 * * 0` | Sundays only at 03:00 |
| `30 2 * * *` | Daily at 02:30 |

Tighter schedules give you finer rollback granularity but eat more disk.

## What's NOT a runtime variable

- **Database schema/migrations** — applied by the app at startup via Drizzle;
  no configuration knob.
- **Age-bracket sleep parameters** (wake windows, recommended nap counts) —
  hardcoded in [`src/lib/age-params.ts`](../src/lib/age-params.ts). To change,
  rebuild the image.
- **Phosphor icon set, Nunito typography, theme palette** — baked at build
  time. Custom branding requires a fork.
- **Rate-limit thresholds** (5 attempts / 15 min on `/login` and `/signup`)
  — hardcoded in [`src/hooks.server.ts`](../src/hooks.server.ts).

## Verifying your configuration

Once the container is up:

```bash
# Should return 200 even without auth
curl -fsI http://localhost:3000/healthz | head -1
```

If you're behind a proxy, check that headers propagate correctly:

```bash
curl -fsI https://your-domain/healthz | head -1
```

A 200 means the reverse proxy is reaching the app and `ORIGIN` is set
correctly. A 403 on a POST (e.g. to `/login`) almost always means `ORIGIN`
doesn't match the URL the user is visiting.
