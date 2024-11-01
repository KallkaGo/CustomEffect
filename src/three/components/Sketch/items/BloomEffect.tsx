import { Bloom } from "../../Effect/Bloom";
import { useControls } from "leva";
import { EffectWrapper } from "@/hoc/EffectWrapper";
import { BaseScene } from "../base/BaseScene";

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

  const Effect = EffectWrapper(Bloom, {
    intensity,
    radius,
    luminanceThreshold,
    iteration,
    luminanceSmoothing,
    glowColor,
  });

  return (
    <>
      <BaseScene />
      <Effect />
    </>
  );
};

export { BloomEffect };
