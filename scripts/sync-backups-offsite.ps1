# Copy recent BabySleep snapshots to an off-site folder (Google Drive, OneDrive,
# Dropbox, a NAS share...) and keep only the last N days there.
# Meant for a Windows host, run nightly by Task Scheduler. See docs/BACKUP.md.
# Works with Windows PowerShell 5.1 and PowerShell 7.
#
#   powershell -File scripts\sync-backups-offsite.ps1 -Destination 'G:\My Drive\Backups\BabySleep' -DryRun
param(
  [Parameter(Mandatory = $true)]
  [string]$Destination,
  [string]$Source,
  [int]$RetentionDays = 7,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
# Windows PowerShell 5.1 leaves $PSScriptRoot empty inside param() defaults,
# so the default source (the repo's ./backups/) is resolved here.
if (-not $Source) { $Source = Join-Path $PSScriptRoot '..\backups' }
$Source = [System.IO.Path]::GetFullPath($Source)
# The log sits with the local snapshots: ./backups/ is gitignored and always on local disk.
$LogFile = Join-Path $Source 'sync-offsite.log'

function Write-Log([string]$Message) {
  $prefix = if ($DryRun) { '(dry-run) ' } else { '' }
  $line = '[{0}] {1}{2}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $prefix, $Message
  Write-Output $line
  if (-not $DryRun -and (Test-Path $Source)) { Add-Content -Path $LogFile -Value $line -Encoding UTF8 }
}

try {
  if (-not (Test-Path $Source)) { throw "Source folder not found: $Source" }

  # Keep the log from growing forever: last 500 lines.
  if ((Test-Path $LogFile) -and -not $DryRun) {
    $lines = Get-Content $LogFile -Encoding UTF8
    if ($lines.Count -gt 500) { $lines | Select-Object -Last 500 | Set-Content $LogFile -Encoding UTF8 }
  }

  # A synced drive (Google Drive for desktop, a mapped share) only exists while its
  # client runs. If it is missing, touch nothing.
  $destRoot = [System.IO.Path]::GetPathRoot($Destination)
  if (-not (Test-Path $destRoot)) { throw "Destination drive not available ($destRoot), nothing done." }
  if (-not (Test-Path $Destination)) {
    if (-not $DryRun) { New-Item -ItemType Directory -Path $Destination | Out-Null }
    Write-Log "created: $Destination"
  }

  $cutoff = (Get-Date).AddDays(-$RetentionDays)

  # 1. Copy local snapshots younger than N days that are missing (or differ in size)
  #    at the destination. Each copy is hash-checked against the original.
  $copied = 0
  $recent = Get-ChildItem -Path $Source -Filter '*.sqlite' -File | Where-Object { $_.LastWriteTime -ge $cutoff }
  foreach ($file in $recent) {
    $target = Join-Path $Destination $file.Name
    if ((Test-Path $target) -and ((Get-Item $target).Length -eq $file.Length)) { continue }
    if ($DryRun) { Write-Log "would copy: $($file.Name)"; $copied++; continue }
    Copy-Item -Path $file.FullName -Destination $target -Force
    if ((Get-FileHash $file.FullName -Algorithm SHA256).Hash -ne (Get-FileHash $target -Algorithm SHA256).Hash) {
      Remove-Item $target -Force
      throw "copy corrupted (hash mismatch), removed: $($file.Name)"
    }
    Write-Log "copied: $($file.Name)"
    $copied++
  }

  # 2. Rotation: delete destination snapshots older than N days (by modification
  #    time, which Copy-Item preserves). Safety net: prune nothing when the
  #    destination holds no recent snapshot, so a stalled sidecar never empties it.
  $onDest = @(Get-ChildItem -Path $Destination -Filter '*.sqlite' -File -ErrorAction SilentlyContinue)
  $recentOnDest = @($onDest | Where-Object { $_.LastWriteTime -ge $cutoff }).Count
  if ($DryRun) { $recentOnDest += $copied }
  $deleted = 0
  if ($recentOnDest -eq 0) {
    Write-Log "WARNING: no snapshot younger than $RetentionDays days, rotation skipped."
  } else {
    foreach ($old in ($onDest | Where-Object { $_.LastWriteTime -lt $cutoff })) {
      if ($DryRun) { Write-Log "would delete: $($old.Name)"; $deleted++; continue }
      Remove-Item -Path $old.FullName -Force
      Write-Log "deleted: $($old.Name)"
      $deleted++
    }
  }

  Write-Log "OK: $copied copied, $deleted deleted, $recentOnDest recent snapshot(s) at destination."
  exit 0
}
catch {
  Write-Log "FAILED: $($_.Exception.Message)"
  exit 1
}
