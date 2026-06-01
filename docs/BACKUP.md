# Backup & restore

BabySleep's entire dataset lives in a **single SQLite file** at
`/data/babysleep.sqlite` inside the container, persisted via the Docker named
volume `babysleep_data`. Backing it up correctly is just a matter of copying
that file (with `sqlite3 .backup` — see below — to be safe even if the app is
writing at that moment).

## What the bundled sidecar does

If you run [`docker-compose.full.yml`](../docker-compose.full.yml), an Alpine
container named `babysleep-backup` runs `scripts/run-backup.sh` from a cron
job. By default:

- **Schedule:** every day at 03:00 (`TZ` timezone)
- **Destination:** `./backups/` on the host (bind-mounted into the sidecar)
- **Filename:** `babysleep-YYYYMMDDTHHMMSSZ.sqlite`
- **Retention:** keeps the newest 30 snapshots; older ones are deleted

Both schedule and retention are tunable via env vars — see
[CONFIGURATION.md](./CONFIGURATION.md#backup-sidecar-full-compose-only).

The script uses SQLite's `.backup` command (not a raw `cp`), which is safe
against concurrent writes by the app — SQLite handles the lock internally and
produces a consistent snapshot.

## Trigger a backup on demand

```bash
docker compose -f docker-compose.full.yml exec backup sh /usr/local/bin/run-backup
```

You'll see a one-line confirmation like:

```
[2026-05-28T20:37:19Z] backup written: babysleep-20260528T203719Z.sqlite
```

The file appears in `./backups/` immediately. Useful before any risky change
(version upgrade, schema migration, manual SQL).

## Verify a backup is valid

```bash
docker exec babysleep-backup sqlite3 /backups/babysleep-<TS>.sqlite \
  "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM sleep_entries;"
```

Counts that match what you expect = file is structurally sound. SQLite will
complain loudly if the file is corrupted.

## Restore

Stop the app, swap the file, restart:

```bash
# 1. Stop the app (Caddy and the backup sidecar can stay up)
docker compose -f docker-compose.full.yml stop app

# 2. Overwrite the live DB with the chosen snapshot
docker cp ./backups/babysleep-<TS>.sqlite babysleep:/data/babysleep.sqlite

# 3. Restart the app — migrations re-run idempotently on the restored file
docker compose -f docker-compose.full.yml start app
```

Migrations are additive, so a snapshot taken at any earlier version is
forward-compatible with a newer app build — restoring a 30-day-old backup
under the current image just re-applies any migrations that landed since.

## If you use the minimal compose

The minimal `docker-compose.yml` does not include the backup sidecar.
Pick a tool you already trust and point it at the `babysleep_data` Docker
volume:

```bash
# restic example
restic backup /var/lib/docker/volumes/<your-prefix>_babysleep_data/_data
```

Or run a one-shot snapshot whenever you remember:

```bash
docker run --rm \
  -v <your-prefix>_babysleep_data:/data:ro \
  -v $(pwd)/backups:/backups \
  alpine:3 sh -c "apk add --no-cache sqlite >/dev/null && \
    sqlite3 /data/babysleep.sqlite \".backup '/backups/babysleep-$(date -u +%Y%m%dT%H%M%SZ).sqlite'\""
```

`<your-prefix>_babysleep_data` is the volume name Docker Compose generates —
run `docker volume ls | grep babysleep` to find the exact name (usually
`<directory-name>_babysleep_data`).

## What to back up beyond the database

In a strict sense, the SQLite file is the only thing that's _yours_. But for a
true disaster-recovery scenario where you lose the whole host, also keep
copies of:

- **`.env`** — any admin/backup credentials you set there. Without it the
  instance still boots; you'd just have to re-enter the configuration.
- **`Caddyfile`** — your domain and any tuning you've added. The
  `Caddyfile.example` in the repo is a starting point only.
- **The contents of `./backups/`** — push them off-site (S3, B2, rsync to a
  second machine). The whole point of backup is that they survive your
  primary failure.

## Off-site

The bundled sidecar only writes to local disk. For off-site copies, the
cleanest pattern is a separate cron on the host:

```cron
# /etc/crontab
30 3 * * * root rclone copy --max-age 24h /opt/babysleep/backups remote:babysleep-backups
```

(Adjust paths and the rclone remote name to match your setup. Run after `0 3`
so the sidecar has already produced today's snapshot.)
