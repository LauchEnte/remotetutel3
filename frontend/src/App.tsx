import { useState } from 'react'
import LoginPage from './components/login.tsx'
import ControlPage from  './components/control.tsx'
import './App.css'

function App() {
  
  const [websocket, setWebsocket]: [WebSocket | undefined, Function] = useState()
  const [errorMessage, setErrorMessage]: [string | undefined, Function] = useState()

  if (websocket instanceof WebSocket){
    return ( 
      <ControlPage/>
    )
  } else {
    return (
      <LoginPage
        setWebsocket={setWebsocket}
        errorStuff={{message: errorMessage, setMessage: setErrorMessage}}
      />
    )
  }
}

export default App
