import React from 'react'
import { View, MyView } from './RemotetutelPage/view'
import { Hud } from './RemotetutelPage/hud'

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

    constructor(websocket: WebSocket, messageHandler: (ev: MessageEvent) => void){
        this.websocket = websocket
        this.websocket.onmessage = messageHandler
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
    view?: MyView,
    update: () => void
}

//everything that needs to be shared accross components further down
export const SharedContext = React.createContext<shared>(undefined!)

export function RemotetutelPage({websocket}: {websocket: WebSocket}){

    
    const [, forceUpdate] = React.useReducer(o => o, [])
    
    const shared = React.useRef<shared>({
        websocket: new MyWebsocket(websocket, websocketMessageHandler),
        turtles: new Map<string, Turtle>(), //key: id
        turtle: null,
        blocks: new Map<string, Block>(), //key: position as 'x/y/z'
        update: forceUpdate
    }).current
    
    function websocketMessageHandler(e: MessageEvent){
        console.log(e)
    }

    console.log('RemotetutelPage render')

    return (

        <SharedContext value={shared}>
            <View/>
            <Hud/>
        </SharedContext>

    )
}