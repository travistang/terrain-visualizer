import { useContext, useMemo } from "react";
import { appContext } from "../../../terrain-data-provider/contexts/app-context";
import { GeoTIFFData } from "../../../terrain-data-provider/geotiff";
import { TerrainVisualizer } from "../../../terrain-visualizer";

type Props = {
  terrainData: GeoTIFFData | null;
};
export const ConnectedTerrainVisualizer = ({ terrainData }: Props) => {
  const { points, routes } = useContext(appContext);
  const terrainVisualizer = useMemo(() => {
    if (!terrainData) return null;
    return (
      <TerrainVisualizer
        points={points}
        routes={routes}
        terrainData={terrainData}
      />
    );
  }, [points, routes, terrainData]);
  return terrainVisualizer;
};
