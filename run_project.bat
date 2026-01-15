@echo off
echo Starting eBazer Project...

REM Start Backend
start "eBazer Backend" cmd /k "cd backend && npm install && npm start"

REM Open Frontend
start http://localhost:5000/index.html

echo Project launch initiated.
pause
