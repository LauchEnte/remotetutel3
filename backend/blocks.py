import json
from backend.util import Position

blocks = {} #key: 'x/y/z'

class Block:
    def __init__(self, name: str, pos: Position):
        self.name = name
        self.pos = pos


    @staticmethod
    def getKey(x: int, y: int, z: int):
        return f'{x}/{y}/{z}'

def load(path: str = 'saves/blocks.json'):
    global blocks
    try:
        with open(path, 'r') as file:
            blocks_dict: dict = json.load(file)
        for block_dict in blocks_dict.values():
            key = Block.getKey(block_dict['x'], block_dict['y'], block_dict['z'])
            blocks[key] = Block(block_dict['name'], Block(**block_dict['pos']))
        print('Loading turtles save file')
    except FileNotFoundError:
        print('No blocks save file found')

def save(path: str = 'saves/blocks.json'):
    global blocks
    print('Saving blocks')
    blocks_dict = {}
    for block in blocks.values():
        key = Block.getKey(block.pos.x, block.pos.y, block.pos.z)
        pos = {'x': block.pos.x, 'y': block.pos.y, 'z': block.pos.z}
        blocks_dict[key] = {'name': block.name, pos: pos}
    with open(path, 'w') as file:
        json.dump(blocks_dict, file)