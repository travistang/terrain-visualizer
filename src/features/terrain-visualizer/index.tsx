import { ArcballControls, FlyControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import classNames from "classnames";
import { useRef } from "react";
import { PerspectiveCamera } from "three";
import { GPXRoute } from "../gpx/view/gpx-route";
import { GeoTIFFData } from "../terrain-data-provider/geotiff";
import {
  PointProps,
  RouteProps,
  TerrainVisualizerMode,
} from "../terrain-data-provider/types";
import { Point } from "./view/components/point";
import { OnTerrainClickHandlerProps, Terrain } from "./view/components/terrain";
import { TerrainDataContext } from "./view/contexts/TerrainDataContext";

type Props = {
  points?: PointProps[];
  routes?: RouteProps[];
  className?: string;
  terrainData: GeoTIFFData;
  mode?: TerrainVisualizerMode;
  onClick?: (e: OnTerrainClickHandlerProps) => void;
};
export const TerrainVisualizer = ({
  className,
  onClick,
  terrainData,
  points = [],
  routes = [],
}: Props) => {
  const cameraRef = useRef<PerspectiveCamera>(null);
  return (
    <Canvas
      className={classNames("fixed inset-0 w-screen h-screen", className)}
      camera={{
        fov: 60,
        far: 300,
      }}
    >
      <axesHelper />
      <ambientLight intensity={0.4} castShadow />
      <perspectiveCamera ref={cameraRef}>
        <pointLight
          position={[0, 0, 0]}
          intensity={1}
          decay={2}
          distance={100}
          castShadow
        />
      </perspectiveCamera>
      <FlyControls movementSpeed={5} dragToLook />
      <ArcballControls enableAnimations />
      {terrainData && (
        <TerrainDataContext data={terrainData}>
          <Terrain onClick={onClick} />
          {points.map((pointProps) => (
            <Point {...pointProps} key={pointProps.id} />
          ))}
          {routes.map((routeProps) => (
            <GPXRoute {...routeProps} key={routeProps.id} />
          ))}
        </TerrainDataContext>
      )}
    </Canvas>
  );
};
