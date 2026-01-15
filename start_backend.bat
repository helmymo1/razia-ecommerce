@echo off
echo Starting eBazer Backend...
cd backend
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Could not find backend directory.
    pause
    exit /b
)

echo Running npm install...
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo Error: npm install failed.
    pause
    exit /b
)

echo Starting server...
call npm start
pause
