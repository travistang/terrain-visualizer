import { useContext, useRef } from "react";
import { FaDrawPolygon, FaMap, FaRoute } from "react-icons/fa";
import { getGPXWayPointsFromBlob } from "../../../gpx";
import { appContext } from "../../../terrain-data-provider/contexts/app-context";
import {
  GeoTIFFData,
  getHeightMapFromGeoTiff,
} from "../../../terrain-data-provider/geotiff";
import { ToolbarItem } from "./toolbar-item";

type Props = {
  onTerrainDataSelected?: (data: GeoTIFFData) => void;
  onDraftBoundary?: () => void;
};
export const Toolbar = ({ onTerrainDataSelected, onDraftBoundary }: Props) => {
  const { setRoutes } = useContext(appContext);
  const geoDataInputRef = useRef<HTMLInputElement>(null);
  const routeInputRef = useRef<HTMLInputElement>(null);
  const onSelectFile = async (file: Blob) => {
    const data = await getHeightMapFromGeoTiff(file);
    onTerrainDataSelected?.(data);
  };
  const onSelectGPXFile = async (file: Blob) => {
    const gpxWaypoints = await getGPXWayPointsFromBlob(file);
    if (gpxWaypoints?.points) {
      setRoutes([
        {
          route: gpxWaypoints.points.map((pt) => [pt.lat, pt.lon]),
          color: "yellow",
          id: "route",
        },
      ]);
    }
  };

  return (
    <div className="fixed flex flex-col gap-2 items-stretch p-1 z-50 rounded-lg top-2 left-2">
      <input
        onChange={(e) => e.target.files?.[0] && onSelectFile(e.target.files[0])}
        className="hidden opacity-0"
        type="file"
        accept=".tif,.tiff"
        ref={geoDataInputRef}
      />
      <input
        onChange={(e) =>
          e.target.files?.[0] && onSelectGPXFile(e.target.files[0])
        }
        className="hidden opacity-0"
        type="file"
        accept=".gpx"
        ref={routeInputRef}
      />
      <ToolbarItem
        icon={FaMap}
        className="h-10 w-10"
        onClick={() => geoDataInputRef.current?.click()}
      />
      <ToolbarItem
        icon={FaRoute}
        className="h-10 w-10"
        onClick={() => routeInputRef.current?.click()}
      />
      <ToolbarItem
        icon={FaDrawPolygon}
        className="h-10 w-10"
        onClick={onDraftBoundary}
      />
    </div>
  );
};
