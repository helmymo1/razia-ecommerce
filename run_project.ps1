Write-Host "Starting eBazer Project..." -ForegroundColor Green

# Start Backend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm install; npm start" -WindowStyle Normal

# Start User Site
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'razia user site/razia-chic-builder-main'; npm install; npm run dev" -WindowStyle Normal

# Open Frontend (Admin)
Start-Process "eBazer/index.html"

Write-Host "Project launch initiated." -ForegroundColor Green
Read-Host "Press Enter to exit..."
