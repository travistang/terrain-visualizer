import { Object3D, Raycaster, Vector3 } from "three";
import { XYCoordinates } from "../types";

export const getPointOnTerrain = (
  coordinates: XYCoordinates,
  terrain: Object3D
): Vector3 | null => {
  const raycaster = new Raycaster();
  const rayOrigin = new Vector3(coordinates[0], coordinates[1], 0);
  const rayDirection = new Vector3(0, 0, 1);
  raycaster.set(rayOrigin, rayDirection);
  const intersection = raycaster.intersectObject(terrain, false);
  if (!intersection?.length) return null;
  return intersection[0].point;
};
