import { createContext, useMemo, useState } from "react";
import { PointProps, RouteProps, VisualizerContextValue } from "../types";

// eslint-disable-next-line react-refresh/only-export-components
export const appContext = createContext<VisualizerContextValue>({
  points: [],
  setPoints: () => {},
  routes: [],
  setRoutes: () => {},
});

/**
 * For demo purpose
 */
const zugspitze: PointProps = {
  id: "zugspitze",
  glowMode: "blink",
  coordinates: [47.4212154, 10.9852117],
  color: "red",
};

const initialContextValue = {
  points: [zugspitze],
  routes: [],
  setPoints: () => {},
  setRoutes: () => {},
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [contextValue, setContextValue] =
    useState<Pick<VisualizerContextValue, "points" | "routes">>(
      initialContextValue
    );
  const setPoints = (points: PointProps[]) =>
    setContextValue((ctx) => ({ ...ctx, points }));
  const setRoutes = (routes: RouteProps[]) =>
    setContextValue((ctx) => ({ ...ctx, routes }));
  const finalContextValue = useMemo(() => {
    return {
      ...contextValue,
      setPoints,
      setRoutes,
    };
  }, [contextValue]);
  return (
    <appContext.Provider value={finalContextValue}>
      {children}
    </appContext.Provider>
  );
};
