Write-Host "Starting eBazer Project Complete Launch..." -ForegroundColor Cyan

# 1. Start Backend (serves Admin Panel too)
Write-Host "Launching Backend..." -ForegroundColor Green
# Using -WorkingDirectory to ensure correct path
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm start" -WorkingDirectory "$PSScriptRoot\backend" -WindowStyle Normal

# Wait for backend to initialize slightly
Start-Sleep -Seconds 3

# 2. Start User Site (Vite)
Write-Host "Launching User Site..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm run dev" -WorkingDirectory "$PSScriptRoot\razia user site\razia-chic-builder-main" -WindowStyle Normal

# Wait for vite to initialize
Start-Sleep -Seconds 4

# 3. Open Pages in Browser
Write-Host "Opening Browsers..." -ForegroundColor Yellow
# Admin Panel (served by backend static)
Start-Process "http://localhost:5000/index.html"
# User Site (Vite default port, usually)
Start-Process "http://localhost:5173"

Write-Host "All systems launched!" -ForegroundColor Cyan
Write-Host "Backend API & Admin Panel: http://localhost:5000"
Write-Host "User Site: http://localhost:5173"
Read-Host "Press Enter to exit this launcher (servers will keep running)..."
