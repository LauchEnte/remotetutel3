import React from 'react'
import { View } from './RemotetutelPage/view'

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

}

//everything that needs to be shared accross components further down
export const SharedContext = React.createContext<shared>(undefined!)

export function RemotetutelPage({websocket}: {websocket: WebSocket}){

    

    return (
        <View/>

    )
}