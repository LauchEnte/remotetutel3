import React from 'react'
import logo from '/tutel.ico'

export function LoginPage({setWebsocket}: {setWebsocket: (ws: WebSocket | null) => void}){

    const [error, setError] = React.useState<string | null>(null)

    function login(password: string){

        let websocket: WebSocket | null = new WebSocket(`ws://${window.location.hostname}/ws/frontend`)
        
        function kill_everthing(timeout?: number){
            websocket?.close()
            clearTimeout(timeout)
            websocket = null
        }

        //timeout stuff
        const timeout = setTimeout(() => {
            kill_everthing()
            setError('Timeout')
        }, 2000)

        //receive confirmation / denial message
        websocket.onmessage = (e: MessageEvent) => {
            const message = JSON.parse(e.data)
            if (message.type != 'open') {
                setError('Didn\'t receive opening message but something else??')
                kill_everthing(timeout)
            } else if (message.status == 'wrong_password') {
                setError('Wrong password')
                kill_everthing(timeout)
            } else if (message.status == 'success') {
                clearTimeout(timeout)
                websocket!.onmessage = null
                setError(null)
                setWebsocket(websocket)
            }
        }
        
        //send password in opening message
        websocket.onopen = () => {
            websocket?.send(JSON.stringify({type: 'open', password: password}))
        }

        //remove websocket when disconnected
        websocket.onclose = () => {
            setWebsocket(null)
        }

    }


    return (<>
        
            <h1>Remotetutel3 <img src={logo}/> Login</h1>
            <input 
                type='password' 
                placeholder='Password'
                style={{
                    width: '60%',
                    textAlign: 'center',
                    borderRadius: '10px'
                }}
                onKeyDown={(e: any) => {
                    if (e.key == 'Enter') {
                        login(e.target.value)
                    }
                }}
            />
            <p
                style={{
                    color: 'red'
                }}
            >
                {error}
            </p>

    </>)
}