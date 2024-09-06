import GpxParser from "gpxparser";
import { Vector3 } from "three";
import { splitArrayBy } from "../common/utils/array";
import { GeoTIFFData } from "../terrain-data-provider/geotiff";
import {
  getElevationAtLatLng,
  transformToTerrainCoordinate,
} from "../terrain-visualizer/utils/transform";

export const getGPXWayPointsFromBlob = async (blob: Blob) => {
  const gpx = new GpxParser();
  gpx.parse(await blob.text());
  return gpx.tracks[0] || null;
};

export const getGPXLineCoordinatesOnTerrain = (
  latlngs: [number, number][],
  terrainData: GeoTIFFData
): Vector3[][] => {
  const pointsOnTerrain = latlngs.map((latlng) => {
    const xyCoordinateOnTerrain = transformToTerrainCoordinate(
      latlng,
      terrainData
    );
    if (!xyCoordinateOnTerrain) return null;
    const elevation = getElevationAtLatLng(latlng, terrainData);

    return new Vector3(
      xyCoordinateOnTerrain[0],
      xyCoordinateOnTerrain[1],
      elevation! * 7 + 0.04
    );
  });
  return splitArrayBy(pointsOnTerrain, null) as Vector3[][];
};
