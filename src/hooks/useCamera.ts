import { useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

export const useCamera = ([x, y, z]: number[], rotation: number) => {
  const { camera } = useThree();

  const getOffset = useCallback((signNumber: number, constant: number) => Math.sign(signNumber) * constant, []);

  useFrame(() => {
    const camX = Math.sin(rotation) * 2 + getOffset(rotation, x);
    const camZ = Math.cos(rotation) * 2 + getOffset(rotation, z);
    const camY = y + 2;

    // const camX = Math.sin(cursor.current.x * Math.PI * 2) * 5 + x;
    // const camZ = Math.cos(cursor.current.x * Math.PI * 2) * 5 + z;

    camera.position.set(camX, camY, camZ);
    camera.lookAt(x, y, z);
    // camera.rotation.set(0, Math.sin(rotation) * Math.PI * 2, 0);
  });

  return camera;
};
