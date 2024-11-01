import { EffectWrapper } from "@/hoc/EffectWrapper";
import Kuwahara from "../../Effect/Kuwahara";
import { useControls } from "leva";
import { useGLTF } from "@react-three/drei";
import modelSrc from "@models/plant-optimized.glb";

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

const KuwaharaEffect = () => {
  const props = useControls("Kuwahara", {
    radius: {
      value: 8,
      min: 1,
      max: 25,
      step: 1,
    },
  });

  const Effect = EffectWrapper(Kuwahara, props, Plant);

  return <Effect />;
};

export { KuwaharaEffect };
