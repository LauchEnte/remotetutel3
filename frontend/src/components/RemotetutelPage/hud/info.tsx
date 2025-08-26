import React from 'react'
import { SharedContext } from '../../RemotetutelPage'

export function Info(){

    const shared = React.useContext(SharedContext)
    const turtles = shared.turtles
    const turtle = shared.turtle

    return (
        <div
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                minWidth: '10svw',
                textAlign: 'left'
            }}
        >
            <select
                style={{
                    width: '100%'
                }}
                onChange={(e: any) => {
                    shared.turtle = turtles.get(e.target.value)!
                    shared.view!.setTargetTurtle(shared.turtle)
                    shared.hud!.update()
                }}
            >
                {[<option disabled={turtle != null} key=''>-- select a Tutel --</option>].concat(
                    Array.from(turtles.entries()).map(([id, turtle]) => {
                        return <option key={id} value={id}>#{id}: {turtle.status}</option>
                    }))
                }
            </select>
            {turtle ? 
            <p
                style={{
                    fontSize: 'small',
                    margin: 0
                }}
            >
                🌎 {turtle.pos.x} {turtle.pos.y} {turtle.pos.z} {['north', 'east', 'south', 'west'][turtle.pos.dir!]}
            </p> 
            : null}
        </div>
    )
}