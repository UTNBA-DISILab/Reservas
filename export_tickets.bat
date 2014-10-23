@echo off
call config.bat

IF NOT EXIST %TICKET_DEST% GOTO create
rmdir %TICKET_DEST% /s /q

:create
md %TICKET_DEST%
XCOPY %cd%\tickets %TICKET_DEST% /s /i /y
@echo on

pause
echo done!
