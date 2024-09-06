import { Line, Point } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo } from "react";
import { getGPXLineCoordinatesOnTerrain } from "..";
import { useTraversePathAnimation } from "../../common/utils/view/hooks/use-traverse-path-animation";
import { GeoTIFFData } from "../../terrain-data-provider/geotiff";
import { LatLng } from "../../terrain-visualizer/types";

export type RouteStyle = "static" | "traveling-dot";
type Props = {
  route: LatLng[];
  terrainData: GeoTIFFData;
  style?: RouteStyle;
  color: string;
};
export const GPXRoute = ({
  color,
  style = "static",
  route,
  terrainData,
}: Props) => {
  const segments = useMemo(() => {
    if (route.length <= 1 || !terrainData) return null;
    const coordinatesOnTerrain = getGPXLineCoordinatesOnTerrain(
      route,
      terrainData
    );

    return coordinatesOnTerrain;
  }, [terrainData, route]);
  const { position: travelingDotPosition } = useTraversePathAnimation({
    waypoints: segments?.flat() ?? [],
    durationMs: 1000,
    repeat: true,
  });

  return (
    <>
      {segments?.map((segment, i) => (
        <>
          {style === "traveling-dot" && (
            <Point position={travelingDotPosition} color={color} />
          )}
          <Line
            lineWidth={5}
            points={segment}
            key={i}
            color={color}
            transparent={true}
            opacity={1}
          />
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.0} // Minimum luminance for bloom effect
              luminanceSmoothing={0.9} // Smoothing of luminance
              intensity={10} // Intensity of the bloom effect
            />
          </EffectComposer>
        </>
      ))}
    </>
  );
};
