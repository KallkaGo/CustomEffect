import { Diffusion } from "../../Effect/Diffusion";
import { useControls } from "leva";
import { EffectWrapper } from "@/hoc/EffectWrapper";
import { BaseScene } from "../base/BaseScene";

const DiffusionEffect = () => {
  const props = useControls("Diffusion", {
    loopCount: {
      value: 5,
      min: 1,
      max: 10,
      step: 1,
    },
    downsample: {
      value: 2,
      min: 1,
      max: 10,
      step: 1,
    },
    threshold: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  const Effect = EffectWrapper(Diffusion, props);

  return (
    <>
      <BaseScene />
      <Effect />
    </>
  );
};

export { DiffusionEffect };
