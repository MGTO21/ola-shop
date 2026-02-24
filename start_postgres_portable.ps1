# Portable PostgreSQL Runner - Ola Shop v2.0
# Place this script inside the 'pgsql' folder you extracted.

$baseDir = Get-Location
$binDir = Join-Path $baseDir "bin"
$dataDir = Join-Path $baseDir "data"
$logFile = Join-Path $baseDir "logfile.log"

Write-Host "--- Portable PostgreSQL Setup ---" -ForegroundColor Cyan

# 1. Initialize Data Directory if not exists
if (!(Test-Path $dataDir)) {
    Write-Host "Initializing database data folder..." -ForegroundColor Yellow
    & "$binDir\initdb.exe" -D "$dataDir" -U postgres --auth=trust
}

# 2. Start PostgreSQL
Write-Host "Starting PostgreSQL server..." -ForegroundColor Green
& "$binDir\pg_ctl.exe" -D "$dataDir" -l "$logFile" start

Write-Host "Waiting for server to start..."
Start-Sleep -s 5

# 3. Create medusa_db if not exists
Write-Host "Checking/Creating database 'medusa_db'..." -ForegroundColor Cyan
& "$binDir\psql.exe" -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'medusa_db'" | Out-Null
if ($LASTEXITCODE -ne 0) {
     & "$binDir\psql.exe" -U postgres -c "CREATE DATABASE medusa_db;"
     Write-Host "✅ Database 'medusa_db' created successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ Database 'medusa_db' already exists." -ForegroundColor Green
}

Write-Host "--- DONE! ---" -ForegroundColor Green
Write-Host "Keep this PowerShell window open to keep the database running." -ForegroundColor Yellow
Write-Host "Now you can go back to the chat and tell me to run the project." -ForegroundColor Cyan
