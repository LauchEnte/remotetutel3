import React from 'react'
import {LoginPage} from './components/LoginPage.tsx'
import {RemotetutelPage} from './components/RemotetutelPage.tsx'
import './App.css'

export default function App(){

    const [websocket, setWebsocket] = React.useState<WebSocket | null>(null)

    if (websocket instanceof WebSocket) {
        return <RemotetutelPage websocket={websocket}/>
    } else {
        return <LoginPage setWebsocket={setWebsocket}/>
    }

}