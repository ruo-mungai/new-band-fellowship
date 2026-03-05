@echo off
echo =====================================
echo NEW BAND FELLOWSHIP API TEST SUITE
echo =====================================
echo.

echo 1. Testing Login...
echo.
powershell -ExecutionPolicy Bypass -File "test-login-clean.ps1"
echo.
echo.
echo 2. Testing Protected Endpoints...
echo.
powershell -ExecutionPolicy Bypass -File "test-protected-clean.ps1"
echo.
echo =====================================
pause