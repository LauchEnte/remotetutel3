from flask import Flask
from flask_sock import Sock

def start_backend(app: Flask):
    sock = Sock(app)

    @sock.route('/ws/frontend')
    def ws_frontend(ws):
        print('frontend ws')
        return None
    @sock.route('/ws/turtle')
    def ws_turtle(ws):
        print('turtle ws')
        return None