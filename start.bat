@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  py -3 server.py
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    python server.py
  ) else (
    echo Python 3 is required.
    echo Download it from https://www.python.org/downloads/
    pause
    exit /b 1
  )
)

endlocal
