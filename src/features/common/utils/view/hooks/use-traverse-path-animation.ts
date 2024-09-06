import { useSpring } from "@react-spring/web";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

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
export function useTrajectory(
  ref: React.MutableRefObject<Mesh | null>,
  points: Vector3[],
  durationMs: number
) {
  const numPoints = points.length;

  const { t } = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    loop: true,
    config: { duration: durationMs },
  });

  const getPointOnTrajectory = (t: number) => {
    const progressOnIndex = t * (numPoints - 1);
    const segmentIndex = Math.floor(progressOnIndex);
    const nextIndex = (segmentIndex + 1) % numPoints;

    const pointA = points[segmentIndex];
    const pointB = points[nextIndex];

    const localT = progressOnIndex - segmentIndex;

    return _vector.lerpVectors(pointA, pointB, localT);
  };

  useFrame(() => {
    if (!ref?.current) return;
    const position = t.to(getPointOnTrajectory).get();
    ref.current.position.copy(position);
  });
}
