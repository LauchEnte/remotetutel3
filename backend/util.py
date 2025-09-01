from typing import Optional, Literal

class Position:
    def __init__(self, x: int, y: int, z: int, dir: Optional[Literal[0, 1, 2, 3]]):
        self.x = x
        self.y = y
        self.z = z
        self.dir = dir

    def turn(self, dir: Literal['left', 'right']) -> None:
        if dir == 'right':
            self.dir = (self.dir + 1) % 4
        else:
            self.dir = (self.dir + 3) % 4

    def go(self, dir: Literal['forward', 'back, up, down']) -> None:
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