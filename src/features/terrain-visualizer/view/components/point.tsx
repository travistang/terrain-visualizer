import { Billboard, Sphere, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MeshStandardMaterial, PointLight } from "three";
import { GeoTIFFData } from "../../../terrain-data-provider/geotiff";
import { LatLng } from "../../types";
import { getPointOnTerrain } from "../../utils/terrain";
import { transformToTerrainCoordinate } from "../../utils/transform";

type Props = {
  terrainData: GeoTIFFData;
  coordinates: LatLng;
  size?: number;
  color: string;
  label?: string;
};

export const Point = ({
  terrainData,
  color,
  size = 0.05,
  coordinates,
  label,
}: Props) => {
  const lightRef = useRef<PointLight>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const three = useThree();
  const terrain = three.scene.getObjectByName("terrain");
  const position = useMemo(() => {
    const terrainCoordinates = transformToTerrainCoordinate(
      coordinates,
      terrainData
    );
    if (!terrainCoordinates || !terrain) return null;
    return getPointOnTerrain(terrainCoordinates, terrain);
  }, [terrainData, coordinates, terrain]);

  useFrame((dt) => {
    if (!lightRef.current || !materialRef.current) return;
    lightRef.current.intensity =
      10 * Math.abs(Math.sin(dt.clock.elapsedTime)) + 0.1;
    materialRef.current.emissiveIntensity =
      2 * Math.abs(Math.sin(dt.clock.elapsedTime)) + 1;
  });

  if (!position) return null;

  return (
    <group position={position}>
      <Billboard>
        <Text position={[0, 0.2, 0]} color={color} fontSize={0.1}>
          {label}
        </Text>
      </Billboard>
      <Sphere>
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
    </group>
  );
};
