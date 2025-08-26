import React from 'react'
import { SharedContext } from '../../RemotetutelPage'

function ImgButton({src, onClick}: {src: string, onClick: () => void}){
    return (
        <img
            src={src}
            onClick={onClick}
            style={{
                width: '60%',
                height: '60%'
            }}
        />
    )
}

interface sendArgs extends Record<string, any> {
    type: string
}

export function Controls(){

    const shared = React.useContext(SharedContext)
    const turtle = shared.turtle!

    function send(args: sendArgs){
        shared.websocket.sendFormatted({turtleId: turtle.id, ...args})
    }

    return (
        <div
            style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1fr 1fr 1fr',
                alignItems: 'center',
                justifyItems: 'center',
                height: '33svh',
                aspectRatio: 1
            }}
        >
            <ImgButton src='src/assets/left_click_icon.png' onClick={() => {send({type: 'dig', dir: shared.view!.getCameraPitch(3)})}}/>
            <ImgButton src='src/assets/forward_icon.png' onClick={() => {send({type: 'forward'})}}/>
            <ImgButton src='src/assets/right_click_icon.png' onClick={() => {send({type: 'place', dir: shared.view!.getCameraPitch(3)})}}/>
            
            <ImgButton src='src/assets/left_icon.png' onClick={() => {send({type: 'left'})}}/>
            <ImgButton src='src/assets/vertical_icon.png' onClick={() => {send({type: shared.view!.getCameraPitch(2) == 'up' ? 'up' : 'down'})}}/>
            <ImgButton src='src/assets/right_icon.png' onClick={() => {send({type: 'right'})}}/>

            <ImgButton src='src/assets/inventory_icon.png' onClick={() => {console.log('inventory', shared.view!.getCameraPitch(3))}}/>
            <ImgButton src='src/assets/back_icon.png' onClick={() => {send({type: 'back'})}}/>
            <ImgButton src='src/assets/suck_icon.png' onClick={() => {send({type: 'suck', n: 64, dir: 'all'})}}/>

        </div>
    )

}