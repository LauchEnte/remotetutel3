import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SharedContext, Turtle } from '../RemotetutelPage'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class MyView {
    canvas: HTMLCanvasElement
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    controls: OrbitControls
    renderer: THREE.WebGLRenderer
    loader: GLTFLoader

    constructor(
        canvas: HTMLCanvasElement, 
        scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        controls: OrbitControls, 
        renderer: THREE.WebGLRenderer,
        loader: GLTFLoader
    ){

        this.canvas = canvas
        this.scene = scene
        this.camera = camera
        this.controls = controls
        this.renderer = renderer
        this.loader = loader
    }

    setTargetTurtle(turtle: Turtle){
        const newTarget = new THREE.Vector3(turtle.pos.x, turtle.pos.y, turtle.pos.z)
        const oldTarget = this.controls.target
        const diff = new THREE.Vector3().subVectors(newTarget, oldTarget)

        this.controls.target.copy(newTarget)
        this.camera.position.addVectors(this.camera.position, diff)
        
        this.controls.update()
    }

    addTurtle(turtle: Turtle){
        const pos = new THREE.Vector3(turtle.pos.x, turtle.pos.y, turtle.pos.z)
        this.loader.load('src/assets/turtle/turtle.glb', (gltf) => {
            const model = gltf.scene.children[0]
            this.scene.add(model)
            console.log(this.scene)
        })
    }

    getCameraPitch(n: 0 | 2 | 3): number | 'up' | 'down' | 'normal' {
        const pitch = this.camera.getWorldDirection(new THREE.Vector3()).y

        if (n == 0){
            return pitch
        } else if (n == 2) {
            return pitch < 0 ? 'down' : 'up'
        } else {
            return pitch < -0.5 ? 'down' : pitch > 0.5 ? 'up' : 'normal'
        }
    }

}

export function View(){

    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const shared = React.useContext(SharedContext)

    React.useEffect(() => {
        //setup aka stuff that i dont want to be ever be completely recalculated

        //get html canavs element
        const canvas = canvasRef.current
        
        //sum setup stuff
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

        const light = new THREE.AmbientLight(0xffffff)
        scene.add(light)
        
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
        camera.position.set(5, 3, 5)
        
        //sum renderer stuff
        const renderer = new THREE.WebGLRenderer({canvas: canvas!, antialias: true})
        renderer.setSize(window.innerWidth, window.innerHeight)
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
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

        console.log('View setup happened WHICH SHOULD ONLY HAPPEN ONCE')

        controls.update()
        render()

        const loader = new GLTFLoader()

        //give external components (mainly websocket handler) access to sum functions
        shared.view = new MyView(canvas!, scene, camera, controls, renderer, loader)

    }, [canvasRef, shared])

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