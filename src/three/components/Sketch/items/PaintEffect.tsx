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
import { GLTF } from "three-stdlib";
import RES from "../../RES";

const url = [RES.models.plant, RES.models.greenHouse];

const Model = ({ modelName }: { modelName: string }) => {
  const [plant, greenHouse] = useKTX2Loader(url, false, true) as GLTF[];

  const scene = useMemo(() => {
    if (modelName === "plant") {
      return plant.scene;
    } else {
      return greenHouse.scene;
    }
  }, [modelName]);

  return (
    <>
      <color attach="background" args={["#3386E0"]} />
      <group
        rotation={[0, 0, 0]}
        position={modelName === "plant" ? [0, -1, 0] : [0, -0.5, 0]}
        scale={modelName === "plant" ? 0.7 : 0.2}
      >
        <primitive object={scene} />
      </group>
    </>
  );
};

const PaintEffect = () => {
  const tex = useTexture(textureSrc);

  const modelProps = useControls("model", {
    url: {
      value: "plant",
      options: {
        plant: "plant",
        greenHouse: "greenHouse",
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
      <Model modelName={modelProps.url} />
      <Effect />
    </>
  );
};

export { PaintEffect };
