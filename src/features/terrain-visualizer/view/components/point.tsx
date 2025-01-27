import { Billboard, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useMemo, useRef } from "react";
import { MeshStandardMaterial, PointLight } from "three";
import { Ball } from "../../../common/utils/view/maps/ball";
import { PointProps } from "../../../terrain-data-provider/types";
import { getPointOnTerrain } from "../../utils/terrain";
import { transformToTerrainCoordinate } from "../../utils/transform";
import { terrainDataContext } from "../contexts/TerrainDataContext";

export const Point = ({
  id,
  glowMode,
  color,
  size = 0.05,
  coordinates,
  label,
}: PointProps) => {
  const lightRef = useRef<PointLight>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const terrainData = useContext(terrainDataContext);
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
    <group key={id} position={position}>
      <Billboard>
        <Text position={[0, 0.2, 0]} color={color} fontSize={0.1}>
          {label}
        </Text>
      </Billboard>
      <Ball color={color} glowSpeed={1} size={size} glowMode={glowMode} />
    </group>
  );
};
