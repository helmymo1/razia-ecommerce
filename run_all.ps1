# Stop existing processes
$ports = @(5000, 5173)
foreach ($port in $ports) {
    if (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue) {
        Write-Host "Stopping process on port $port..." -ForegroundColor Yellow
        Get-NetTCPConnection -LocalPort $port | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    }
}

# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Minimized

# Start User Site
Write-Host "Starting User Site..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'razia user site/razia-chic-builder-main'; npm run dev" -WindowStyle Minimized

# Open Admin Panel
Write-Host "Opening Admin Panel..." -ForegroundColor Green
Start-Process "http://localhost:5000/"

# Open User Site (wait a bit for vite to start)
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"

Write-Host "All components started." -ForegroundColor Cyan
