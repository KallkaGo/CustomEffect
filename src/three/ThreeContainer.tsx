import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useInteractStore} from "@utils/Store";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Sketch from "./components/Sketch/Sketch";
import { NoToneMapping } from "three";

export default function ThreeContainer() {
  const demand = useInteractStore((state) => state.demand);
  return (
    <>
      <Leva
        theme={{
          sizes: {
            rootWidth: "350px",
          },
        }}
      />
      <Canvas
        frameloop={demand ? "never" : "always"}
        className="webgl"
        dpr={[1, 1.2]}
        camera={{
          fov: 50,
          near: 0.1,
          position: [0, 0, 5],
          far: 10000,
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
