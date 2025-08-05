import { useState } from 'react'
import LoginPage from './components/login.tsx'
import ControlPage from  './components/control.tsx'
import './App.css'

function App() {
  
  const [websocket, setWebsocket]: [websocket: any, setWebsocket: Function] = useState()
  const [errorMessage, setErrorMessage]: [errorMessage: string, setErrorMessage: Function] = useState('')

  if (websocket instanceof WebSocket){
    return ( 
      <ControlPage 
      websocket={websocket}/>
    )
  } else {
    return (
      <LoginPage 
      setWebsocket={setWebsocket}
      errorStuff={{message: errorMessage, setMessage: setErrorMessage}}/>
    )
  }
}

export default App
