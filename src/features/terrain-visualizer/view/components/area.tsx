import { Billboard, Extrude } from "@react-three/drei";
import { useContext, useMemo, useRef } from "react";
import {
  DoubleSide,
  ExtrudeGeometry,
  ExtrudeGeometryOptions,
  Shape,
  Vector3,
} from "three";
import { GPXRoute } from "../../../gpx/view/gpx-route";
import { LatLng, XYCoordinates } from "../../types";
import { transformToTerrainCoordinate } from "../../utils/transform";
import { terrainDataContext } from "../contexts/TerrainDataContext";

export type AreaProps = {
  id: string;
  boundary: LatLng[];
  color: string;
  label?: string;
};

const extrudeSettings: ExtrudeGeometryOptions = {
  steps: 2,
  depth: 16,
};
export const Area = ({ id, boundary, color, label }: AreaProps) => {
  const terrainData = useContext(terrainDataContext);
  const geometryRef = useRef<ExtrudeGeometry>(null);
  const coordinatesOnTerrain = useMemo(() => {
    return boundary.map((latlng) =>
      transformToTerrainCoordinate(latlng, terrainData)
    );
  }, [boundary, terrainData]);
  const center = useMemo(() => {
    const sum = coordinatesOnTerrain.reduce(
      (center, v) =>
        center.add({
          x: v[0],
          y: v[1],
          z: 0,
        }),
      new Vector3()
    );
    return sum.divideScalar(coordinatesOnTerrain.length);
  }, [coordinatesOnTerrain]);

  const shape = useMemo(() => {
    const shape = new Shape();
    if (coordinatesOnTerrain.length < 3 || !geometryRef.current) return shape;
    const coordToCenter = (coord: XYCoordinates): XYCoordinates => {
      return [coord[0] - center.x, coord[1] - center.y];
    };

    shape.moveTo(...coordToCenter(coordinatesOnTerrain[0]));
    for (let i = 1; i < coordinatesOnTerrain.length; i++) {
      shape.lineTo(...coordToCenter(coordinatesOnTerrain[i]));
    }
    shape.lineTo(...coordToCenter(coordinatesOnTerrain[0]));
    return shape;
  }, [coordinatesOnTerrain, center]);
  return (
    <>
      <GPXRoute id={id} route={boundary} color={color} />
      <Extrude args={[shape, extrudeSettings]} position={center}>
        <meshStandardMaterial color={color} side={DoubleSide} />
        {label && <Billboard position={[0, 0, 0]}>{label}</Billboard>}
      </Extrude>
    </>
  );
};
