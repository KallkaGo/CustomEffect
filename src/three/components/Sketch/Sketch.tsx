import { OrbitControls, useFBO } from "@react-three/drei";
import { useInteractStore, useLoadedStore } from "@utils/Store";
import { useEffect, useRef } from "react";
import { EffectComposer } from "@react-three/postprocessing";
import { DualBlur } from "../Effect/DualBlur";
import { useControls } from "leva";

useFBO

const Sketch = () => {
  const controlDom = useInteractStore((state) => state.controlDom);

  useEffect(() => {
    useLoadedStore.setState({ ready: true });
  }, []);

  const { loopCount } = useControls("DualBlur", {
    loopCount: {
      value: 5,
      min: 1,
      max: 10,
      step: 1,
    },
  });

  return (
    <>
      <OrbitControls domElement={controlDom} />
      <color attach={"background"} args={["black"]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="hotpink" />
      </mesh>
      <EffectComposer disableNormalPass >
        <DualBlur loopCount={loopCount} />
      </EffectComposer>
    </>
  );
};

export default Sketch;
