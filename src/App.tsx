import { useState } from "react";
import "./App.css";
import { ConnectedTerrainVisualizer } from "./features/app/view/components/connected-terrain-visualizer";
import { AppContextProvider } from "./features/terrain-data-provider/contexts/app-context";
import { GeoTIFFData } from "./features/terrain-data-provider/geotiff";
import { TerrainVisualizerMode } from "./features/terrain-data-provider/types";
import { Toolbar } from "./features/toolbar/view/components/toolbar";

function App() {
  const [terrainData, setTerrainData] = useState<GeoTIFFData | null>(null);
  const [, setMode] = useState<TerrainVisualizerMode>("view");
  return (
    <AppContextProvider>
      <Toolbar
        onTerrainDataSelected={setTerrainData}
        onDraftBoundary={() => setMode("draft-boundary")}
      />
      <ConnectedTerrainVisualizer terrainData={terrainData} />
    </AppContextProvider>
  );
}

export default App;
