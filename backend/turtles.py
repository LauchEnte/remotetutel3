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
    def __init__(self, id: str, x: Optional[int] = None, y: Optional[int] = None, z: Optional[int] = None, dir: Optional[Literal[0, 1, 2, 3]] = None, ws = None):
        self.id = id
        self.ws = ws
        self.x = x
        self.y = y
        self.z = z
        self.dir = dir
        self.status = self.get_status()

    def turn1math(self, dir: Literal['left', 'right']) -> None:
        if dir == 'right':
            self.dir = (self.dir + 1) % 4
        else:
            self.dir = (self.dir + 3) % 4

    def go1math(self, dir: Literal['forward', 'back, up, down']) -> None:
        match dir:
            case 'up':
                self.y += 1
            case 'down':
                self.y -= 1
            case 'forward':
                match self.dir:
                    case 0:
                        self.z -= 1
                    case 1:
                        self.x += 1
                    case 2:
                        self.z += 1
                    case 3:
                        self.x -= 1
            case 'back':
                match self.dir:
                    case 0:
                        self.z += 1
                    case 1:
                        self.x -= 1
                    case 2:
                        self.z -= 1
                    case 3:
                        self.x += 1

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
    try:
        with open(path, 'r') as file:
            turtles_dict: dict = json.load(file)
        for turtle_dict in turtles_dict.values():
            turtles[turtle_dict['id']] = Turtle(**turtle_dict)
        print('Loading turtles save file')
    except FileNotFoundError:
        print('No turtles save file found')

def save(path: str = 'saves/turtles.json'):
    global turtles
    print('Saving turtles')
    turtles_dict = {}
    for turtle in turtles.values():
        turtles_dict[turtle.id] = {'id': turtle.id, 'x': turtle.x, 'y': turtle.y, 'z': turtle.z, 'dir': turtle.dir}
    with open(path, 'w') as file:
        json.dump(turtles_dict, file)