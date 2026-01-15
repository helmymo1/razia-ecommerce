Write-Host "Starting eBazer Project..." -ForegroundColor Green

# Start Backend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm install; npm start" -WindowStyle Normal

# Open Frontend
Start-Process "eBazer/index.html"

Write-Host "Project launch initiated." -ForegroundColor Green
Read-Host "Press Enter to exit..."
