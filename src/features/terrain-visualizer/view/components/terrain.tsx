import React, { useEffect, useRef } from "react";
import { PlaneGeometry, Mesh, DoubleSide } from "three";
import { HeightMap } from "../../../terrain-generator";
import { Plane } from "@react-three/drei";

type Props = {
  heightMap: HeightMap;
  width: number;
  height: number;
};

export const gridSize = 200;
export const gridSegments = 400;

export const Terrain = ({ heightMap, width, height }: Props) => {
  const meshRef = useRef<Mesh>(null);
  const solidMeshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (heightMap && meshRef.current && solidMeshRef.current) {
      const geometry = new PlaneGeometry(100, 100 * height / width, width - 1, height - 1);
      const vertices = geometry.attributes.position.array;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 3;
          vertices[index + 2] = heightMap[y][x] * 7; // Scale height for visibility
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
  }, [heightMap]);

  return (
    <>
      <Plane
        position={[0, 0, 0]}
        ref={solidMeshRef}
        receiveShadow
        castShadow
        args={[gridSize, gridSize, gridSegments, gridSegments]}
      >
        <meshStandardMaterial color="#666666" side={DoubleSide} />
      </Plane>
      <Plane
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
