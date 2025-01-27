import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useCallback, useContext, useEffect, useRef } from "react";
import { DoubleSide, Mesh, PlaneGeometry } from "three";
import { LatLng, XYCoordinates } from "../../types";
import { transformToLatLng } from "../../utils/transform";
import { terrainDataContext } from "../contexts/TerrainDataContext";

export type OnTerrainClickHandlerProps = {
  latlng: LatLng;
  terrainCoordinates: XYCoordinates;
};
type Props = {
  hollow?: boolean;
  onClick?: (props: OnTerrainClickHandlerProps) => void;
};

export const gridSize = 200;
export const gridSegments = 400;

export const Terrain = ({ hollow, onClick }: Props) => {
  const meshRef = useRef<Mesh>(null);
  const solidMeshRef = useRef<Mesh>(null);
  const terrainData = useContext(terrainDataContext);
  const { heightmap, width, height } = terrainData;
  const handlerClick = useCallback(
    ({ intersections }: ThreeEvent<MouseEvent>) => {
      const [intersection] = intersections;
      if (!intersection || !onClick) return;

      const coordinatesOnTerrain = [
        intersection.point.x,
        intersection.point.y,
      ] as XYCoordinates;
      const onClickProps: OnTerrainClickHandlerProps = {
        terrainCoordinates: coordinatesOnTerrain,
        latlng: transformToLatLng(coordinatesOnTerrain, terrainData),
      };
      onClick(onClickProps);
    },
    [onClick, terrainData]
  );
  useEffect(() => {
    if (heightmap && meshRef.current && solidMeshRef.current) {
      const geometry = new PlaneGeometry(
        100,
        (100 * height) / width,
        width - 1,
        height - 1
      );
      const vertices = geometry.attributes.position.array;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 3;
          vertices[index + 2] = heightmap[y][x] * 7; // Scale height for visibility
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      meshRef.current.geometry = geometry;
      meshRef.current.castShadow = true; // Enable casting shadows
      meshRef.current.receiveShadow = true;

      solidMeshRef.current.geometry = geometry;
      solidMeshRef.current.castShadow = true; // Enable casting shadows
      solidMeshRef.current.receiveShadow = true;
    }
  }, [heightmap, height, width]);

  return (
    <>
      {!hollow && (
        <Plane
          name="terrain"
          position={[0, 0, 0]}
          ref={solidMeshRef}
          receiveShadow
          castShadow
          args={[gridSize, gridSize, gridSegments, gridSegments]}
        >
          <meshStandardMaterial color="#666666" side={DoubleSide} />
        </Plane>
      )}
      <Plane
        onClick={handlerClick}
        ref={meshRef}
        position={[0, 0, 0.01]}
        args={[gridSize, gridSize, gridSegments, gridSegments]}
      >
        <meshStandardMaterial
          wireframe
          wireframeLinewidth={2}
          color="white"
          depthTest
          depthWrite={false}
          side={DoubleSide}
        />
      </Plane>
    </>
  );
};
