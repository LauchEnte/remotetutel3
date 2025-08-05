import os
import json
from flask_sock import ConnectionClosed

ws_connections = []

def check_password(given_password: str) -> bool:
    actual_password = os.getenv('PASSWORD')
    return given_password == actual_password

def ws_connection_handler(ws):
    global ws_connections
    try:
        opening_message = json.loads(ws.receive())
    except ConnectionClosed:
        print('Someone disconnected before ever sending something')
        return
    message_type = opening_message.get('type')
    if message_type != 'open':
        print(f'Wrong message type! Expected: \'open\' Received: \'{message_type}\'')
        return
    given_password = opening_message.get('password')
    if check_password(given_password):
        ws.send(json.dumps({'type': 'open', 'status': 'success'}))
        ws_connections.append(ws)
        print('Someone connected with the correct password')
        try:
            ws_message_handler(ws)
        except ConnectionClosed:
            print('Some frontend client disconnected')
            ws_connections.remove(ws)
    else:
        ws.send(json.dumps({'type': 'open', 'status': 'wrong_password'}))
        print(f'Someone entered a wrong password: \'{given_password}\'')
        return
    
def ws_message_handler(ws):
    while ws.connected:
        print(json.loads(ws.receive()))