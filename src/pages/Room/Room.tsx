import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, MeshProps, useThree, Vector3 } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei'

import './styles.scss';

type controlsType = { left: Boolean; right: Boolean; up: Boolean; down: Boolean };

const usePlayerControls = () => {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    function handleKeyDown(this: Document, e: KeyboardEvent) {
      e.code === 'KeyA' && setLeft(true);
      e.code === 'KeyD' && setRight(true);
      e.code === 'KeyW' && setUp(true);
      e.code === 'KeyS' && setDown(true);
    }
    function handleKeyUp(this: Document, e: KeyboardEvent) {
      e.code === 'KeyA' && setLeft(false);
      e.code === 'KeyD' && setRight(false);
      e.code === 'KeyW' && setUp(false);
      e.code === 'KeyS' && setDown(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return { left, right, up, down };
};

function useCamera(playerRef: MeshProps) {
  const { camera } = useThree();
  const sizes = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const cursor = useRef({
    x: 0,
    y: 0,
  });

  useFrame(() => {
    const camX = Math.sin(cursor.current.x * Math.PI) * 5 + playerRef.current.position.x;
    const camZ = Math.cos(cursor.current.x * Math.PI) * 5 + playerRef.current.position.z;
    const camY = cursor.current.y * 3 + playerRef.current.position.y;
    camera.position.set(camX, camY, camZ);
    camera.lookAt(playerRef.current.position);
  });

  useEffect(() => {
    function handleMouseMove(this: Document, ev: MouseEvent) {
      cursor.current.x = ev.clientX / sizes.current.width - 0.5;
      cursor.current.y = ev.clientY / sizes.current.height - 0.5;
    }
    function handleWindowResize() {
      sizes.current = { width: window.innerWidth, height: window.innerHeight };
    }

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleWindowResize);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
}
type handleMovementArgs = {
  position: Vector3;
  inputs: controlsType;
};

function handleMovement({ position, inputs }: handleMovementArgs) {
  const newX: number = position.x + (inputs.left ? -0.1 : 0) + (inputs.right ? 0.1 : 0);
  const newZ: number = position.z + (inputs.up ? -0.1 : 0) + (inputs.down ? 0.1 : 0);
  const newY: number = position.y;

  return { x: newX, y: newY, z: newZ };
}

function Cube() {
  const meshRef = useRef<MeshProps>(null);
  const { left, right, up, down } = usePlayerControls();
  useCamera(meshRef);

  useFrame(({ clock }) => {
    meshRef.current!.rotation.x = clock.getElapsedTime();
    meshRef.current!.rotation.y = clock.getElapsedTime();

    const { x, y, z } = handleMovement({
      position: { x: meshRef.current!.position.x, y: meshRef.current!.position.y, z: meshRef.current!.position.z },
      inputs: { left, right, up, down },
    });
    meshRef.current!.position.set(x, y, z);
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function Plane() {
  return (
    <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export function Room() {
  return (
    <div className="canvas-container">
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 3, 5]} />
        <Cube />
        <Plane />
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
