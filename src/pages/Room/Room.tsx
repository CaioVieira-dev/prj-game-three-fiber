import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, MeshProps, useThree, Vector3 } from "@react-three/fiber";
// import { OrbitControls } from '@react-three/drei'

import './styles.scss';

type controlsType = { left: Boolean, right: Boolean, up: Boolean, down: Boolean }

const usePlayerControls = () => {
    const [left, setLeft] = useState(false)
    const [right, setRight] = useState(false)
    const [up, setUp] = useState(false)
    const [down, setDown] = useState(false)

    useEffect(() => {

        function handleKeyDown(this: Document, e: KeyboardEvent) {
            e.code === 'KeyA' && setLeft(true);
            e.code === 'KeyD' && setRight(true);
            e.code === 'KeyW' && setUp(true);
            e.code === 'KeyS' && setDown(true);
        };
        function handleKeyUp(this: Document, e: KeyboardEvent) {
            e.code === 'KeyA' && setLeft(false);
            e.code === 'KeyD' && setRight(false);
            e.code === 'KeyW' && setUp(false);
            e.code === 'KeyS' && setDown(false);
        };

        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("keyup", handleKeyUp)
        }
    }, [])
    return { left, right, up, down }
}
function useCamera({ left, right, up, down }: controlsType) {
    const { camera } = useThree()
    useFrame(() => {

        const lastPos = camera.position;
        const x = lastPos.x + (left ? -0.1 : 0) + (right ? 0.1 : 0)
        const z = lastPos.z + (up ? -0.1 : 0) + (down ? 0.1 : 0)
        camera.position.set(x, lastPos.y, z)
    })
}

function Cube() {
    const meshRef = useRef<MeshProps>(null);
    const { left, right, up, down } = usePlayerControls();
    useCamera({ left, right, up, down })

    useFrame(({ clock }) => {
        meshRef.current!.rotation.x = clock.getElapsedTime()
        meshRef.current!.rotation.y = clock.getElapsedTime()

        const lastPos = meshRef.current!.position;
        const x = lastPos.x + (left ? -0.1 : 0) + (right ? 0.1 : 0)
        const z = lastPos.z + (up ? -0.1 : 0) + (down ? 0.1 : 0)
        meshRef.current!.position.set(x, lastPos.y, z)
    })
    return <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
    </mesh>
}

function Plane() {

    return <mesh position={[0, -3, 0]} rotation={[(-Math.PI / 2), 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color='gray' />
    </mesh>
}

export function Room() {


    return (
        <div className="canvas-container">
            <Canvas >
                <ambientLight intensity={0.1} />
                <directionalLight color='red' position={[0, 3, 5]} />
                <Cube />
                <Plane />
                {/* <OrbitControls /> */}
            </Canvas>
        </div>
    )
}