import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon';

import { Cube } from '../../components/Cube';
import { Plane } from '../../components/Plane';

import './styles.scss';

export function Room() {
  return (
    <div className="canvas-container">
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 3, 5]} />
        <Physics>
          <Cube args={[1, 1, 1]} />
          <Plane position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        </Physics>
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
