import tutel from '/tutel.ico'

function connectWebsocket(setWebsocket: Function, password: string, errorStuff?: {message?: string, setMessage: Function}){
    
    let errorSet = false
    let wasOpen = false

    let ws = new WebSocket(`ws://${window.location.hostname}/ws/frontend`)

    function validate_connection(e: MessageEvent){
        const msg = JSON.parse(e.data)
        if (msg.type == 'open' && msg.status == 'success'){
            wasOpen = true
            setWebsocket(ws)
            errorStuff?.setMessage(undefined)
            errorSet = false
        } else if (msg.type =='open' && msg.status == 'wrong_password'){
            errorStuff?.setMessage('You entered the wrong password dumbass')
            errorSet = true
            ws.close()
        } else {
            errorStuff?.setMessage('Something wen\'t wrong, and if I knew what I wouldn\'t say \'Something\'')
            errorSet = true
            ws.close()
        }
        clearTimeout(timeout_check)
        ws.onmessage = null
    }

    let timeout_check = setTimeout(() => {
        errorStuff?.setMessage('Timeout (ig the server is down?)')
        errorSet = true
    }, 2000)
    ws.onmessage = validate_connection
    ws.onopen = () => {
        wasOpen = true
        ws.send(JSON.stringify({type: 'open', password: password}))
    }
    ws.onclose = () => {
        setWebsocket(undefined)
        if (wasOpen && !errorSet) errorStuff?.setMessage('Disconnected (ig the server died?)')
    }

}

export default function LoginPage({setWebsocket, errorStuff} : {setWebsocket: any, errorStuff?: {message?: string, setMessage: Function}}){
    
    function onSubmit(e: any){
        const password = e.target.value
        connectWebsocket(setWebsocket, password, errorStuff)
    }
    
    
    return (
        <>
            <h1>Remotetutel3 <img src={tutel} alt=""/> Login</h1>
            <input 
                placeholder="Password"
                type="Password"
                onKeyDown={e => {if (e.key == 'Enter'){onSubmit(e)}}}
                style={{
                    textAlign: "center",
                    width: "60%"
                }}
            />
            <p
                style={{
                    color: "red"
                }}
            >
                {errorStuff?.message}
            </p>
        </>
        
    )
}