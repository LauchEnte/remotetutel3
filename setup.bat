cd frontend
echo installing node dependencies
call npm install
echo building frontend
call npm run build
cd ..
echo creating python virtual environment
call python -m venv venv
call venv/scripts/activate
echo installing python dependencies
call pip install -r requirements.txt
call deactivate
echo setup done
pause