# Upgrading

BabySleep follows [SemVer](https://semver.org). For `v0.x` releases I make no
backward-compatibility promise on the data model or the configuration surface
— breaking changes can land in any minor bump until the project reaches `v1.0`.
That said, migrations are additive only so far (no drops, no destructive
changes), so upgrades within `v0.x` should _in practice_ be safe.

## TL;DR

```bash
# Always back up first.
docker compose -f docker-compose.full.yml exec backup sh /usr/local/bin/run-backup

# Pull the new image and restart.
docker compose -f docker-compose.full.yml pull app
docker compose -f docker-compose.full.yml up -d app

# Watch the migration run + healthcheck come back.
docker compose -f docker-compose.full.yml logs -f app
```

That's it for routine updates. The rest of this page is for the edge cases.

## Version pinning

Both compose files ship pinned to a release tag, so a deployment is
reproducible and `docker inspect` reports the version actually running:

```yaml
services:
  app:
    image: ghcr.io/gavark/babysleep:v0.7.3
```

This is why the update procedure starts with `git pull`: the new tag arrives
with the compose file, and `docker compose pull` then fetches that exact
image. Nothing moves under you between releases.

If you would rather track the `master` branch and update on every pull, swap
the tag for `:latest` in your own copy of the file.

Available tags are listed at
<https://github.com/Gavark/babysleep/pkgs/container/babysleep>.

Immutable per-commit tags are also published as `:sha-<7-char-sha>` if you
need to roll back to a specific code state without relying on a release tag.

## What runs at startup

The container's entrypoint runs in this order:

1. **Drizzle migrations** (`migrate.ts`) — applies any pending SQL files in
   `drizzle/`. Already-applied migrations are skipped via Drizzle's bookkeeping
   table.
2. **`bootstrapAdmin`** — if `ADMIN_EMAIL` + `ADMIN_PASSWORD` are set AND the
   `users` table is empty, inserts the admin. No-op otherwise.
3. **HTTP server** — listens on port `3000`.

Migrations run **inside the container, against the live volume**. There is no
separate "migrate-then-start" two-step. If a migration fails, the container
exits non-zero and the healthcheck eventually marks it unhealthy.

## Rolling back

If an upgrade misbehaves:

```bash
# Pin to the previous tag in docker-compose.full.yml, then:
docker compose -f docker-compose.full.yml pull app
docker compose -f docker-compose.full.yml up -d app
```

If the previous version doesn't understand a column the newer migration added,
**that's a data-loss risk** — rolling back doesn't undo migrations. Either:

- Restore the pre-upgrade backup (see [BACKUP.md](./BACKUP.md#restore)), or
- Stay on the newer version and fix forward.

Practically speaking, all `v0.x` migrations so far only add columns/tables.
Older code ignores new columns harmlessly. Test on a fresh staging instance
before doing this on data you care about.

## Zero-downtime upgrades

The shipped compose layout assumes a single-instance deployment with a tiny
downtime window during the recreate (`docker compose up -d` stops the old
container then starts the new one — typically 1-5 seconds).

For true zero-downtime, you need:

- A second instance pointed at a copy of the DB
- A load balancer that drains the old instance before tearing it down
- Migrations that are backward-compatible with the OLD code (i.e. additive
  only — fortunate that we already do that)

That's well outside the scope of a self-hosted family app, so the project
doesn't ship anything to support it. If you need it, you're better off
hand-rolling a blue/green setup with two compose stacks + your reverse proxy.

## Schema migrations

Migrations live in [`drizzle/`](../drizzle) as numbered `.sql` files plus a
JSON snapshot under `drizzle/meta/`. They're generated with:

```bash
npm run db:generate
```

after a schema change in `src/lib/server/db/schema.ts`. Generated migrations
should be reviewed (in particular, watch for SQLite's "rebuild the table"
warnings for non-trivial column changes — Drizzle handles them but the
generated SQL can be surprising). All migrations to date have been a single
`ALTER TABLE ... ADD COLUMN` each.

## Major version bumps (future)

When `v1.0.0` ships, this page will gain a "migrating from v0.x" section
covering any schema rename, env var reshuffle, or behaviour change relative
to the latest `v0.x`. For now, no `v1.0` is on the horizon — the project is
still feature-finding.

## Got stuck?

Open an issue at <https://github.com/Gavark/babysleep/issues>. Include:

- Source version (output of `docker inspect babysleep --format '{{.Image}}'`)
- Target version (the tag you tried to pull)
- The relevant lines from `docker compose logs app` around the migration
  failure
- Your `docker-compose.<full|minimal>.yml` and a redacted `.env` if relevant

The more concrete the report, the faster the fix.
