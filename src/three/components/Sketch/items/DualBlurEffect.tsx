import { DualBlur } from "../../Effect/DualBlur";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { EffectWrapper } from "@/hoc/EffectWrapper";
import { BaseScene } from "../base/BaseScene";

const DualBlurEffect = () => {
  const props = useControls("DualBlur", {
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

  const Effect = EffectWrapper(DualBlur, props);

  return (
    <>
      <BaseScene />
      <Effect />
    </>
  )
};

export { DualBlurEffect };
