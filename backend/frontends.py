import os
import json

ws_connections = []

def check_password(given_password: str) -> bool:
    actual_password = os.getenv('PASSWORD')
    return given_password == actual_password

def ws_connection_handler(ws):
    global ws_connections
    opening_message = json.loads(ws.receive())
    message_type = opening_message.get('type')
    if message_type != 'open':
        print(f'Wrong message type! Expected: \'open\' Received: \'{message_type}\'')
        return
    given_password = opening_message.get('password')
    if check_password(given_password):
        ws_connections.append(ws)
        ws_message_handler(ws)
    else:
        print(f'Someone entered a wrong password: \'{given_password}\'')
        return
    
def ws_message_handler(ws):
    while True:
        print(json.loads(ws.receive()))