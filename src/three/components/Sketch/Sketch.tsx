import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import {
  useGameStore,
  useInteractStore,
  useLoadedStore,
  useSceneStore,
} from "@utils/Store";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useControls } from "leva";
import { DualBlurEffect } from "./items/DualBlurEffect";
import { BloomEffect } from "./items/BloomEffect";
import { GTToneMapping } from "./items/GTToneMapping";
import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { GaussianBlurEffect } from "./items/GaussianBlur";
import { DiffusionEffect } from "./items/Diffusion";
import { RetroEffect } from "./items/RetroEffect";
import { PaintEffect } from "./items/PaintEffect";
import { BaseScene } from "./base/BaseScene";
import { DitheredTranparency } from "./base/DitheredTranparency";



const Sketch = () => {
  const controlDom = useInteractStore((state) => state.controlDom);
  const sceneState = useSceneStore();
  const initiale = useRef(true);

  useControls("Effect", {
    effect: {
      value: "original",
      options: [
        "original",
        "ditheredTransparency",
        "dualblur",
        "gaussianblur",
        "diffusion",
        "bloom",
        "gtToneMap",
        "retro",
        "paint",
      ],
      onChange: (value) => {
        if (initiale.current) {
          initiale.current = false;
          return;
        }
        useGameStore.setState({ transfer: true });
        useInteractStore.setState({ sliderPos: 0.5 });
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
      {sceneState.ditheredTransparency && <DitheredTranparency />}

      {effects.map(({ condition, component }, index) => {
        return condition ? (
          <React.Fragment key={index}>{component}</React.Fragment>
        ) : null;
      })}
    </>
  );
};

export default Sketch;
