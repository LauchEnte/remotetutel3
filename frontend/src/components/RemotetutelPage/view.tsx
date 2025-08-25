import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export function View(){

    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    React.useEffect(() => {
        //setup aka stuff that i dont want to be ever be completely recalculated

        //get html canavs element
        const canvas = canvasRef.current
        
        //sum setup stuff
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        
        //sum more setup stuff
        const controls = new OrbitControls(camera, canvas)
        controls.enablePan = false
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        }
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE
        }
        controls.zoomSpeed = 2
        controls.addEventListener('change', render)
        controls.update()
        
        //sum renderer stuff
        const renderer = new THREE.WebGLRenderer({canvas: canvas!, antialias: true})
        renderer.setSize(window.innerWidth, window.innerHeight)
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight)
            render()
        })
        function render() {
            renderer.render(scene, camera)
        }
        
        //sum stuff to be removed later on again
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: 0x00ff00})
        )
        scene.add(cube)
        camera.position.z = 5

        console.log('View setup happened WHICH SHOULD ONLY HAPPEN ONCE')


        render()

        //give external components (mainly websocket handler) access to sum functions

    }, [canvasRef])

    return (
        <canvas 
            ref={canvasRef}
            style={{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: '100%'
            }}
        />
    )
}