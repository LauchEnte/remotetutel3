from flask import Flask
from flask_sock import Sock
import backend.turtles
import backend.frontends

def start_backend(app: Flask):
    sock = Sock(app)

    @sock.route('/ws/frontend')
    def ws_frontend(ws):
        backend.frontends.ws_connection_handler(ws)
        
    @sock.route('/ws/turtle')
    def ws_turtle(ws):
        backend.turtles.ws_connection_handler(ws)
        