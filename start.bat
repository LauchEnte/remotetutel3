echo starting server
call venv/scripts/activate
echo server running...
echo press CTRL + C TWICE to stop
call python prod.py
call deactivate
echo stopped server
pause