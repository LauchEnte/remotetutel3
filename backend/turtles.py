from typing import Optional, Literal, Dict
import json
import gevent
from flask_sock import ConnectionClosed
from backend.util import Position

turtles: Dict[str, 'Turtle'] = {}

def ws_connection_handler(ws):
    #Registering process
    global turtles
    try:
        opening_message = json.loads(ws.receive())
    except ConnectionClosed:
        print('Some turtle disconnected before ever sending something')
        return
    message_type = opening_message.get('type')
    if message_type != 'open':
        print(f'Wrong message type! Expected: \'open\' Received: \'{message_type}\'')
        return
    id = opening_message.get('id')
    if id == None:
        print('Opening message doesn\'t contain turtle id!')
        return
    turtle = turtles.get(id)
    if not turtle:
        turtle = Turtle(id, ws)
        turtle.status = turtle.get_status()
        turtles[id] = turtle
    else:
        turtle.ws = ws
        turtle.status = turtle.get_status()
    print(f'Registered turtle #{id}')

    #Await disconnect
    while ws.connected:
        gevent.sleep(2)
    print(f'Turtle #{id} disconnected')
    turtle.ws = None
    turtle.status = turtle.get_status()
    return

class Turtle:
    def __init__(self, id: str, ws = None, pos: Position = None):
        self.id = id
        self.ws = ws
        self.pos = pos
        self.status = self.get_status()

    def get_status(self) -> Literal['unknown_position', 'online', 'offline']:
        if self.pos == None:
            return 'unknown_position'
        elif self.ws and self.ws.connected:
            return 'online'
        else:
            return 'offline'
        
    def eval(self, code: str) -> dict:
        self.ws.send(json.dumps({'type': 'eval', 'code': code}))
        response = json.loads(self.ws.receive())
        message_type = response.get('type')
        if message_type != 'evalresponse':
            print(f'Wrong message type! Expected: \'evalresponse\' Received: \'{message_type}\'')
        return response


    def close(self) -> None:
        self.ws.send(json.dumps({'type': 'close'}))
        self.ws = None
        print(f'Closed websocket connection with turtle #{self.id}')

        

def load(path: str = 'saves/turtles.json'):
    global turtles
    try:
        with open(path, 'r') as file:
            turtles_dict: dict = json.load(file)
        for turtle_dict in turtles_dict.values():
            turtles[turtle_dict['id']] = Turtle(turtle_dict['id'], None, turtle_dict.get('pos', False) and Position(**turtle_dict.get('pos')))
        print('Loading turtles save file')
    except FileNotFoundError:
        print('No turtles save file found')

def save(path: str = 'saves/turtles.json'):
    global turtles
    print('Saving turtles')
    turtles_dict = {}
    for turtle in turtles.values():
        id = turtle.id
        if turtle.pos:
            pos = {'x': turtle.pos.x, 'y': turtle.pos.y, 'z': turtle.pos.z, 'dir': turtle.pos.dir}
        else:
            pos = None
        turtles_dict[id] = {'id': id, 'pos': pos}
    with open(path, 'w') as file:
        json.dump(turtles_dict, file)