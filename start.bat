@echo off
start cmd /k "node server.js"
timeout /t 2 >nul
start "" "index.html"
exit
