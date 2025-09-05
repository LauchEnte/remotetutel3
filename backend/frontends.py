import os
import json
from flask_sock import ConnectionClosed
from backend.blocks import Block
from backend.turtles import Turtle

ws_clients = []

def check_password(given_password: str) -> bool:
    actual_password = os.getenv('PASSWORD')
    return given_password == actual_password

def ws_connection_handler(ws, blocks: dict[str, Block], turtles: dict[str, Turtle]):
    global ws_clients

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
        ws_clients.append(ws)
        print('Someone connected with the correct password')
        try:
            ws_message_handler(ws, blocks, turtles)
        except ConnectionClosed:
            print('Some frontend client disconnected')
            ws_clients.remove(ws)
    else:
        ws.send(json.dumps({'type': 'open', 'status': 'wrong_password'}))
        print(f'Someone entered a wrong password: \'{given_password}\'')
        return
    
def check_message_format(message: dict):
    if not message.get('type', False):
        return False
    return True

def turtles_to_dict(turtles: dict[str, Turtle]):
    return {k: {'id': t.id, 'x': t.x, 'y': t.y, 'z': t.z, 'dir': t.dir, 'status': t.status} for k, t in turtles.items()}
def blocks_to_dict(blocks: dict[str, Block]):
    return {k: {'x': b.x, 'y': b.y, 'z': b.z, 'name': b.name} for k, b in blocks.items()}

def ws_message_handler(ws, blocks: dict[str, Block], turtles: dict[str, Turtle]):
    while ws.connected:
        message = json.loads(ws.receive())
        if not check_message_format(message): continue

        match message['type']:
            case 'getAll':
                ws.send(json.dumps({'type': 'blocks', 'blocks': blocks_to_dict(blocks)}))
                ws.send(json.dumps({'type': 'turtles', 'turtles': turtles_to_dict(turtles)}))