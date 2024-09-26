import { EffectComposer } from "@react-three/postprocessing";
import { HalfFloatType } from "three";
import { DualBlur } from "../../Effect/DualBlur";
import { useControls } from "leva";

const BlurEffect = () => {
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

  return (
    <>
      <EffectComposer disableNormalPass frameBufferType={HalfFloatType}>
        <DualBlur loopCount={loopCount} blurRange={blurRange} />
      </EffectComposer>
    </>
  );
};

export { BlurEffect };
