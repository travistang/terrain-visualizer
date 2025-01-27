import { createContext } from "react";
import { GeoTIFFData } from "../../../terrain-data-provider/geotiff";

export const terrainDataContext = createContext<GeoTIFFData>({
  heightmap: [],
  width: 100,
  height: 100,
  boundingBox: [0, 0, 0, 0],
});

export const TerrainDataContext = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: GeoTIFFData;
}) => {
  return (
    <terrainDataContext.Provider value={data}>
      {children}
    </terrainDataContext.Provider>
  );
};
