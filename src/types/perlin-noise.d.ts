declare module 'perlin-noise' {
    export type GeneratePerlinNoiseOption = {
        octaveCount?: number;
        amplitude?: number;
        persistence?: number;
    }
    export function generatePerlinNoise(x: number, y: number, options?: GeneratePerlinNoiseOption): number[];
}