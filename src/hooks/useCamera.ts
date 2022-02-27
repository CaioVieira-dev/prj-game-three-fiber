import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

export const useCamera = ([x, y, z]: number[]) => {
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
    const camX = Math.sin(cursor.current.x * Math.PI * 2) * 5 + x;
    const camZ = Math.cos(cursor.current.x * Math.PI * 2) * 5 + z;
    const camY = cursor.current.y * 3 + y + 2;
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
};
