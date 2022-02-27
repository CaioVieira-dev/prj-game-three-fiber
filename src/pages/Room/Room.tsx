import React, { useRef, useEffect, useState } from 'react';
import { Vector3 as ThreeVector3 } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei'
import { Physics, usePlane, useBox, PlaneProps, BoxProps } from '@react-three/cannon';

import './styles.scss';

// type controlsType = { left: Boolean; right: Boolean; forward: Boolean; backward: Boolean };

const usePlayerControls = () => {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [forward, setForward] = useState(false);
  const [backward, setBackward] = useState(false);

  useEffect(() => {
    function handleKeyDown(this: Document, e: KeyboardEvent) {
      e.code === 'KeyA' && setLeft(true);
      e.code === 'KeyD' && setRight(true);
      e.code === 'KeyW' && setForward(true);
      e.code === 'KeyS' && setBackward(true);
    }
    function handleKeyUp(this: Document, e: KeyboardEvent) {
      e.code === 'KeyA' && setLeft(false);
      e.code === 'KeyD' && setRight(false);
      e.code === 'KeyW' && setForward(false);
      e.code === 'KeyS' && setBackward(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return { left, right, forward, backward };
};

function useCamera([x, y, z]: number[]) {
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
    const camX = Math.sin(cursor.current.x * Math.PI) * 5 + x;
    const camZ = Math.cos(cursor.current.x * Math.PI) * 5 + z;
    const camY = cursor.current.y * 3 + y;
    camera.position.set(camX, camY, camZ);
    camera.lookAt(x, y, z);
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

  return camera;
}
// type handleMovementArgs = {
//   position: Vector3;
//   inputs: controlsType;
// };

// function handleMovement({ position, inputs }: handleMovementArgs) {
//   const newX: number = position.x + (inputs.left ? -0.1 : 0) + (inputs.right ? 0.1 : 0);
//   const newZ: number = position.z + (inputs.up ? -0.1 : 0) + (inputs.down ? 0.1 : 0);
//   const newY: number = position.y;

//   return { x: newX, y: newY, z: newZ };
// }

const SPEED = 5;

function Cube(props: BoxProps) {
  const [meshRef, api] = useBox(() => ({ mass: 1, position: [0, 5, 0], angularFactor: [0, 1, 0], ...props }));
  const { left, right, forward, backward } = usePlayerControls();
  const [position, setPosition] = useState([0, 0, 0]);
  const [frontVector, setFrontVector] = useState(new ThreeVector3(0, 0, 0));
  const [sideVector, setSideVector] = useState(new ThreeVector3(0, 0, 0));
  const [direction, setDirection] = useState(new ThreeVector3());
  const [speed, setSpeed] = useState(new ThreeVector3());
  const velocity = useRef([0, 0, 0]);

  const camera = useCamera(position);

  useFrame(({ clock }) => {
    meshRef.current!.rotation.x = clock.getElapsedTime();
    meshRef.current!.rotation.y = clock.getElapsedTime();

    setFrontVector(new ThreeVector3(0, 0, Number(backward) - Number(forward)));
    setSideVector(new ThreeVector3(Number(left) - Number(right), 0, 0));

    setDirection(
      direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation)
    );

    setSpeed(speed.fromArray(velocity.current));
    api.velocity.set(direction.x, velocity.current[1], direction.z);
    api.angularFactor.set(0, 1, 0);
    // if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05) api.velocity.set(velocity.current[0], 10, velocity.current[2])

    // const { x, y, z } = handleMovement({
    //   position: { x: meshRef.current!.position.x, y: meshRef.current!.position.y, z: meshRef.current!.position.z },
    //   inputs: { left, right, forward, backward },
    // });
    // meshRef.current!.position.set(x, y, z);
    // api.applyImpulse([0.1, 0, 0], [0, 0, 0]);
  });

  useEffect(() => {
    api.position.subscribe((p) => setPosition([...p]));
    api.velocity.subscribe((v) => (velocity.current = v));
  }, [api.position, api.velocity]);

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}

function Plane(props: PlaneProps) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
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
        <Physics>
          <Cube args={[1, 1, 1]} />
          <Plane position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        </Physics>
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
