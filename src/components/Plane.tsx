import { usePlane, PlaneProps } from '@react-three/cannon';

export const Plane = (props: PlaneProps) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};
