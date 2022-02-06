import { useRef } from "react";
import { Canvas, useFrame, MeshProps } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'

import './styles.scss';

function Cube() {
    const meshRef = useRef<MeshProps>(null);
    useFrame(({ clock }) => {
        meshRef.current!.rotation.x = clock.getElapsedTime()
        meshRef.current!.rotation.y = clock.getElapsedTime()
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
                <OrbitControls />
            </Canvas>
        </div>
    )
}