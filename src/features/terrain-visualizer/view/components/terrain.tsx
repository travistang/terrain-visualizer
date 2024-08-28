// src/components/Terrain.js
import React, { useEffect, useRef } from 'react';
import { PlaneGeometry, Mesh,  } from 'three';
import { HeightMap } from '../../../terrain-generator';

type Props = {
    heightMap: HeightMap;
    width: number;
    height: number;
};

export const Terrain = ({ heightMap, width, height }: Props) => {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (heightMap && meshRef.current) {
      const geometry = new PlaneGeometry(100, 100, width - 1, height - 1);
      const vertices = geometry.attributes.position.array;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 3;
          vertices[index + 2] = heightMap[y][x] * 10; // Scale height for visibility
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      meshRef.current.geometry = geometry;
      meshRef.current.castShadow = true; // Enable casting shadows
      meshRef.current.receiveShadow = true; 
    }
  }, [heightMap]);

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial color="lightgray" />
    </mesh>
  );
};