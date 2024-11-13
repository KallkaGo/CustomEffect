import { EffectWrapper } from "@/hoc/EffectWrapper";
import Kuwahara from "../../Effect/Kuwahara";
import { useControls } from "leva";
import { useGLTF, useTexture } from "@react-three/drei";
import modelSrc from "@models/greenhouse_opt.glb";
import textureSrc from "@textures/waterColor.png";
import QuantizationAndToneMap from "../../Effect/QuantizationAndToneMap";
import { SMAA } from "@react-three/postprocessing";
import { EdgeDetectionMode, SMAAPreset } from "postprocessing";
import useKTX2Loader from "@utils/useKTX2Loader";

const Plant = () => {
  const { scene } = useKTX2Loader(modelSrc, false, true);

  return (
    <>
      <color attach="background" args={["#3386E0"]} />
      <group rotation={[0, 0, 0]} scale={0.2}>
        <primitive object={scene} />
      </group>
    </>
  );
};

const PaintEffect = () => {
  const tex = useTexture(textureSrc);

  const kuawaharaProps = useControls("Kuwahara", {
    radius: {
      value: 2,
      min: 1,
      max: 25,
      step: 1,
    },
  });

  const qtProps = useControls("QuantizationAndToneMap", {
    adjustment: {
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.1,
    },
  });

  const antiAliasingprops = useControls("SMAA", {
    preset: {
      value: SMAAPreset.MEDIUM,
      options: SMAAPreset,
    },
    edgeDetectionMode: {
      value: EdgeDetectionMode.COLOR,
      options: EdgeDetectionMode,
    },
  });

  const Effect = EffectWrapper([
    {
      component: Kuwahara,
      props: kuawaharaProps,
    },
    {
      component: QuantizationAndToneMap,
      props: {
        ...qtProps,
        tex,
      },
    },
    {
      component: SMAA,
      props: antiAliasingprops,
    },
  ]);

  return (
    <>
      <Plant />
      <Effect />
    </>
  );
};

export { PaintEffect };
