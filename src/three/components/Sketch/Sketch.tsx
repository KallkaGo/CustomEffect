import { OrbitControls } from "@react-three/drei";
import { useGameStore, useInteractStore, useSceneStore } from "@utils/Store";
import { useRef, useMemo } from "react";
import { useControls } from "leva";
import DualBlurEffect from "./items/DualBlurEffect";
import BloomEffect from "./items/BloomEffect";
import GTToneMapping from "./items/GTToneMapping";
import GaussianBlurEffect from "./items/GaussianBlur";
import DiffusionEffect from "./items/Diffusion";
import RetroEffect from "./items/RetroEffect";
import PaintEffect from "./items/PaintEffect";
import { BaseScene } from "./base/BaseScene";
import { DitheredTransparency } from "./base/DitheredTranparency";
import DistortionEffect from "./items/Distortion";
import { useShallow } from "zustand/react/shallow";
import { HonkaiStarrailScene } from "./base/HonkaiStarrail";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const EFFECT_MAP = [
  { key: "dualblur", Component: DualBlurEffect },
  { key: "gaussianblur", Component: GaussianBlurEffect },
  { key: "diffusion", Component: DiffusionEffect },
  { key: "bloom", Component: BloomEffect },
  { key: "gtToneMap", Component: GTToneMapping },
  { key: "retro", Component: RetroEffect },
  { key: "paint", Component: PaintEffect },
  { key: "distortion", Component: DistortionEffect },
];

const Sketch = () => {
  const { controlDom, controlEnable } = useInteractStore(
    useShallow((state) => ({
      controlEnable: state.controlEnable,
      controlDom: state.controlDom,
    }))
  );

  const sceneState = useSceneStore();
  const initiale = useRef(true);
  const OrbitControlsRef = useRef<OrbitControlsImpl>(null);

  useControls("Effect", {
    effect: {
      value: "original",
      options: [...Object.keys(sceneState)],
      onChange: (value) => {
        if (initiale.current) {
          initiale.current = false;
          return;
        }
        useGameStore.setState({ transfer: true });
        useInteractStore.setState({ sliderPos: 0.5 });

        useSceneStore.setState(
          Object.fromEntries(
            Object.keys(sceneState).map((key) => [key, key === value])
          )
        );

        OrbitControlsRef.current?.reset();
      },
    },
  });

  const activeEffects = useMemo(() => {
    return EFFECT_MAP.filter(
      ({ key }) => sceneState[key as keyof typeof sceneState]
    ).map(({ Component }, index) => <Component key={index} />);
  }, [sceneState]);

  return (
    <>
      <OrbitControls
        domElement={controlDom}
        enabled={controlEnable}
        ref={OrbitControlsRef}
      />
      <color attach={"background"} args={["black"]} />

      {sceneState.original && <BaseScene />}
      {sceneState.ditheredTransparency && <DitheredTransparency />}
      {sceneState.honkaiStarrail && <HonkaiStarrailScene />}

      {activeEffects}
    </>
  );
};

export default Sketch;
