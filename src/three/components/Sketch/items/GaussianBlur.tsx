import { GaussianBlur } from "../../Effect/GaussianBlur";
import { useControls } from "leva";
import { EffectWrapper } from "@/hoc/EffectWrapper";
import { BaseScene } from "../base/BaseScene";

const GaussianBlurEffect = () => {
  const props = useControls("GaussianBlur", {
    loopCount: {
      value: 5,
      min: 1,
      max: 10,
      step: 1,
    },
    downsample: {
      value: 1,
      min: 1,
      max: 10,
      step: 1,
    },
  });

  const Effect = EffectWrapper([{
    component: GaussianBlur,
    props,
  }]);

  return (
    <>
      <BaseScene />
      <Effect />
    </>
  );
};

export { GaussianBlurEffect };
