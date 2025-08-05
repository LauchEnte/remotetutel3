import {useState} from 'react'
import {connect} from './websocket.ts'
import tutel from '/tutel.ico'

export default function LoginPage({setWebsocket} : {setWebsocket: any}){
    
    const [loginError, setLoginError] = useState('')
    
    function onSubmit(e: any){
        const password = e.target.value
        connect(setWebsocket, password, {error: loginError, setError: setLoginError})
    }
    
    return (
        <>
            <h1>Remotetutel3 <img src={tutel} /> Login</h1>
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
                {loginError}
            </p>
        </>
        
    )
}