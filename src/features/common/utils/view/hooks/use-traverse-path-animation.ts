import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Vector3 } from "three";

export type UseTraversePathAnimationProps = {
  waypoints: Vector3[];
  durationMs: number;
  repeat?: boolean;
};
export type UseTraversePathAnimationResult = {
  position: Vector3;
  passedWaypoints: Vector3[];
};
const _vector = new Vector3();
export const useTraversePathAnimation = ({
  waypoints,
  durationMs,
  repeat,
}: UseTraversePathAnimationProps) => {
  const [result, setResult] = useState<UseTraversePathAnimationResult>({
    passedWaypoints: [],
    position: waypoints[0],
  });
  const currentIndex = useRef(0);
  const elapsedTime = useRef(0);
  const durationBetweenPointsMs = useMemo(
    () => (waypoints.length ? durationMs / waypoints.length : 1),
    [durationMs, waypoints]
  );
  useFrame((_, dt) => {
    if (waypoints.length <= 1) return;
    elapsedTime.current += dt;
    if (elapsedTime.current >= durationBetweenPointsMs) {
      elapsedTime.current = 0;
      currentIndex.current += 1;
      if (currentIndex.current > waypoints.length - 1 && repeat) {
        currentIndex.current = 0;
      } else {
        return;
      }
    }
    const currentWaypoint = waypoints[currentIndex.current];
    const nextWaypoint = waypoints[currentIndex.current + 1];
    const nextPosition = _vector.lerpVectors(
      currentWaypoint,
      nextWaypoint,
      elapsedTime.current / durationBetweenPointsMs
    );
    setResult({
      position: nextPosition,
      passedWaypoints: waypoints.slice(0, currentIndex.current),
    });
  });
  return result;
};
