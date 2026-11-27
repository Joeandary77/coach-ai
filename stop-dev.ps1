$ErrorActionPreference = "Stop"

$ports = @(8000, 3000)

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

    if (-not $connections) {
        Write-Host "No active listener found on port $port." -ForegroundColor DarkGray
        continue
    }

    $processIds = $connections |
        Select-Object -ExpandProperty OwningProcess -Unique |
        Where-Object { $_ -and $_ -ne 0 }

    foreach ($processId in $processIds) {
        $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if (-not $proc) {
            continue
        }

        if ($proc.ProcessName -in @("python", "python3", "uvicorn", "node")) {
            Write-Host "Stopping $($proc.ProcessName) (PID $processId) on port $port..." -ForegroundColor Yellow
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        } else {
            Write-Host "Skipping PID $processId ($($proc.ProcessName)) on port $port (not a dev runtime)." -ForegroundColor Cyan
        }
    }
}

Write-Host "CoachAI local dev shutdown check complete." -ForegroundColor Green
