import Renderer from './renderer.tsx'

export default function ControlPage({websocket}:{websocket: WebSocket}){
    
    return (
        <>
           <h1>Control Page</h1>
           <Renderer/>
        </>
    )
}