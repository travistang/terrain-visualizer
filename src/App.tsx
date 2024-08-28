import { generateHeightMap } from "./features/terrain-generator";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Terrain } from "./features/terrain-visualizer/view/components/terrain";

import "./App.css";

const heightMap = generateHeightMap(256, 256);
function App() {
  return (
    <Canvas className="fixed inset-0 w-screen h-screen">
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
      <spotLight
        position={[10, 20, 10]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <OrbitControls />
      <Terrain width={256} height={256} heightMap={heightMap} />
    </Canvas>
  );
}

export default App;
