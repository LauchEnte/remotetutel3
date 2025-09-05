import React from 'react'
import { View, MyView } from './RemotetutelPage/view'
import { Hud } from './RemotetutelPage/hud'

export class Turtle {
    id: string
    status: string
    x?: number
    y?: number
    z?: number
    dir?: number

    constructor(id: string, status: string, x?: number, y?: number, z?: number, dir?: number){
        this.id = id
        this.status = status
        this.x = x
        this.y = y
        this.z = z
        this.dir = dir
    }

}
export class Block {
    name: string
    x?: number
    y?: number
    z?: number

    constructor(name: string, x: number, y: number, z: number){
        this.name = name
        this.x = x
        this.y = y
        this.z = z
    }
}

interface sendableObject extends Record<string, any>{
    type: string
    turtleId?: string
}

interface receiveableObject extends Record<string, any>{
    type: string
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
    
    const [updater, forceUpdate] = React.useReducer(o => o + 1, 0)
    
    const shared = React.useRef<shared>({
        websocket: new MyWebsocket(websocket, (event) => {websocketMessageHandler(shared, JSON.parse(event.data))}),
        turtles: new Map<string, Turtle>(), //key: id
        turtle: null,
        blocks: new Map<string, Block>(), //key: position as 'x/y/z'
        update: forceUpdate
    }).current
    
    //only run at the very first rerender
    React.useEffect(() => {
        shared.websocket.sendFormatted({type: 'getAll'})
    }, [])
    
    function websocketMessageHandler(shared: shared, message: receiveableObject){
        switch (message.type){
            case 'blocks':
                Object.entries(message.blocks).forEach(([key, value]) => {
                    const b = value as {name: string, x: number, y: number, z: number}
                    const block = new Block(b.name, b.x, b.y, b.z)
                    shared.blocks.set(key, block)
                    shared.view!.addBlock(block)
                })
                break
            case 'turtles':
                Object.entries(message.turtles).forEach(([key, value]) => {
                    const t = value as {id: string, x?: number, y?: number, z?: number, dir?: number, status: string}
                    const turtle = new Turtle(t.id, t.status, t.x, t.y, t.z, t.dir)
                    shared.turtles.set(key, turtle)
                    shared.view?.addTurtle(turtle)
                    if (turtle.id == shared.turtle?.id){
                        shared.turtle = turtle
                        shared.view?.setTargetTurtle(turtle)
                    }
                    forceUpdate()
                })
        }
    }

    console.log('RemotetutelPage render', updater)

    return (

        <SharedContext value={shared}>
            <View/>
            <Hud/>
        </SharedContext>

    )
}