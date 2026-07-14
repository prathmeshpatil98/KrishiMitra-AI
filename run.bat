@echo off
:: =====================================================================
:: KrishiMitra AI Platform Launcher (Local Non-Docker Mode)
:: =====================================================================

title KrishiMitra AI Control Panel
color 0A

echo =====================================================================
echo  _  __      _     _     _ __  __ _ _             _    ___ 
echo ^| ^|/ /     (_)   ^| ^|   (_)  \/  (_) ^|           ^| ^|  ^|_ _^|
echo ^| ' / _ __ _ ___ ^| ^|__  _^| \  / ^| _^| ^|_ _ __ __ _ ^| ^|__ ^| ^| 
echo ^|  ^< ^| '__^| ^| __^| '_ \^| ^| ^|\/^| ^| ^| __^| '__/ _` ^|^| '_ \^| ^| 
echo ^| . \^| ^|  ^| ^|__^| ^| ^| ^| ^| ^|  ^| ^| ^| ^|_^| ^| ^| (_^| ^|^| ^|_) ^| ^| 
echo ^|_^|\_\_^|  ^|_^|___^|_^| ^|_^|_^|_^|  ^|_^|_^|\__^|_^|  \__,_^(_^)_.__/___^|
echo.
echo                    AI-POWERED FARMING INTELLIGENCE
echo =====================================================================
echo.
echo [IMPORTANT] Prerequisites:
echo 1. Ensure PostgreSQL is running locally (default: localhost:5432).
echo 2. Ensure Redis is running locally (default: localhost:6379).
echo 3. Configure your local configuration inside 'backend/.env'.
echo.
echo Press any key to launch KrishiMitra AI services...
pause > nul

echo.
echo ---------------------------------------------------------------------
echo [1/2] Launching Backend FastAPI Service...
echo ---------------------------------------------------------------------
start "KrishiMitra Backend" cmd /k "cd backend && (if exist venv\Scripts\activate.bat (echo Activating virtual environment... && call venv\Scripts\activate.bat)) && python main.py"

echo.
echo ---------------------------------------------------------------------
echo [2/2] Launching Frontend Vite React Service...
echo ---------------------------------------------------------------------
start "KrishiMitra Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =====================================================================
echo Services launched successfully!
echo.
echo Backend API Gateway  : http://localhost:8000
echo Frontend Dashboard   : http://localhost:5173
echo =====================================================================
echo.
echo Keep this window open or press any key to close this control panel...
pause > nul
