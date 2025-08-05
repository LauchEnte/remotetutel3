export function connect(setWebsocket: any, password: string, errorStuff?: {error: string, setError: Function}){
    
    let ws = new WebSocket(`ws://localhost/ws/frontend`)

    function validate_connection(e: MessageEvent){
        const msg = JSON.parse(e.data)
        if (msg.type == 'open' && msg.status == 'success'){
            setWebsocket(ws)
            clearTimeout(timeout_check)
        } else if (msg.type =='open' && msg.status == 'wrong_password'){
            errorStuff?.setError('You entered the wrong password dumbass!')
            ws.close()
        } else {
            errorStuff?.setError('Something wen\'t wrong, and if I knew what I wouldn\'t say \'Something\'.')
            ws.close()
        }
        ws.onmessage = null
    }

    let timeout_check = setTimeout(() => {
        errorStuff?.setError('Timeout! (ig the server is down?)') 
    }, 2000)
    ws.onmessage = validate_connection
    ws.onopen = () => {ws.send(JSON.stringify({type: 'open', password: password}))}
    ws.onclose = () => {
        setWebsocket(undefined)
    }

}