from flask import Flask, send_from_directory
from dotenv import load_dotenv
import os

import backend.websocket
import backend.turtles
import backend.world

load_dotenv()
app = Flask(__name__, static_url_path='', static_folder='frontend/dist')

#Serve index.html
@app.route('/')
@app.route('/index')
def root():
    return app.send_static_file('index.html')

#Serve wget for turtle
@app.route('/startup.lua')
def wget_turtle():
    with open('turtle/startup_template.lua', 'r') as template:
        #Change WEBSOCKET_URL in template
        file = template.read()
        ip = os.getenv('SERVER_IP')
        file = file.replace('WEBSOCKET_URL = \'\'', f'WEBSOCKET_URL = \'{ip}/ws/turtle\'', 1)
        return file

#init websocket in backend
backend.websocket.init_socket(app)

def before_start():
    backend.turtles.load()
    backend.world.load()

def after_start():
    backend.turtles.save()
    backend.world.save()

if __name__ == '__main__':
    before_start()
    app.run(debug=True, host='0.0.0.0', port=80)
    after_start()