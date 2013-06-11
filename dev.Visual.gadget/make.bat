@echo off
: mydir is the directory where the batch file is stored
set mydir=%~dp0

set GadgetName=Visual.gadget
set signtool="C:\Program Files (x86)\Microsoft SDKs\Windows\v7.0A\Bin\signtool.exe"
set cabarc="%mydir%\cabarc.exe"

set publishdir=%temp%

rem signtool is part of the Visual Studio tools
IF NOT EXIST %signtool% GOTO SignToolNotFound

rem cabarc is part of the windows sdk download from microsoft
IF NOT EXIST %cabarc% GOTO CabToolNotFound

rem ** remove/create a fresh gadget folder and remove the .gadget file
rd "%publishdir%\%GadgetName%\" /s /q
md "%publishdir%\%GadgetName%\"

rem ** copy all of the files into test area
xcopy . "%publishdir%\%GadgetName%\" /y /s /q /EXCLUDE:exclude.txt

cd "%publishdir%\%GadgetName%\"
%cabarc% -r -p n "%mydir%\%GadgetName%" *

rem ** if you want to digitally sign the gadget, put your certificate in the folder, called 
rem ** sign.pfx, and uncomment the next line, modifying the password appropriately
rem %signtool% sign /f "%mydir%\sign.pfx" /p secretPassword "%mydir%%GadgetName%"

rd "%publishdir%\%GadgetName%\" /s /q


rem ** uncomment the following to automatically try to install the new gadget
rem "%mydir%\%GadgetName%"

echo The gadget file is "%mydir%\%GadgetName%"

GOTO Exit

:SignToolNotFound
ECHO ERROR: Tool %signtool% not found"
GOTO Exit

:CabToolNotFound
ECHO ERROR: Tool %cabarc% not found"
GOTO Exit

:Exit
cd %mydir%
pause