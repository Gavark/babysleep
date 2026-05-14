#!/bin/sh
# Usage: scripts/backup.sh /path/to/backup-dir
set -e
DEST="${1:-./backups}"
SRC="${DATABASE_PATH:-/data/babysleep.sqlite}"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$DEST"
sqlite3 "$SRC" ".backup '$DEST/babysleep-$TS.sqlite'"
echo "Backup written to $DEST/babysleep-$TS.sqlite"
