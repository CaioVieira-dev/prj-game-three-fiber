import { useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon';

import { Cube } from '../../components/Cube';
import { Plane } from '../../components/Plane';

import './styles.scss';

export function Room() {
  const canvasRef = useRef(null);
  const requestPointerLock = useCallback((element) => {
    element.requestPointerLock =
      element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    // Ask the browser to lock the pointer
    element.requestPointerLock();
  }, []);

  //   const exitPointerLock = useCallback((element) => {
  //     // Ask the browser to release the pointer
  //     element.exitPointerLock = element.exitPointerLock ||
  // element.mozExitPointerLock ||
  // element.webkitExitPointerLock;
  // element.exitPointerLock();
  //   },[])

  return (
    <div className="canvas-container" onClick={() => requestPointerLock(canvasRef.current)}>
      <Canvas ref={canvasRef}>
        <ambientLight intensity={0.4} />
        <directionalLight color="white" position={[0, 3, 5]} />
        <Physics>
          <Cube props={{ args: [1, 1, 1] }} canvasRef={canvasRef} />
          <Plane position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        </Physics>
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
