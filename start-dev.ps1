$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $repoRoot "backend"
$condaExe = Join-Path $env:LOCALAPPDATA "anaconda3\Scripts\conda.exe"

if (-not (Test-Path (Join-Path $backendDir "main.py"))) {
    throw "Missing backend/main.py at $backendDir"
}

if (-not (Test-Path (Join-Path $repoRoot "package.json"))) {
    throw "Missing package.json at $repoRoot"
}

if (-not (Test-Path $condaExe)) {
    throw "Conda executable not found at $condaExe"
}

$backendCmd = "Set-Location '$backendDir'; & '$condaExe' run -n n8n-copilot uvicorn main:app --reload --host 127.0.0.1 --port 8000"
$frontendCmd = "Set-Location '$repoRoot'; npm run dev"

Write-Host "Starting CoachAI FastAPI backend (http://127.0.0.1:8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

Write-Host "Starting CoachAI Next.js frontend (http://localhost:3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "Both services launched in separate PowerShell windows." -ForegroundColor Yellow
