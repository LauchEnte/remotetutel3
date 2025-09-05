from flask import Flask
from flask_sock import Sock
import backend.turtles
import backend.frontends
from backend.turtles import Turtle
from backend.blocks import Block

def route_backend(app: Flask, blocks: dict[str, Block], turtles: dict[str, Turtle]):
    sock = Sock(app)
    
    @sock.route('/ws/frontend')
    def ws_frontend(ws):
        backend.frontends.ws_connection_handler(ws, blocks, turtles)
        
    @sock.route('/ws/turtle')
    def ws_turtle(ws):
        backend.turtles.ws_connection_handler(ws, blocks)
        