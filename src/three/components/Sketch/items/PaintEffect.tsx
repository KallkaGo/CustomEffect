import { EffectWrapper } from "@/hoc/EffectWrapper";
import Kuwahara from "../../Effect/Kuwahara";
import { useControls } from "leva";
import { useGLTF, useTexture } from "@react-three/drei";
import modelSrc from "@models/plant-optimized.glb";
import textureSrc from "@textures/waterColor.png";
import QuantizationAndToneMap from "../../Effect/QuantizationAndToneMap";
import { SMAA } from "@react-three/postprocessing";
import { EdgeDetectionMode, SMAAPreset } from "postprocessing";

const Plant = () => {
  const { scene } = useGLTF(modelSrc);

  return (
    <>
      <color attach="background" args={["#3386E0"]} />
      <group rotation={[0, 0, 0]} position={[0, -1.5, 0]} scale={1.5}>
        <primitive object={scene} />
        <ambientLight intensity={1.25} />
        <directionalLight position={[15, 10, -5.95]} intensity={5.0} />
      </group>
    </>
  );
};

const PaintEffect = () => {
  const tex = useTexture(textureSrc);

  const kuawaharaProps = useControls("Kuwahara", {
    radius: {
      value: 5,
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
