import { GaussianBlur } from "../../Effect/GaussianBlur";
import { useControls } from "leva";
import { EffectWrapper } from "@/hoc/EffectWrapper";

const GaussianBlurEffect = () => {
  const props = useControls("GaussianBlur", {
    loopCount: {
      value: 5,
      min: 1,
      max: 10,
      step: 1,
    },
  });

  const Effect = EffectWrapper(GaussianBlur, props);

  return <Effect />;
};

export { GaussianBlurEffect };
