import { Environment, OrbitControls, useFBO } from "@react-three/drei";
import { useInteractStore, useLoadedStore } from "@utils/Store";
import { useEffect, useRef } from "react";
import {
  EffectComposer,
  Bloom as BloomEffect,
} from "@react-three/postprocessing";
import { DualBlur } from "../Effect/DualBlur";
import { useControls } from "leva";
import { Bloom } from "../Effect/Bloom";
import { DirectionalLight, HalfFloatType, UnsignedByteType } from "three";

const Sketch = () => {
  const controlDom = useInteractStore((state) => state.controlDom);

  useEffect(() => {
    useLoadedStore.setState({ ready: true });
  }, []);

  const { loopCount, blurRange } = useControls("DualBlur", {
    loopCount: {
      value: 5,
      min: 1,
      max: 10,
      step: 1,
    },
    blurRange: {
      value: 0,
      min: 0,
      max: 10,
      step: 0.001,
    },
  });

  const {
    intensity,
    radius,
    luminanceThreshold,
    iteration,
    luminanceSmoothing,
    glowColor,
  } = useControls("Bloom", {
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
      value: "white",
    },
  });

  return (
    <>
      <OrbitControls domElement={controlDom} />
      <color attach={"background"} args={["black"]} />
      <mesh>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshBasicMaterial color="#ebcc4b" />
      </mesh>
      <EffectComposer
        disableNormalPass
        frameBufferType={HalfFloatType}
      >
        {/* <DualBlur loopCount={loopCount} blurRange={blurRange} /> */}
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
