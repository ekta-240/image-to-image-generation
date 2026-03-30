@echo off
title Homelytics Local GPU Backend
color 0A

echo ================================================
echo    🏠 HOMELYTICS LOCAL GPU BACKEND
echo ================================================
echo.
echo 🎮 Using your RTX 3050 GPU
echo 📍 Backend will run on: http://localhost:5000
echo.
echo ⚠️  IMPORTANT SETUP STEPS:
echo.
echo 1. Get your Hugging Face token from:
echo    https://huggingface.co/settings/tokens
echo.
echo 2. The backend will ask for it when starting
echo.
echo 3. Make sure your frontend is updated to use localhost:5000
echo.
echo ================================================
echo.
pause

cd /d "%~dp0backend"

echo.
echo 🚀 Starting backend...
echo.
set FLOORPLAN_LORA_ID=./backend/loras/floorplan.safetensors
python app.py

pause
