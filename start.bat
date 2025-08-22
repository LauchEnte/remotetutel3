echo starting server
call venv/scripts/activate
echo server running...
echo press CTRL + C TWICE to stop
call python wsgi.py
call deactivate
echo stopped server