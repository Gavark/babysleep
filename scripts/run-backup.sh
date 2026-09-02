#!/bin/sh
# Daily SQLite backup. Run from cron inside the backup container.
set -eu

TS="$(date -u +%Y%m%dT%H%M%SZ)"
RETENTION="${BACKUP_RETENTION:-30}"
SRC="/data/babysleep.sqlite"
DEST_DIR="/backups"
DEST_FILE="${DEST_DIR}/babysleep-${TS}.sqlite"

# Retention only ever considers snapshots this script writes, so hand-made ones
# (babysleep-predeploy-v0.7.0.sqlite) are never swept up by the rotation.
AUTO_GLOB='babysleep-[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]T[0-9][0-9][0-9][0-9][0-9][0-9]Z.sqlite'

log() { echo "[$(date -u +%FT%TZ)] $*"; }

fail() {
  log "backup FAILED: $1"
  rm -f "$DEST_FILE"
  exit 1
}

mkdir -p "$DEST_DIR"

# Skip gracefully if the source DB does not exist yet (e.g. first-boot race)
if [ ! -f "$SRC" ]; then
  log "source not found, skipping: $SRC"
  exit 0
fi

# Atomic backup using sqlite3 .backup (safe even if DB is open / writes in flight).
# sqlite3 exits 0 even when a dot-command fails, so its status proves nothing —
# the snapshot itself is verified below instead of trusted.
sqlite3 "$SRC" ".backup '${DEST_FILE}'" || true

[ -s "$DEST_FILE" ] || fail "no snapshot written, or it is empty"

if [ "$(sqlite3 "$DEST_FILE" 'PRAGMA integrity_check;' 2>/dev/null | head -n 1)" != "ok" ]; then
  fail "snapshot did not pass integrity_check"
fi

# Retention: keep the newest N snapshots. Only reached once the new snapshot is
# verified, so a failed run never prunes a good backup to make room for a bad one.
# shellcheck disable=SC2086 # AUTO_GLOB must stay unquoted to expand as a glob
ls -1t ${DEST_DIR}/$AUTO_GLOB 2>/dev/null \
  | tail -n +$((RETENTION + 1)) \
  | xargs -r rm -f

log "backup written: $(basename "$DEST_FILE")"
