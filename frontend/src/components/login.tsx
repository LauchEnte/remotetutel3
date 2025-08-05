import {connect} from './websocket.ts'
import tutel from '/tutel.ico'

export default function LoginPage({setWebsocket, errorStuff} : {setWebsocket: any, errorStuff?: {message?: string, setMessage: Function}}){
    
    function onSubmit(e: any){
        const password = e.target.value
        connect(setWebsocket, password, errorStuff)
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