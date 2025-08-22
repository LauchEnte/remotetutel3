from typing import Optional, Literal, Dict
import json
import gevent
from flask_sock import ConnectionClosed

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
    def __init__(self, id: str, ws = None, x: Optional[int] = None, y: Optional[int] = None, z: Optional[int] = None, dir: Optional[Literal['n', 'e', 's', 'w']] = None):
        self.id = id
        self.ws = ws
        self.x = x
        self.y = y
        self.z = z
        self.dir = dir
        self.status = self.get_status()

    def get_status(self) -> Literal['unknown_position', 'online', 'offline']:
        if None in [self.x, self.y, self.z, self.dir]:
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
    print('Loading turtles save file')
    ...

def save(path: str = 'saves/turtles.json'):
    global turtles
    print('Saving turtles')
    ...