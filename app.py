from flask import Flask
from dotenv import load_dotenv
import os

import backend.websocket
import backend.turtles
import backend.blocks
import backend.frontends

load_dotenv()
app = Flask(__name__, static_url_path='', static_folder='frontend/dist')

#Serve index.html
@app.route('/')
@app.route('/index')
def root():
    return app.send_static_file('index.html')

#Serve wget for turtle
@app.route('/startup.lua')
def wget_startup():
    with open('turtle/startup_template.lua', 'r') as template:
        #Change SERVER_URL in template
        file = template.read()
        url = os.getenv('SERVER_URL')
        file = file.replace('SERVER_URL = \'\'', f'SERVER_URL = \'{url}\'', 1)
        return file
    
@app.route('/remotetutel.lua')
def wget_remotetutel():
    with open('turtle/remotetutel_template.lua', 'r') as template:
        #Change SERVER_URL in template
        file = template.read()
        url = os.getenv('SERVER_URL')
        file = file.replace('SERVER_URL = \'\'', f'SERVER_URL = \'{url}\'', 1)
        return file


#Backend (websocket routes)
backend.websocket.route_backend(app, backend.blocks.blocks, backend.turtles.turtles)

#Load stuff into each modules local variables
def before_start():
    backend.turtles.load()
    backend.blocks.load()

#Save stuff from each modules local variables
def after_stop():
    backend.turtles.save()
    backend.blocks.save()

if __name__ == '__main__':
    before_start()
    app.run(host='0.0.0.0', port=80)
    after_stop()