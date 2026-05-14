#!/bin/sh
# Daily SQLite backup. Run from cron inside the backup container.
set -eu

TS="$(date -u +%Y%m%dT%H%M%SZ)"
RETENTION="${BACKUP_RETENTION:-30}"
SRC="/data/babysleep.sqlite"
DEST_DIR="/backups"
DEST_FILE="${DEST_DIR}/babysleep-${TS}.sqlite"

mkdir -p "$DEST_DIR"

# Skip gracefully if the source DB does not exist yet (e.g. first-boot race)
if [ ! -f "$SRC" ]; then
  echo "[$(date -u +%FT%TZ)] source not found, skipping: $SRC"
  exit 0
fi

# Atomic backup using sqlite3 .backup (safe even if DB is open / writes in flight)
sqlite3 "$SRC" ".backup '${DEST_FILE}'"

# Retention: keep the newest N backups
ls -1t "${DEST_DIR}"/babysleep-*.sqlite 2>/dev/null \
  | tail -n +$((RETENTION + 1)) \
  | xargs -r rm -f

echo "[$(date -u +%FT%TZ)] backup written: $(basename "$DEST_FILE")"
