from flask import Flask
from flask_sock import Sock

def init_socket(app: Flask):
    sock = Sock(app)

    @sock.route('/ws/frontend')
    def ws_frontend(ws):
        print('frontend ws')
        return None
    @sock.route('/ws/turtle')
    def ws_turtle(ws):
        print('turtle ws')
        return None