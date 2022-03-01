import { useState, useRef, useEffect } from 'react';
import { Vector3 as ThreeVector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useBox, BoxProps } from '@react-three/cannon';

import { usePlayerControls } from '../hooks/usePlayerControls';
import { useCamera } from '../hooks/useCamera';

const SPEED = 5;

export const Cube = (props: BoxProps) => {
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
    api.rotation.set(0, camera.rotation.y, 0);
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

  const facesColors = [
    { face: 'right', color: 'white' },
    { face: 'left', color: 'blue' },
    { face: 'top', color: 'gray' },
    { face: 'front', color: 'green' },
    { face: 'back', color: 'purple' },
    { face: 'bottom', color: 'gray' },
  ];

  return (
    <mesh ref={meshRef}>
      <boxBufferGeometry attach="geometry" />
      {facesColors.map(({ color, face }, index) => (
        <meshStandardMaterial key={`cube_${face}.${index}`} attachArray="material" color={color} />
      ))}
    </mesh>
  );
};
