param (
    [Parameter(Mandatory=$true)]
    [string]$Message,
    [switch]$Fast
)

Clear-Host
Write-Host "--- SHIPPING FIXES TO VPS ---" -ForegroundColor Cyan

# 1. Sync Code
Write-Host "[1/3] Staging changes..." -ForegroundColor Gray
git add .

Write-Host "[2/3] Committing..." -ForegroundColor Gray
git commit -m "$Message"

# 2. Add Fast Flag to VPS script if requested
if ($Fast) {
    Write-Host "⚡ TURBO MODE ENABLED: Skipping npm install on server..." -ForegroundColor Yellow
    # We pass an environment variable to the VPS
    $env:FAST_BUILD = "true"
}

Write-Host "[3/3] Pushing to Live Server..." -ForegroundColor Gray
git push live master

Write-Host ""
Write-Host "SUCCESS: Your VPS is now updating. Check your browser soon!" -ForegroundColor Green
