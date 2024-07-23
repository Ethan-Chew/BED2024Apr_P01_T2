@echo off
setlocal

REM Use PowerShell to get the computer name and combine with SQLEXPRESS
for /f "usebackq tokens=*" %%a in (`powershell -Command "Write-Output \"$env:COMPUTERNAME\SQLEXPRESS\""`) do (
    set SERVER_NAME=%%a
)

echo Server Name: %SERVER_NAME%

echo Running DropCreateTable.sql
sqlcmd -S %SERVER_NAME% -E -i "DropCreateTable.sql"

echo Running createtables.sql
sqlcmd -S %SERVER_NAME% -E -i "createtables.sql"

echo Running adddata.sql
sqlcmd -S %SERVER_NAME% -E -i "adddata.sql"

echo All scripts executed successfully.