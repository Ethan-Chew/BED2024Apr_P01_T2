@echo off
setlocal

REM Use PowerShell to get the computer name and combine with SQLEXPRESS
for /f "usebackq tokens=*" %%a in (`powershell -Command "Write-Output \"$env:COMPUTERNAME\SQLEXPRESS\""`) do (
    set SERVER_NAME=%%a
)

echo Server Name: %SERVER_NAME%

echo Running createUser.sql
sqlcmd -S %SERVER_NAME% -E -i "createUser.sql"

echo All scripts executed successfully.