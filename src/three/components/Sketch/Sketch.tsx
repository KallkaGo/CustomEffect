import { OrbitControls } from "@react-three/drei";
import { useInteractStore, useLoadedStore, useSceneStore } from "@utils/Store";
import { useEffect } from "react";
import { useControls } from "leva";
import { BlurEffect } from "./items/BlurEffect";
import { BloomEffect } from "./items/BloomEffect";
import { GTToneMapping } from "./items/GTToneMapping";

const Sketch = () => {
  const controlDom = useInteractStore((state) => state.controlDom);
  const sceneState = useSceneStore();

  useEffect(() => {
    useLoadedStore.setState({ ready: true });
  }, []);

  useControls("Effect", {
    effect: {
      value: "original",
      options: ["original","blur", "bloom", "gtToneMap"],
      onChange: (value) => {
        const state = useSceneStore.getState();
        for (const key in state) {
          if (key === value) {
            useSceneStore.setState({ [key]: true });
          } else {
            useSceneStore.setState({ [key]: false });
          }
        }
      },
    },
  });

  return (
    <>
      <OrbitControls domElement={controlDom} />
      <color attach={"background"} args={["black"]} />
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#ebcc4b" />
      </mesh>

      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#61ee61" />
      </mesh>

      {sceneState.blur && <BlurEffect />}
      {sceneState.bloom && <BloomEffect />}
      {sceneState.gtToneMap && <GTToneMapping />}
      {sceneState.original && null}
    </>
  );
};

export default Sketch;
