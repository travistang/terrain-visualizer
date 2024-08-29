import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MeshStandardMaterial, PointLight } from "three";

type Props = {
  coordinates: [number, number];
  zIndex?: number;
  size?: number;
  color: string;
};
export const Point = ({
  color,
  size = 0.1,
  coordinates,
  zIndex = 7,
}: Props) => {
    const lightRef = useRef<PointLight>(null);
    const materialRef = useRef<MeshStandardMaterial>(null);
    useFrame((dt) => {
        if (!lightRef.current || !materialRef.current) return;
        lightRef.current.intensity = 10 * Math.abs(Math.sin(dt.clock.elapsedTime)) + 0.1;
        materialRef.current.emissiveIntensity = 2 * Math.abs(Math.sin(dt.clock.elapsedTime)) + 1;
    });
  return (
    <Sphere position={[coordinates[0], coordinates[1], zIndex]}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
      <pointLight ref={lightRef} color={color} intensity={3} distance={4} decay={2} />
    </Sphere>
  );
};
