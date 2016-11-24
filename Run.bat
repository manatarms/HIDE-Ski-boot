@echo off
ECHO Checking connection, please wait...
PING -n 1 www.github.com|find "Reply from " >NUL
IF NOT ERRORLEVEL 1 goto :SUCCESS
IF     ERRORLEVEL 1 goto :FAILURE


:SUCCESS
ECHO Updating to latest version
git pull
gulp build-and-server
goto END

:FAILURE
ECHO Using last know version
gulp server-build
goto END

:END