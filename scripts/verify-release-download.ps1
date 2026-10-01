param(
  [Parameter(Mandatory = $true)][string]$Url,
  [Parameter(Mandatory = $true)][string]$ExpectedSha256
)

$ErrorActionPreference = "Stop"
$temp = Join-Path $env:RUNNER_TEMP "pumpkin-release-roundtrip.exe"

if (Test-Path $temp) {
  Remove-Item $temp -Force
}

$response = Invoke-WebRequest -Uri $Url -OutFile $temp -MaximumRedirection 10 -PassThru
$contentType = [string]$response.Headers["Content-Type"]

if ($response.StatusCode -ne 200) {
  throw "Expected HTTP 200, got $($response.StatusCode)"
}

if ($contentType -match '(?i)text/html|text/plain') {
  throw "Release URL returned an invalid content type: $contentType"
}

& "$PSScriptRoot/validate-windows-release.ps1" -Path $temp -Expected installer

$actual = (Get-FileHash -LiteralPath $temp -Algorithm SHA256).Hash.ToLowerInvariant()
$expected = $ExpectedSha256.ToLowerInvariant()

if ($actual -ne $expected) {
  throw "Round-trip SHA-256 mismatch. Expected $expected, got $actual"
}

Write-Host "ROUNDTRIP PASSED"
Write-Host "URL: $Url"
Write-Host "Content-Type: $contentType"
Write-Host "SHA-256: $actual"
