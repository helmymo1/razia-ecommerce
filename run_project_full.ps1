# Stop existing processes
$ports = @(5000, 3001, 5173)
foreach ($port in $ports) {
    if (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue) {
        Write-Host "Stopping process on port $port..." -ForegroundColor Yellow
        Get-NetTCPConnection -LocalPort $port | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    }
}

# Start Backend
Write-Host "Starting Backend (Port 5000)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Minimized

# Start Admin Panel
Write-Host "Starting Admin Panel (Port 3001)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd razia-store-admin-panel; npm run dev" -WindowStyle Minimized

# Start User Site
Write-Host "Starting User Site (Port 5173)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'razia user site/razia-chic-builder-main'; npm run dev" -WindowStyle Minimized

# Wait for servers to spin up
Start-Sleep -Seconds 5

# Open URLs
Start-Process "http://localhost:5173"
Start-Process "http://localhost:3001"

Write-Host "All components started." -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000"
Write-Host "User Site: http://localhost:5173"
Write-Host "Admin Panel: http://localhost:3001"
