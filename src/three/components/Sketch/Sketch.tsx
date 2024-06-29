import { OrbitControls, useFBO } from "@react-three/drei";
import { useInteractStore, useLoadedStore } from "@utils/Store";
import { useEffect, useRef } from "react";
import { EffectComposer } from "@react-three/postprocessing";
import { DualBlur } from "../Effect/DualBlur";
import { useControls } from "leva";
import { Bloom } from "../Effect/Bloom";

useFBO;

const Sketch = () => {
  const controlDom = useInteractStore((state) => state.controlDom);

  useEffect(() => {
    useLoadedStore.setState({ ready: true });
  }, []);

  const { loopCount } = useControls("DualBlur", {
    loopCount: {
      value: 5,
      min: 1,
      max: 10,
      step: 1,
    },
  });

  const { intensity, radius, luminanceThreshold, iteration,luminanceSmoothing,glowColor } = useControls(
    "Bloom",
    {
      intensity: {
        value: 1,
        min: 0,
        max: 10,
        step: 0.01,
      },
      radius: {
        value: 1,
        min: 0,
        max: 10,
        step: 0.01,
      },
      luminanceThreshold: {
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.01,
      },
      luminanceSmoothing: {
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.01,
      },
      iteration: {
        value: 4,
        min: 1,
        max: 10,
        step: 1,
      },
      glowColor: {
        value:'white'
      }
    }
  );

  return (
    <>
      <OrbitControls domElement={controlDom} />
      <color attach={"background"} args={["black"]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="hotpink" />
      </mesh>
      <EffectComposer disableNormalPass>
        {/* <DualBlur loopCount={loopCount} /> */}
        <Bloom 
        intensity={intensity}
        radius={radius}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        glowColor={glowColor}
        iteration={iteration}
        />
      </EffectComposer>
    </>
  );
};

export default Sketch;
