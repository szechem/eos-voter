setlocal
call "%VSINSTALLDIR%\Common7\Tools\VsDevCmd.bat"
rmdir /S /Q "%APPDATA%\npm"

pushd "%~dp0\eos-voter"
git clean -dfx
git pull
git checkout beos
git checkout -- .
pushd eosjs
git checkout master-greymass
git checkout -- .
call npm install
call npm audit fix --force
call npm run build_win32
call npm link
popd 
call npm install -g usb
call npm install
call npm link eosjs
call npm run package-win
popd

endlocal
