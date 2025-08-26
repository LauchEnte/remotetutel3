import React from 'react'
import { SharedContext } from '../RemotetutelPage'
import { Controls } from './hud/controls'
import { Info } from './hud/info'

export class MyHud{
    private forceUpdate: React.ActionDispatch<[]>

    constructor(forceUpdate: React.ActionDispatch<[]>){
        this.forceUpdate = forceUpdate
    }

    update(){
        this.forceUpdate()
    }
}

export function Hud(){

    const shared = React.useContext(SharedContext)
    const turtle = shared.turtle

    const [, forceUpdate] = React.useReducer(o => !o, false)
    shared.hud = new MyHud(forceUpdate)

    return (<>
        {turtle ? <Controls/> : null}
        <Info/>
    </>)
}