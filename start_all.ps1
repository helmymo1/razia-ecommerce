Write-Host "Starting eBazer Project Components..." -ForegroundColor Cyan

# Start Backend
Write-Host "Launching Backend..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm install; npm start" -WindowStyle Normal

# Start User Site
Write-Host "Launching User Site..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'razia user site/razia-chic-builder-main'; npm install; npm run dev" -WindowStyle Normal

# Start Admin Panel
Write-Host "Launching Admin Panel..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd razia-store-admin-panel; npm install; npm run dev" -WindowStyle Normal

Write-Host "All components launched in separate windows." -ForegroundColor Cyan
Write-Host "Press Enter to exit this launcher..."
Read-Host
