@echo off
REM Setup script for Restaurant POS System on Windows

echo Setting up Restaurant POS System...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.9 or later.
    exit /b 1
)

REM Setup backend
echo Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate

REM Install Python dependencies
pip install -r requirements.txt

REM Go back to root
cd ..

REM Check if Node.js/npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not installed. Please install Node.js and npm.
    exit /b 1
)

REM Setup frontend
echo Setting up frontend...
npm install

echo Setup complete!
echo.
echo To run the application:
echo 1. Start the backend: cd backend && call venv\Scripts\activate && python app.py
echo 2. In a new terminal, start the frontend: npm run dev
echo.
echo Or use Docker: docker-compose up

pause