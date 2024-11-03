import { OrbitControls, useGLTF } from "@react-three/drei";
import { useInteractStore, useLoadedStore, useSceneStore } from "@utils/Store";
import { useEffect, useRef } from "react";
import { useControls } from "leva";
import { DualBlurEffect } from "./items/DualBlurEffect";
import { BloomEffect } from "./items/BloomEffect";
import { GTToneMapping } from "./items/GTToneMapping";
import React from "react";
import { Color, Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { GaussianBlurEffect } from "./items/GaussianBlur";
import { DiffusionEffect } from "./items/Diffusion";
import { RetroEffect } from "./items/RetroEffect";
import { PaintEffect } from "./items/PaintEffect";
import { BaseScene } from "./base/BaseScene";
import plantSrc from "@models/plant-optimized.glb";

useGLTF.preload(plantSrc);

const Sketch = () => {
  const controlDom = useInteractStore((state) => state.controlDom);
  const sceneState = useSceneStore();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    useLoadedStore.setState({ ready: true });
  }, []);

  useControls("Effect", {
    effect: {
      value: "original",
      options: [
        "original",
        "dualblur",
        "gaussianblur",
        "diffusion",
        "bloom",
        "gtToneMap",
        "retro",
        "paint",
      ],
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
    { condition: sceneState.dualblur, component: <DualBlurEffect /> },
    { condition: sceneState.gaussianblur, component: <GaussianBlurEffect /> },
    { condition: sceneState.diffusion, component: <DiffusionEffect /> },
    { condition: sceneState.bloom, component: <BloomEffect /> },
    { condition: sceneState.gtToneMap, component: <GTToneMapping /> },
    { condition: sceneState.retro, component: <RetroEffect /> },
    { condition: sceneState.paint, component: <PaintEffect /> },
  ];

  return (
    <>
      <OrbitControls domElement={controlDom} />
      <color attach={"background"} args={["black"]} />

      {sceneState.original && <BaseScene />}

      {effects.map(({ condition, component }, index) => {
        return condition ? (
          <React.Fragment key={index}>{component}</React.Fragment>
        ) : null;
      })}
    </>
  );
};

export default Sketch;
