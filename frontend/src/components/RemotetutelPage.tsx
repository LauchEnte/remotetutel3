import React from 'react'
import { View, MyView } from './RemotetutelPage/view'
import { Hud, MyHud } from './RemotetutelPage/hud'

export class Position {
    x: number
    y: number
    z: number
    dir?: number

    constructor(x: number, y: number, z: number, dir?: number){
        this.x = x
        this.y = y
        this.z = z
        this.dir = dir
    }

}
export class Turtle {
    id: string
    status: string
    pos: Position

    constructor(id: string, status: string, pos: Position){
        this.id = id
        this.status = status
        this.pos = pos
    }

}
export class Block {
    name: string
    pos: Position

    constructor(name: string, pos: Position){
        this.name = name
        this.pos = pos
    }
}

interface sendableObject extends Record<string, any>{
    type: string
    turtleId: string
}

export class MyWebsocket {
    websocket: WebSocket

    constructor(websocket: WebSocket){
        this.websocket = websocket
    }

    sendFormatted(obj: sendableObject){
        this.websocket.send(JSON.stringify(obj))
    }
}

interface shared {
    websocket: MyWebsocket
    turtles: Map<string, Turtle> //key: id
    turtle: Turtle | null
    blocks: Map<string, Block> //key: pos as 'x/y/z'
    view?: MyView
    hud?: MyHud
}

//everything that needs to be shared accross components further down
export const SharedContext = React.createContext<shared>(undefined!)

export function RemotetutelPage({websocket}: {websocket: WebSocket}){

    const shared = React.useRef<shared>({
        websocket: new MyWebsocket(websocket),
        turtles: new Map<string, Turtle>(), //key: id
        turtle: null,
        blocks: new Map<string, Block>() //key: position as 'x/y/z'
    }).current

    shared.turtles.set('0', new Turtle('0', 'online', new Position(0, 0, 0, 0)))
    shared.turtles.set('1', new Turtle('1', 'offline', new Position(1, 1, 1, 1)))
    shared.turtles.set('2', new Turtle('2', 'online', new Position(2, 2, 2, 2)))

    React.useEffect(() => {
        shared.view?.addTurtle(shared.turtles.get('0')!)
    })

    return (

        <SharedContext value={shared}>
            <View/>
            <Hud/>
        </SharedContext>

    )
}