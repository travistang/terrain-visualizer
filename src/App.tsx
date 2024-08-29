import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls, Sphere } from "@react-three/drei";
import { Terrain } from "./features/terrain-visualizer/view/components/terrain";

import "./App.css";
import { FileUpload } from "./features/terrain-data-provider/view/components/file-upload";
import { useMemo, useRef, useState } from "react";
import {
  GeoTIFFData,
  getHeightMapFromGeoTiff,
} from "./features/terrain-data-provider/geotiff";
import { PerspectiveCamera } from "three";
import { Point } from "./features/terrain-visualizer/view/components/point";
import { transformToTerrainCoordinate } from "./features/terrain-visualizer/utils/transform";
import { getGPXWayPointsFromBlob } from "./features/gpx";

const zugspitzeLatLng = [47.4212154, 10.9852117] as [number, number];

function App() {
  const cameraRef = useRef<PerspectiveCamera>(null);
  const [terrainData, setTerrainData] = useState<GeoTIFFData | null>(null);
  const [gpxPoints, setGpxPoints] = useState<[number, number][] | null>(null);
  const gpxPointsOnTerrain = useMemo(() => {
    if (!gpxPoints?.length || !terrainData) return null;
    const points = gpxPoints.map((pt) =>
      transformToTerrainCoordinate(pt, terrainData)
    );
    debugger;
    return points;
  }, [gpxPoints, terrainData]);
  const onSelectFile = async (file: Blob) => {
    const data = await getHeightMapFromGeoTiff(file);
    setTerrainData(data);
  };
  const onSelectGPXFile = async (file: Blob) => {
    const gpxWaypoints = await getGPXWayPointsFromBlob(file);
    if (gpxWaypoints?.points) {
      setGpxPoints(gpxWaypoints.points.map((pt) => [pt.lat, pt.lon]));
    }
  };

  const zugspitzeCoordinateOnTerrain = terrainData
    ? transformToTerrainCoordinate(zugspitzeLatLng, terrainData)
    : null;
  return (
    <>
      <div className="absolute t-4 l-4 w-24 h-12 rounded-lg z-50">
        <FileUpload onFileSelected={onSelectFile} accept=".tif,.tiff" />
        <FileUpload onFileSelected={onSelectGPXFile} accept=".gpx" />
      </div>
      <Canvas
        className="fixed inset-0 w-screen h-screen"
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
            decay={2} // Controls how the light dims with distance
            distance={100} // Limits the range of the light
            castShadow
          />
        </perspectiveCamera>
        <OrbitControls enableRotate enableZoom enablePan />
        {terrainData && (
          <Terrain
            width={terrainData.width}
            height={terrainData.height}
            heightMap={terrainData.heightmap}
          />
        )}
        {zugspitzeCoordinateOnTerrain && (
          <Point coordinates={zugspitzeCoordinateOnTerrain} color="orange" />
        )}
        {gpxPointsOnTerrain && (
          <Line
            points={gpxPointsOnTerrain as [number, number][]}
            color="blue"
          />
        )}
      </Canvas>
    </>
  );
}

export default App;
