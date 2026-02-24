# Ola Shop v2.0 - Enhanced Startup Script
# ========================================
# Auto-starts all services with health checks and error recovery

param(
    [switch]$Clean = $false  # Clean start (kill existing processes)
)

$ErrorActionPreference = "Continue"

# Configuration
$PROJECT_ROOT = $PSScriptRoot
$BACKEND_DIR = Join-Path $PROJECT_ROOT "apps\backend"
$STOREFRONT_DIR = Join-Path $PROJECT_ROOT "apps\storefront"

# Fix for Arabic characters in PostgreSQL on Windows
$env:PGCLIENTENCODING = "UTF8"

# Fix for Out of Memory errors during Medusa Dashboard build
$env:NODE_OPTIONS = "--max-old-space-size=4096"

$PG_PATH = "C:\Users\DELL\Downloads\pgsql"
$PG_DATA = Join-Path $PG_PATH "data"
$PG_BIN = Join-Path $PG_PATH "bin"

# Colors
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Info "======================================="
Write-Info "   Ola Shop v2.0 Startup Manager   "
Write-Info "======================================="

# Step 1: Clean existing processes if requested
if ($Clean) {
    Write-Warning "Cleaning existing processes..."
    
    # Kill node processes
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    # Kill processes on specific ports
    $ports = @(9000, 3000, 3001, 3003, 5432, 6379)
    foreach ($port in $ports) {
        $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($conn) {
            $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Warning "  Killing process on port $port ($($proc.Name))"
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            }
        }
    }
    
    Write-Success "[OK] Cleanup complete"
    Start-Sleep -Seconds 2
}

# Step 2: Start PostgreSQL
Write-Info ""
Write-Info "[PostgreSQL Database]"
Write-Info "---------------------"

$pgRunning = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
if ($pgRunning) {
   Write-Success "[OK] Already running on port 5432"
} else {
    Write-Warning "[!] Not running, starting..."
    
    if (Test-Path $PG_BIN) {
        try {
            $pgCtl = Join-Path $PG_BIN "pg_ctl.exe"
            Write-Info "  Executing: $pgCtl start"
            # Start without -Wait to avoid hanging if pg_ctl doesn't detach properly
            Start-Process -FilePath $pgCtl -ArgumentList "start -D `"$PG_DATA`"" -NoNewWindow
            
            Write-Info "  Waiting for database to be fully ready (accepting connections)..."
            $maxRetries = 30
            $retryCount = 0
            $pgOk = $false
            
            while ($retryCount -lt $maxRetries) {
                # Check if port is listening first
                $check = netstat -ano | findstr ":5432" | findstr "LISTENING"
                if ($check) {
                    # Try a real connection test
                    $testConn = node -e "const { Client } = require('pg'); const client = new Client({ connectionString: 'postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db' }); client.connect().then(() => { client.end(); process.exit(0); }).catch(() => { process.exit(1); })" 2>$null
                    if ($LASTEXITCODE -eq 0) {
                        $pgOk = $true
                        break
                    }
                }
                Write-Host "." -NoNewline
                Start-Sleep -Seconds 2
                $retryCount++
            }
            Write-Host ""
            
            if ($pgOk) {
                Write-Success "[OK] PostgreSQL is ready and accepting connections"
            } else {
                Write-Error "[X] PostgreSQL detected on port but not accepting connections after 60 seconds"
                Write-Warning "    This might be due to a long recovery process. Check pgsql/logfile.log"
            }
        } catch {
            Write-Error "[X] Error starting PostgreSQL: $_"
        }
    } else {
        Write-Error "[X] PostgreSQL not found at: $PG_BIN"
    }
}

# Step 3: Check Redis
Write-Info ""
Write-Info "[Redis Cache]"
Write-Info "-------------"

$redisCheck = netstat -ano | findstr ":6379" | findstr "LISTENING"
if ($redisCheck) {
    Write-Success "[OK] Already running on port 6379"
} else {
    Write-Warning "[!] Not running (optional, will use fake instance)"
}

# Wait for services
Write-Info ""
Write-Info "Waiting for services to stabilize..."
Start-Sleep -Seconds 5

# Step 4: Seed admin user
Write-Info ""
Write-Info "[Admin User Seeding]"
Write-Info "--------------------"

$seedScript = Join-Path $BACKEND_DIR "seed-admin.js"
if (Test-Path $seedScript) {
    Write-Info "Running seed script..."
    Push-Location $BACKEND_DIR
    $seedOutput = node seed-admin.js 2>&1
    Pop-Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "[OK] Admin user ready"
    } else {
        Write-Warning "[!] Seed script had issues (continuing anyway)"
    }
} else {
    Write-Warning "[!] Seed script not found (skipping)"
}

# Step 5: Start Backend
Write-Info ""
Write-Info "[Backend Server]"
Write-Info "----------------"

$backendRunning = Get-NetTCPConnection -LocalPort 9000 -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Success "[OK] Already running on port 9000"
} else {
    Write-Info "Starting backend server..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BACKEND_DIR'; npm run dev" -WindowStyle Minimized
    Write-Success "[OK] Backend process started"
}

# Step 6: Start Storefront
Write-Info ""
Write-Info "[Storefront]"
Write-Info "------------"

$storefrontRunning = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($storefrontRunning) {
    Write-Success "[OK] Already running on port 3000"
} else {
    Write-Info "Starting storefront..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$STOREFRONT_DIR'; npm run dev" -WindowStyle Minimized
    Write-Success "[OK] Storefront process started"
}

# Wait for everything to initialize
Write-Info ""
Write-Info "Waiting for servers to initialize (60 seconds)..."
Start-Sleep -Seconds 15

# Health check
Write-Info ""
Write-Info "[Health Check]"
Write-Info "--------------"

function Test-Port {
    param([int]$Port, [string]$Name)
    $check = netstat -ano | findstr ":$Port" | findstr "LISTENING"
    if ($check) {
        Write-Success "[OK] $Name (Port $Port)"
        return $true
    } else {
       Write-Error "[X] $Name (Port $Port) - NOT RUNNING"
        return $false
    }
}

$pgOk = Test-Port 5432 "PostgreSQL"
$backendOk = Test-Port 9000 "Backend   "
$storefrontOk = Test-Port 3000 "Storefront"

# Final summary
Write-Info ""
Write-Info "======================================="
if ($pgOk -and $backendOk -and $storefrontOk) {
    Write-Success "   ALL SERVICES RUNNING!"
    Write-Info ""
    Write-Info "Access URLs:"
    Write-Info "   Backend:    http://localhost:9000"
    Write-Info "   Admin:      http://localhost:9000/app"
    Write-Info "   Storefront: http://localhost:3000"
    Write-Info ""
    Write-Info "Default Admin Credentials:"
    Write-Info "   Email:    admin@ola-shop.com"
    Write-Info "   Password: Abc996050@"
} else {
    Write-Error "   SOME SERVICES FAILED TO START"
    Write-Info ""
    Write-Info "Troubleshooting:"
    if (-not $pgOk) { Write-Info "   * Check PostgreSQL logs" }
    if (-not $backendOk) { Write-Info "   * Check backend terminal for errors" }
    if (-not $storefrontOk) { Write-Info "   * Check storefront terminal for errors" }
}

Write-Info "======================================="
Write-Info ""
Write-Info "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
