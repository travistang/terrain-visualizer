import { interpolate } from "../../common/utils/array";
import { GeoTIFFData } from "../../terrain-data-provider/geotiff";
import { LatLng, XYCoordinates } from "../types";

const isCoordinateInBound = (coordinates: LatLng, geoTiffData: GeoTIFFData) => {
  const [lat, lon] = coordinates;
  const { boundingBox } = geoTiffData;
  const [minX, minY, maxX, maxY] = boundingBox;

  return lon >= minX && lon <= maxX && lat >= minY && lat <= maxY;
};

export const transformToTerrainDimensionRatio = (
  coordinates: LatLng,
  geoTiffData: GeoTIFFData
) => {
  if (!isCoordinateInBound(coordinates, geoTiffData)) return null;

  const [lat, lon] = coordinates;
  const { boundingBox } = geoTiffData;
  const [minX, minY, maxX, maxY] = boundingBox;

  const xRatio = (lon - minX) / (maxX - minX);
  const yRatio = (lat - minY) / (maxY - minY);
  return [xRatio, yRatio];
};

export const latLngToHeightMapCoordinates = (
  coordinates: LatLng,
  geoTiffData: GeoTIFFData
): XYCoordinates | null => {
  const ratio = transformToTerrainDimensionRatio(coordinates, geoTiffData);
  if (!ratio) return null;
  const { height, width } = geoTiffData;
  const row = (1 - ratio[1]) * (height - 1); // invert latitude because higher latitudes are typically at the top
  const col = ratio[0] * (width - 1);
  return [row, col];
};

export const transformToTerrainCoordinate = (
  coordinates: LatLng,
  geoTiffData: GeoTIFFData
): XYCoordinates | null => {
  const ratio = transformToTerrainDimensionRatio(coordinates, geoTiffData);
  if (!ratio) return null;

  const { height, width } = geoTiffData;

  const xLen = 100;
  const yLen = (xLen * height) / width;

  return [xLen * ratio[0] - xLen / 2, yLen * ratio[1] - yLen / 2];
};

export const getElevationAtCoordinates = (
  coordinates: XYCoordinates,
  geoTiffData: GeoTIFFData
) => {
  return interpolate(geoTiffData.heightmap, coordinates);
};

export const getElevationAtLatLng = (
  coordinates: LatLng,
  geoTiffData: GeoTIFFData
): number | null => {
  const heightMapCoordinates = latLngToHeightMapCoordinates(
    coordinates,
    geoTiffData
  );

  if (!heightMapCoordinates) return null;

  return getElevationAtCoordinates(
    heightMapCoordinates.reverse() as XYCoordinates,
    geoTiffData
  );
};
