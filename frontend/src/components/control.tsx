import Renderer from './render.tsx'
import Hud from './hud.tsx'
import {useRef} from 'react'


export default function ControlPage({websocket}: {websocket?: WebSocket}){
    
    
    const rendererRef = useRef(undefined)
    const hudRef = useRef(undefined)
    
    function webSocketHandler(event: MessageEvent){
        
    }

    if (websocket) websocket.onmessage = webSocketHandler

    return (
        <>
           <Hud
                ref={hudRef}
           />
            <Renderer 
                ref={rendererRef}
            />
        </>
    )
}