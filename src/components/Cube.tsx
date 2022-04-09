import { useState, useRef, useEffect, MutableRefObject } from 'react';
import { Vector3 as ThreeVector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useBox, BoxProps } from '@react-three/cannon';
import { PerspectiveCamera } from '@react-three/drei';

import { usePlayerControls } from '../hooks/usePlayerControls';

const SPEED = 5;

type CubeProps = {
  canvasRef: MutableRefObject<null>;
  props: BoxProps;
};

export const Cube = ({ canvasRef, ...props }: CubeProps) => {
  const [meshRef, api] = useBox(() => ({ mass: 1, position: [0, 5, 0], angularFactor: [0, 1, 0], ...props }));
  const { left, right, forward, backward, cursor } = usePlayerControls(canvasRef);
  // const [position, setPosition] = useState([0, 0, 0]); //não utilizado no momento
  const [frontVector, setFrontVector] = useState(new ThreeVector3(0, 0, 0));
  const [sideVector, setSideVector] = useState(new ThreeVector3(0, 0, 0));
  const [direction, setDirection] = useState(new ThreeVector3());
  const [speed, setSpeed] = useState(new ThreeVector3());
  const velocity = useRef([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);

  const getYRotation = (x: number, actualY: number) => {
    //a camera só rotaciona se o mause tiver movido mais de 3 pixels
    //isso previne que a camera gire sem parar
    if (x < 3 && x > -3) {
      return actualY;
    }
    //multiplicar por PI/180 converte o valor para radiano
    const newRotation = actualY + x * (Math.PI / 180);
    setRotation([0, newRotation, 0]);

    return newRotation;
  };
  useFrame(({ clock }) => {
    // meshRef.current!.rotation.x = clock.getElapsedTime();
    // meshRef.current!.rotation.y = clock.getElapsedTime();

    setFrontVector(new ThreeVector3(0, 0, Number(backward) - Number(forward)));
    setSideVector(new ThreeVector3(Number(left) - Number(right), 0, 0));

    api.rotation.set(0, getYRotation(cursor.x, rotation[1]), 0);
    api.angularFactor.set(0, 1, 0);

    setDirection(
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED)
        .applyEuler(meshRef.current!.rotation)
    );

    setSpeed(speed.fromArray(velocity.current));
    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05) api.velocity.set(velocity.current[0], 10, velocity.current[2])

    // const { x, y, z } = handleMovement({
    //   position: { x: meshRef.current!.position.x, y: meshRef.current!.position.y, z: meshRef.current!.position.z },
    //   inputs: { left, right, forward, backward },
    // });
    // meshRef.current!.position.set(x, y, z);
    // api.applyImpulse([0.1, 0, 0], [0, 0, 0]);
  });

  useEffect(() => {
    // api.position.subscribe((p) => setPosition([...p])); //não usado no momento
    api.velocity.subscribe((v) => (velocity.current = v));
    api.rotation.subscribe((r) => meshRef.current!.rotation.set(...r));
  }, [
    // api.position,
    api.rotation,
    api.velocity,
    meshRef,
  ]);

  const facesColors = [
    { face: 'left', color: 'red' },
    { face: 'right', color: 'blue' },
    { face: 'top', color: 'cyan' },
    { face: 'bottom', color: 'green' },
    { face: 'front', color: 'purple' },
    { face: 'back', color: 'white' },
  ];

  return (
    <mesh ref={meshRef}>
      <PerspectiveCamera makeDefault position={[0, 2, 10]} />
      <boxBufferGeometry attach="geometry" />
      {facesColors.map(({ color, face }, index) => (
        <meshStandardMaterial key={`cube_${face}.${index}`} attachArray="material" color={color} />
      ))}
    </mesh>
  );
};
