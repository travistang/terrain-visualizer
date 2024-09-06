import { Canvas } from "@react-three/fiber";
import { Terrain } from "./features/terrain-visualizer/view/components/terrain";

import { ArcballControls, FlyControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { PerspectiveCamera } from "three";
import "./App.css";
import { getGPXWayPointsFromBlob } from "./features/gpx";
import { GPXRoute } from "./features/gpx/view/gpx-route";
import {
  GeoTIFFData,
  getHeightMapFromGeoTiff,
} from "./features/terrain-data-provider/geotiff";
import { FileUpload } from "./features/terrain-data-provider/view/components/file-upload";
import { Point } from "./features/terrain-visualizer/view/components/point";

const zugspitzeLatLng = [47.4212154, 10.9852117] as [number, number];
const alpspitzeLatLng = [47.4294968, 11.0478118] as [number, number];

function App() {
  const cameraRef = useRef<PerspectiveCamera>(null);
  const [terrainData, setTerrainData] = useState<GeoTIFFData | null>(null);
  const [gpxPoints, setGpxPoints] = useState<[number, number][] | null>(null);
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
        <FlyControls movementSpeed={5} dragToLook />
        <ArcballControls enableAnimations />
        {terrainData && (
          <>
            <Terrain
              width={terrainData.width}
              height={terrainData.height}
              heightMap={terrainData.heightmap}
            />
            <Point
              terrainData={terrainData}
              coordinates={zugspitzeLatLng}
              color="orange"
              label="Zugspitze"
            />
            <Point
              terrainData={terrainData}
              coordinates={alpspitzeLatLng}
              color="green"
              label="Alpspitze"
            />
            <Point
              terrainData={terrainData}
              coordinates={[47.421667, 11.034722]}
              color="red"
              label="Vollkarspitze"
            />
            {gpxPoints && (
              <GPXRoute
                style="traveling-dot"
                route={gpxPoints}
                terrainData={terrainData}
                color="#329ed1"
              />
            )}
          </>
        )}
      </Canvas>
    </>
  );
}

export default App;
