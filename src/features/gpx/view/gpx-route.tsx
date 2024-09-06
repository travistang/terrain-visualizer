import { Line } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import { Mesh } from "three";
import { getGPXLineCoordinatesOnTerrain } from "..";
import { useTrajectory } from "../../common/utils/view/hooks/use-traverse-path-animation";
import { Ball } from "../../common/utils/view/maps/ball";
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
  const ballRef = useRef<Mesh>(null);
  const segments = useMemo(() => {
    if (route.length <= 1 || !terrainData) return null;
    const coordinatesOnTerrain = getGPXLineCoordinatesOnTerrain(
      route,
      terrainData
    );

    return coordinatesOnTerrain;
  }, [terrainData, route]);
  useTrajectory(ballRef, segments?.flat() ?? [], 10000);
  return (
    <>
      {segments?.map((segment, i) => (
        <>
          {style === "traveling-dot" && (
            <Ball
              ballRef={ballRef}
              glowMode="constant"
              color={color}
              size={0.05}
            />
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
