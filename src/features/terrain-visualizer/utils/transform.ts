import { GeoTIFFData } from "../../terrain-data-provider/geotiff";

const isCoordinateInBound = (  coordinates: [number, number],
  geoTiffData: GeoTIFFData) => {
    const [lat, lon] = coordinates;
    const { boundingBox } = geoTiffData;
    const [minX, minY, maxX, maxY] = boundingBox;
  
    return lon >= minX && lon <= maxX && lat >= minY && lat <= maxY;
  
  }
export const transformCoordinatesToHeightMapCoordinates = (
  coordinates: [number, number],
  geoTiffData: GeoTIFFData,
): [number, number] | null => {
  if (!isCoordinateInBound(coordinates, geoTiffData)) return null;

  const [lat, lon] = coordinates;
  const { width, height, boundingBox } = geoTiffData;
  const [minX, minY, maxX, maxY] = boundingBox;
  
  const xRatio = (lon - minX) / (maxX - minX);
  const yRatio = (lat - minY) / (maxY - minY);

  return [Math.round(height * yRatio), Math.round(width * xRatio)];
}

export const transformToTerrainCoordinate = (
  coordinates: [number, number],
  geoTiffData: GeoTIFFData
): [number, number] | null => {
  if (!isCoordinateInBound(coordinates, geoTiffData)) return null;

  const [lat, lon] = coordinates;
  const { boundingBox, height, width } = geoTiffData;
  const [minX, minY, maxX, maxY] = boundingBox;
  
  const xRatio = (lon - minX) / (maxX - minX);
  const yRatio = (lat - minY) / (maxY - minY);
  const xLen = 100;
  const yLen = (xLen * height) / width;

  return [xLen * xRatio - xLen / 2, yLen * yRatio - yLen / 2];
};