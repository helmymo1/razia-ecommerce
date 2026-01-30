# Stop existing processes
$ports = @(5000, 5173, 5174)
foreach ($port in $ports) {
    if (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue) {
        Write-Host "Stopping process on port $port..." -ForegroundColor Yellow
        Get-NetTCPConnection -LocalPort $port | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    }
}

# Start Backend (Port 5000)
Write-Host "Starting Backend (Port 5000)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Minimized

# Start User Site (Port 5173)
Write-Host "Starting User Site (Port 5173)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'razia user site/razia-chic-builder-main'; npm run dev" -WindowStyle Minimized

# Start Admin Panel (Port 5174)
Write-Host "Starting Admin Panel (Port 5174)..." -ForegroundColor Green
# Using -- --port 5174 to pass the argument to Vite
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd razia-store-admin-panel; npm run dev -- --port 5174" -WindowStyle Minimized

# Open URLs
Write-Host "Opening Browsers..." -ForegroundColor Cyan
Start-Sleep -Seconds 5 
Start-Process "http://localhost:5000/"
Start-Process "http://localhost:5173/"
Start-Process "http://localhost:5174/"

Write-Host "All components started." -ForegroundColor Cyan
