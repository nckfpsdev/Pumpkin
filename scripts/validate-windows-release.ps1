param(
  [Parameter(Mandatory = $true)][string]$Path,
  [ValidateSet("x64", "installer")][string]$Expected = "x64"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
  throw "Release file not found: $Path"
}

$item = Get-Item -LiteralPath $Path
if ($item.Length -lt 100000) {
  throw "Release file is implausibly small ($($item.Length) bytes): $Path"
}

$bytes = [System.IO.File]::ReadAllBytes($item.FullName)
if ($bytes.Length -lt 256) {
  throw "Release file is too small to be a PE executable."
}

$head = [System.Text.Encoding]::ASCII.GetString($bytes, 0, [Math]::Min(256, $bytes.Length))
if ($head -match '(?i)<!doctype|<html|Cookie check') {
  throw "HTML/cookie-check content detected instead of a Windows executable."
}

if ($bytes[0] -ne 0x4D -or $bytes[1] -ne 0x5A) {
  throw "Invalid DOS/PE header: expected MZ (4D 5A)."
}

$peOffset = [BitConverter]::ToInt32($bytes, 0x3C)
if ($peOffset -lt 0x40 -or ($peOffset + 6) -ge $bytes.Length) {
  throw "Invalid e_lfanew/PE offset: $peOffset"
}

if ($bytes[$peOffset] -ne 0x50 -or $bytes[$peOffset + 1] -ne 0x45 -or
    $bytes[$peOffset + 2] -ne 0x00 -or $bytes[$peOffset + 3] -ne 0x00) {
  throw "Missing PE\0\0 signature."
}

$machine = [BitConverter]::ToUInt16($bytes, $peOffset + 4)
if ($Expected -eq "x64" -and $machine -ne 0x8664) {
  throw ("Expected AMD64 PE machine 0x8664, got 0x{0:X4}" -f $machine)
}

if ($Expected -eq "installer" -and $machine -notin @(0x014c, 0x8664)) {
  throw ("Unexpected NSIS PE machine 0x{0:X4}" -f $machine)
}

$hash = (Get-FileHash -LiteralPath $item.FullName -Algorithm SHA256).Hash.ToLowerInvariant()

Write-Host "VALIDATION PASSED"
Write-Host "Path: $($item.FullName)"
Write-Host "Size: $($item.Length)"
Write-Host ("PE Machine: 0x{0:X4}" -f $machine)
Write-Host "SHA-256: $hash"
