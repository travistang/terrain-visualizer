import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, MeshStandardMaterial, PointLight, Vector3 } from "three";

export type GlowMode = "none" | "constant" | "blink";
type Props = {
  ballRef?: React.MutableRefObject<Mesh | null>;
  color: string;
  position?: Vector3;
  glowMode?: GlowMode;
  glowSpeed?: number;
  size: number;
};
export const Ball = ({
  ballRef,
  position,
  glowMode = "none",
  size,
  color,
  glowSpeed,
}: Props) => {
  const lightRef = useRef<PointLight>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);

  useFrame((dt) => {
    if (!lightRef.current || !materialRef.current) return;
    switch (glowMode) {
      case "none": {
        lightRef.current.intensity = 0;
        materialRef.current.emissiveIntensity = 0;
        break;
      }
      case "constant": {
        lightRef.current.intensity = 5;
        materialRef.current.emissiveIntensity = 1;
        break;
      }
      case "blink": {
        if (!glowSpeed) break;
        lightRef.current.intensity =
          10 * Math.abs(glowSpeed * Math.sin(dt.clock.elapsedTime)) + 0.1;
        materialRef.current.emissiveIntensity =
          2 * Math.abs(glowSpeed * Math.sin(dt.clock.elapsedTime)) + 1;
        break;
      }
    }
  });
  return (
    <Sphere ref={ballRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
      <pointLight
        ref={lightRef}
        color={color}
        intensity={3}
        distance={4}
        decay={2}
      />
    </Sphere>
  );
};
