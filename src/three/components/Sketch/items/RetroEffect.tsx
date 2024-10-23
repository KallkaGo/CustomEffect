import Retro from "../../Effect/Retro";
import { useControls } from "leva";
import { EffectWrapper } from "@/hoc/EffectWrapper";

const RetroEffect = () => {
  const props = useControls("Retro", {
    maskIntensity: {
      value: 0.8,
      min: 0.0,
      max: 1.0,
    },
    colorNum: {
      value: "16.0",
      options: ["2.0", "4.0", "8.0", "16.0"],
    },
    pixelSize: {
      value: "4.0",
      options: ["4.0", "8.0", "16.0", "32.0"],
    },
    curveIntensity: {
      value: 0.3,
      min: 0.0,
      max: 0.5,
    },
  });

  const Effect = EffectWrapper(Retro, props);

  return <Effect />;
};

export { RetroEffect };
