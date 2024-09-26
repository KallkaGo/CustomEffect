import { EffectComposer } from "@react-three/postprocessing";
import { HalfFloatType } from "three";
import { Bloom } from "../../Effect/Bloom";
import { useControls } from "leva";

const BloomEffect = () => {
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
      value: 7,
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
      <EffectComposer disableNormalPass frameBufferType={HalfFloatType}>
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

export { BloomEffect };
