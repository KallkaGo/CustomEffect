import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useInteractStore, useSceneStore } from "@utils/Store";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Sketch from "./components/Sketch/Sketch";
import { NoToneMapping } from "three";

export default function ThreeContainer() {
  const demand = useInteractStore((state) => state.demand);
  return (
    <>
      <Leva />
      <Canvas
        frameloop={demand ? "never" : "always"}
        className="webgl"
        dpr={[1, 2]}
        camera={{
          fov: 50,
          near: 0.1,
          position: [0, 0, 5],
          far: 500,
        }}
        gl={{ toneMapping: NoToneMapping }}
      >
        <Perf position="top-left" />
        <Suspense fallback={null}>
          <Sketch />
        </Suspense>
      </Canvas>
    </>
  );
}
