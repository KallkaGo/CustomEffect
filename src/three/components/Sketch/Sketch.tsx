import { OrbitControls } from "@react-three/drei";
import { useInteractStore, useLoadedStore, useSceneStore } from "@utils/Store";
import { useEffect, useRef } from "react";
import { useControls } from "leva";
import { BlurEffect } from "./items/BlurEffect";
import { BloomEffect } from "./items/BloomEffect";
import { GTToneMapping } from "./items/GTToneMapping";
import React from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

const Sketch = () => {
  const controlDom = useInteractStore((state) => state.controlDom);
  const sceneState = useSceneStore();

  const groupRef = useRef<Group>(null);

  useEffect(() => {
    useLoadedStore.setState({ ready: true });
  }, []);

  useControls("Effect", {
    effect: {
      value: "original",
      options: ["original", "blur", "bloom", "gtToneMap"],
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

  const effects = [
    { condition: sceneState.blur, component: <BlurEffect /> },
    { condition: sceneState.bloom, component: <BloomEffect /> },
    { condition: sceneState.gtToneMap, component: <GTToneMapping /> },
  ];

  useFrame((state, delta) => {
    delta %= 1;
    groupRef.current!.rotation.y += delta;
  });

  return (
    <>
      <OrbitControls domElement={controlDom} />
      <color attach={"background"} args={["black"]} />

      <group ref={groupRef}>
        <mesh position={[-1, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color="#ebcc4b" />
        </mesh>

        <mesh position={[1, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color="#61ee61" />
        </mesh>
      </group>

      {effects.map(({ condition, component }, index) => {
        return condition ? (
          <React.Fragment key={index}>{component}</React.Fragment>
        ) : null;
      })}
    </>
  );
};

export default Sketch;
