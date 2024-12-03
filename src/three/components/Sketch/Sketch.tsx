import { OrbitControls } from "@react-three/drei";
import {
  useGameStore,
  useInteractStore,
  useLoadedStore,
  useSceneStore,
} from "@utils/Store";
import { useRef } from "react";
import { useControls } from "leva";
import { DualBlurEffect } from "./items/DualBlurEffect";
import { BloomEffect } from "./items/BloomEffect";
import { GTToneMapping } from "./items/GTToneMapping";
import React from "react";
import { GaussianBlurEffect } from "./items/GaussianBlur";
import { DiffusionEffect } from "./items/Diffusion";
import { RetroEffect } from "./items/RetroEffect";
import { PaintEffect } from "./items/PaintEffect";
import { BaseScene } from "./base/BaseScene";
import { DitheredTransparency } from "./base/DitheredTranparency";
import { DistortionEffect } from "./items/Distortion";
import { useShallow } from "zustand/react/shallow";
import { HonkaiStarrailScene } from "./base/HonkaiStarrail";

const Sketch = () => {
  const { controlDom, controlEnable } = useInteractStore(
    useShallow((state) => ({
      controlEnable: state.controlEnable,
      controlDom: state.controlDom,
    }))
  );
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
        "distortion",
        "honkaiStarrail",
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
    { condition: sceneState.distortion, component: <DistortionEffect /> },
  ];

  return (
    <>
      <OrbitControls domElement={controlDom} enabled={controlEnable} />
      <color attach={"background"} args={["black"]} />

      {sceneState.original && <BaseScene />}
      {sceneState.ditheredTransparency && <DitheredTransparency />}
      {sceneState.honkaiStarrail && <HonkaiStarrailScene />}

      {effects.map(({ condition, component }, index) => {
        return condition ? (
          <React.Fragment key={index}>{component}</React.Fragment>
        ) : null;
      })}
    </>
  );
};

export default Sketch;
