import json

blocks = {} #key: 'x/y/z'

class Block:
    def __init__(self, name: str, x: int, y: int, z: int):
        self.name = name
        self.x = x
        self.y = y
        self.z = z

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
            blocks[key] = Block(**block_dict)
        print('Loading turtles save file')
    except FileNotFoundError:
        print('No blocks save file found')

def save(path: str = 'saves/blocks.json'):
    global blocks
    print('Saving blocks')
    blocks_dict = {}
    for block in blocks.values():
        blocks_dict[block.getKey(block.x, block.y, block.z)] = {'name': block.name, 'x': block.x, 'y': block.y, 'z': block.z}
    with open(path, 'w') as file:
        json.dump(blocks_dict, file)