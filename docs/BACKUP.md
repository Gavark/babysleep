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
- **Retention:** keeps the newest 30 automatic snapshots; older ones are deleted.
  Snapshots you name yourself (e.g. `babysleep-predeploy-v0.7.0.sqlite`) are
  never pruned

Both schedule and retention are tunable via env vars — see
[CONFIGURATION.md](./CONFIGURATION.md#backup-sidecar-full-compose-only).

The script uses SQLite's `.backup` command (not a raw `cp`), which is safe
against concurrent writes by the app — SQLite handles the lock internally and
produces a consistent snapshot.

Every snapshot is verified before the run is called a success: the file must be
non-empty and pass `PRAGMA integrity_check`. A snapshot that fails either check
is deleted and the run exits non-zero (visible in `docker logs babysleep-backup`)
rather than leaving a broken file that looks like a real backup. Retention runs
only after a snapshot passes, so a failed run never prunes a good backup.

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

### Windows host: Task Scheduler + a synced folder

If Docker runs on a Windows machine, the simplest off-site target is a folder
your cloud client already syncs: Google Drive for desktop, OneDrive, Dropbox,
or a mapped NAS share. [`scripts/sync-backups-offsite.ps1`](../scripts/sync-backups-offsite.ps1)
copies the snapshots from `./backups/` into that folder and rotates them there:

- **Copy:** every `*.sqlite` in `./backups/` younger than `-RetentionDays`
  (default 7) that is missing at the destination, named snapshots included. Each
  copy is checked against the original with SHA256; a mismatch removes the copy
  and fails the run.
- **Rotation:** destination snapshots older than `-RetentionDays` are deleted.
  If the destination has no recent snapshot at all (e.g. the sidecar has been
  failing for a week), nothing is deleted, so the folder is never emptied.
- **Log:** `./backups/sync-offsite.log` (last 500 lines). The exit code is
  non-zero on failure, so Task Scheduler's _Last Run Result_ shows it too.

Check what it would do first:

```powershell
powershell -File scripts\sync-backups-offsite.ps1 -Destination 'G:\My Drive\Backups\BabySleep' -DryRun
```

Then register a daily task (run from the repo checkout):

```powershell
$script = (Resolve-Path scripts\sync-backups-offsite.ps1).Path
$dest   = 'G:\My Drive\Backups\BabySleep'
$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
  -Argument "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$script`" -Destination `"$dest`""
$trigger  = New-ScheduledTaskTrigger -Daily -At '23:00'
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 15)
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive
Register-ScheduledTask -TaskPath '\BabySleep\' -TaskName 'Off-site backup' `
  -Action $action -Trigger $trigger -Settings $settings -Principal $principal
```

Things to get right:

- **Timing:** the trigger uses the **host's** clock, while the sidecar's
  `BACKUP_SCHEDULE` uses the container's `TZ`. Convert one to the other and
  leave at least half an hour after the snapshot (it is safe to run earlier,
  that day's snapshot just goes over the next night). `-StartWhenAvailable`
  catches up a run missed while the machine was off.
- **Logged-in session:** a drive letter like `G:` exists only while the sync
  client runs in your session, so the task uses an interactive logon. When the
  drive is missing the run fails and touches nothing.
- **Deleted files:** rotation deletes through the sync client, so they usually
  land in the provider's trash for a while (30 days on Google Drive) before
  they are really gone.
