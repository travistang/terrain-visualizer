import * as GeoTIFF from "geotiff";
import { HeightMap } from "../terrain-generator";

export type GeoTIFFData = {
    heightmap: HeightMap;
    width: number;
    height: number;    
    boundingBox: [number, number, number, number];
}
const getMax = (arr: Float32Array) => {
    let res = arr[0];
    for(let i = 0; i < arr.length; i++) {
        if (arr[i] > res) res = arr[i]
    }
    return res;
}
const getMin = (arr: Float32Array) => {
    let res = arr[0];
    for(let i = 0; i < arr.length; i++) {
        if (arr[i] < res) res = arr[i]
    }
    return res;
}

export const geoTiffDataToCoordinates = async (data: Blob) => {
  const tiff = await GeoTIFF.fromBlob(data);
  const imageCount = await tiff.getImageCount();
  const image = await tiff.getImage(imageCount - 1);
  const width = image.getWidth();
  const height = image.getHeight();
  const rasters = await image.readRasters({ interleave: false });
  const heightData = rasters[0];
  const heightmapData1d = new Float32Array(
    typeof heightData === "number" ? [heightData] : heightData
  );
  const max = getMax(heightmapData1d);
  const min = getMin(heightmapData1d);
  const normalizedHeightmapData1d = heightmapData1d.map((n) => (n - min) / (max - min));
  return {
    width,
    height,
    data: normalizedHeightmapData1d,
    boundingBox: image.getBoundingBox() as GeoTIFFData['boundingBox'],
  };
};

export const getHeightMapFromGeoTiff = async (data: Blob): Promise<GeoTIFFData> => {
  const {
    width,
    height,
    data: heightMap1d,
    boundingBox,
  } = await geoTiffDataToCoordinates(data);
  const heightmap: number[][] = [];
  for( let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
        row.push(heightMap1d[y * width + x]);
    }
    heightmap.push(row);
  }
  return {width, height, heightmap, boundingBox};
};
