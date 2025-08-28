import React from 'react'
import { SharedContext } from '../RemotetutelPage'
import { Controls } from './hud/controls'
import { Info } from './hud/info'

export function Hud(){

    const shared = React.useContext(SharedContext)
    const turtle = shared.turtle

    console.log('Hud render')

    return (<>
        {turtle ? <Controls/> : null}
        <Info/>
    </>)
}