import { EffectWrapper } from "@/hoc/EffectWrapper";
import Kuwahara from "../../Effect/Kuwahara";
import { useControls } from "leva";
import { useGLTF, useTexture } from "@react-three/drei";
import Assets from "../../RES";
import textureSrc from "@textures/waterColor.png";
import QuantizationAndToneMap from "../../Effect/QuantizationAndToneMap";
import { SMAA } from "@react-three/postprocessing";
import { EdgeDetectionMode, SMAAPreset } from "postprocessing";
import { useKTX2Loader } from "@utils/useKTX2Loader";
import { useMemo } from "react";

const Model = ({ modelSrc }: { modelSrc: string }) => {
  const gltf = useKTX2Loader(modelSrc, false, true);

  const modelName = useMemo(() => {
    if (modelSrc === Assets.models.plant) {
      return "plant";
    }
    return "greenHouse";
  }, [modelSrc]);

  return (
    <>
      <color attach="background" args={["#3386E0"]} />
      <ambientLight />
      <directionalLight position={[6, 4, 5]} />
      <group
        rotation={[0, 0, 0]}
        position={modelName === "plant" ? [0, -1, 0] : [0, -0.5, 0]}
        scale={modelName === "plant" ? 0.7 : 0.2}
      >
        <primitive object={gltf.scene} />
      </group>
    </>
  );
};

const PaintEffect = () => {
  const tex = useTexture(textureSrc);

  const modelProps = useControls("model", {
    url: {
      value: Assets.models.greenHouse,
      options: {
        plant: Assets.models.plant,
        greenHouse: Assets.models.greenHouse,
      },
    },
  });

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
      labelL: "saturating",
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
      <Model modelSrc={modelProps.url} />
      <Effect />
    </>
  );
};

export { PaintEffect };
