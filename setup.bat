@echo off

echo Installing NPM Dependencies
CALL npm install -y

echo Creating MSSQL User
cd ./db_config
CALL ./createUser.bat

echo Creating MSSQL Database
CALL ./run_all.bat

echo Project has been fully initialised