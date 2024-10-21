import OrderedDithering from "../../Effect/OrderedDithering";
import { useControls } from "leva";
import { EffectWrapper } from "@/hoc/EffectWrapper";

const OrderedDitheringEffect = () => {
  const props = useControls("dither", {
    colorNum: {
      value: 4,
      min: 2,
      max: 16,
      step: 1,
    },
  });

  const Effect = EffectWrapper(OrderedDithering, props);

  return <Effect />;
};

export { OrderedDitheringEffect };
