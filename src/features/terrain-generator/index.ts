import { generatePerlinNoise } from 'perlin-noise';

export type HeightMap = number[][];
// Function to generate height map using Perlin noise
export function generateHeightMap(width: number, height: number, scale: number = 0.1): HeightMap {
    const noise = generatePerlinNoise(width, height);
    const heightMap: HeightMap = Array.from({ length: height }, () => Array(width).fill(0));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            heightMap[y][x] = noise[x * width + y];
        }
    }
    return heightMap;
}

// Function to print height map (optional)
export function printHeightMap(heightMap: HeightMap): void {
    for (const row of heightMap) {
        console.log(row.map(value => (value * 255).toFixed(0).padStart(3, ' ')).join(' '));
    }
}