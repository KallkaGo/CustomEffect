import { Diffusion } from "../../Effect/Diffusion";
import { useControls } from "leva";
import { EffectWrapper } from "@/hoc/EffectWrapper";
import { BaseScene } from "../base/BaseScene";
import { SceneLifecycle } from "@/hoc/SceneLifecycle";

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
  });

  const Effect = EffectWrapper([
    {
      component: Diffusion,
      props,
    },
  ]);

  return (
    <>
      <BaseScene />
      <Effect />
    </>
  );
};

export default SceneLifecycle(DiffusionEffect);
