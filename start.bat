@echo off

if not exist node_modules goto install

npm start
pause
exit

:install
echo Starting installation process
npm run build