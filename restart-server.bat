@echo off
echo ========================================
echo Restarting Next.js Development Server
echo ========================================
echo.
echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node processes stopped
) else (
    echo ! No Node processes were running
)
echo.
timeout /t 2 /nobreak >nul
echo Step 2: Starting development server...
echo.
start "Nexora Dev Server" cmd /k "npm run dev"
echo.
echo ✓ Development server is starting in a new window
echo ========================================
echo.
echo IMPORTANT: Wait for "Ready" message in the new window
echo Then test the Explain button again!
echo.
pause
