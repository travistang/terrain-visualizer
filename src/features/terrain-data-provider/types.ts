export type GlowMode = "none" | "constant" | "blink";
export type LatLng = [number, number];

export type PointProps = {
  id: string;
  glowMode?: GlowMode;
  coordinates: LatLng;
  size?: number;
  color: string;
  label?: string;
};

export type RouteStyle = "static" | "traveling-dot";
export type RouteProps = {
  id: string;
  route: LatLng[];
  style?: RouteStyle;
  color: string;
};

export type VisualizerContextValue = {
  points: PointProps[];
  setPoints: (points: PointProps[]) => void;
  routes: RouteProps[];
  setRoutes: (points: RouteProps[]) => void;
};

export type TerrainVisualizerMode = "view" | "draft-boundary" | "mark-points";
export type VisualizerControlContextValue = {
  mode: TerrainVisualizerMode;
  setMode: (mode: TerrainVisualizerMode) => void;
};
