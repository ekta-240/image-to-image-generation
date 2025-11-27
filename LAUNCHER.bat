@echo off
title Homelytics - All-in-One Launcher
color 0A

:menu
cls
echo.
echo ============================================
echo      HOMELYTICS - Room Design Platform
echo ============================================
echo.
echo Please select an option:
echo.
echo  [1] First Time Setup (Install Everything)
echo  [2] Start Frontend Only
echo  [3] Start Backend Only
echo  [4] Start Both (Frontend + Backend)
echo  [5] Check System Requirements
echo  [6] View Documentation
echo  [7] Exit
echo.
echo ============================================
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto backend
if "%choice%"=="4" goto both
if "%choice%"=="5" goto requirements
if "%choice%"=="6" goto docs
if "%choice%"=="7" goto end
goto menu

:setup
cls
echo ============================================
echo Running First Time Setup...
echo ============================================
call setup.bat
echo.
echo Setup Complete! Press any key to return to menu...
pause >nul
goto menu

:frontend
cls
echo ============================================
echo Starting Frontend...
echo Will open at http://localhost:3000
echo ============================================
echo.
start cmd /k "title Homelytics Frontend && npm run dev"
echo.
echo Frontend started in a new window!
echo Press any key to return to menu...
pause >nul
goto menu

:backend
cls
echo ============================================
echo Starting Backend...
echo API available at http://localhost:5000
echo ============================================
echo.
start cmd /k "title Homelytics Backend && cd backend && venv\Scripts\activate && python app.py"
echo.
echo Backend started in a new window!
echo Press any key to return to menu...
pause >nul
goto menu

:both
cls
echo ============================================
echo Starting Both Frontend and Backend...
echo ============================================
echo.
echo Starting Backend...
start cmd /k "title Homelytics Backend && cd backend && venv\Scripts\activate && python app.py"
timeout /t 2 >nul
echo.
echo Starting Frontend...
start cmd /k "title Homelytics Frontend && npm run dev"
timeout /t 2 >nul
echo.
echo ============================================
echo Both servers started!
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo ============================================
echo.
echo Press any key to return to menu...
pause >nul
goto menu

:requirements
cls
echo ============================================
echo System Requirements Check
echo ============================================
echo.
echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo [X] Node.js NOT found! Please install Node.js 18+
) else (
    echo [✓] Node.js found!
)
echo.
echo Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo [X] npm NOT found!
) else (
    echo [✓] npm found!
)
echo.
echo Checking Python...
python --version
if %errorlevel% neq 0 (
    echo [X] Python NOT found! Please install Python 3.8+
) else (
    echo [✓] Python found!
)
echo.
echo Checking pip...
pip --version
if %errorlevel% neq 0 (
    echo [X] pip NOT found!
) else (
    echo [✓] pip found!
)
echo.
echo ============================================
echo.
echo Press any key to return to menu...
pause >nul
goto menu

:docs
cls
echo ============================================
echo Documentation Files
echo ============================================
echo.
echo Opening documentation files...
echo.
start README.md
start QUICKSTART.md
start DOCUMENTATION.md
start PROJECT_SUMMARY.md
echo.
echo Documentation opened!
echo Press any key to return to menu...
pause >nul
goto menu

:end
cls
echo.
echo ============================================
echo Thank you for using Homelytics!
echo ============================================
echo.
exit
