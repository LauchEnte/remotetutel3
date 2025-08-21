import {useEffect, useImperativeHandle} from 'react'
import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

export default function Renderer({ref}: {ref: React.Ref<any>}){

    let canvas: HTMLCanvasElement | null
    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let controls: OrbitControls
    
    function setup(){

        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight)
        renderer = new THREE.WebGLRenderer({canvas: canvas!, antialias: true})
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enablePan = false
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        }
        controls.addEventListener('change', () => {renderer.render(scene, camera)})
        
        renderer.setSize(window.innerWidth, window.innerHeight)
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.render(scene, camera)
        })
        
        const geometry = new THREE.BoxGeometry( 1, 1, 1 )
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
        const cube = new THREE.Mesh( geometry, material )
        scene.add( cube )
    
        camera.position.z = 5
    
        renderer.render( scene, camera )
    
    }

    useImperativeHandle(ref, () => {
        return {
        }
    }, [])
    
    useEffect(setup, [])


    return (
        <canvas ref={(ref) => {canvas = ref}} 
            draggable={false}
            style={{
                width: "100svw",
                height: "100svh",
                left: "0px",
                top: "0px",
                position: "absolute",
                zIndex: 1,
        }}/>
    )

}