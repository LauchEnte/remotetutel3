import Renderer from './render.tsx'
import Hud from './hud.tsx'

export default function ControlPage({websocket}:{websocket: WebSocket}){
    
    return (
        <>
           <h1>Control Page</h1>
           <Renderer/>
           <Hud/>
        </>
    )
}