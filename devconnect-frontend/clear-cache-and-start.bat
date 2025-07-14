@echo off
echo Clearing Vite cache...

REM Navigate to project directory
cd /d "%~dp0"

REM Stop any running dev servers
echo Stopping any running processes...
taskkill /f /im node.exe 2>nul

REM Clear various cache directories
echo Clearing cache directories...
if exist "node_modules\.vite-cache" rmdir /s /q "node_modules\.vite-cache"
if exist ".vite" rmdir /s /q ".vite"
if exist "dist" rmdir /s /q "dist"

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force

echo Cache cleared successfully!
echo.
echo Starting development server...
npm run dev

pause
