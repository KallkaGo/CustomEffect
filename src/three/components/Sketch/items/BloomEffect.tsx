import { Bloom } from "../../Effect/Bloom";
import { useControls } from "leva";
import { EffectWrapper } from "@/hoc/EffectWrapper";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Group, Vector3 } from "three";
import { ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Lifecycle } from "@/hoc/LifeCycle";

const ROW = new Array(5).fill(0);
const COLUMN = new Array(3).fill(0);
// const colors = ["hsl(48.375, 80%, 65%)", "hsl(164.91803278688525, 86.7298578199052%, 70%)", "hsl(120, 80.57142857142857%, 70%)"];

const colors = [
  { h: 45.375 / 360, s: 0.8, l: 0.6 }, // HSL 色彩 (H 为 0~1 范围)
  { h: 164.91803278688525 / 360, s: 0.87, l: 0.6 },
  { h: 120 / 360, s: 0.8057, l: 0.6 },
];

const BloomEffect = () => {
  const props = useControls("Bloom", {
    intensity: {
      value: 4.22,
      min: 0,
      max: 10,
      step: 0.01,
    },
    radius: {
      value: 1,
      min: 0,
      max: 10,
      step: 0.01,
    },
    luminanceThreshold: {
      value: 0.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    luminanceSmoothing: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    iteration: {
      value: 7,
      min: 1,
      max: 10,
      step: 1,
    },
    glowColor: {
      value: "white",
    },
    rotate: {
      value: false,
    },
  });
  const camera = useThree((state) => state.camera);
  const groupRef = useRef<Group>(null);

  const Effect = EffectWrapper([
    {
      component: Bloom,
      props,
    },
    {
      component: ToneMapping,
      props: {
        mode: ToneMappingMode.ACES_FILMIC,
      },
    },
  ]);

  useEffect(() => {
    camera.position.set(-12, 12, 12);
    return () => {
      camera.position.set(0, 0, 5);
    };
  }, []);

  useFrame((state, delta) => {
    delta %= 1;
    const group = groupRef.current;
    if (props.rotate) group!.rotation.y += delta * 0.2;
  });

  return (
    <>
      <group ref={groupRef}>
        <group position={[-4, 0, 6]}>
          {ROW.map((_, i) =>
            COLUMN.map((_, j) => {
              const curSize = 0.15 * (i * 2 + 1);
              const lightness = Math.max(0.1, colors[j].l - i * 0.1);
              const color = new Color().setHSL(
                colors[j].h,
                colors[j].s,
                lightness
              );
              return (
                <mesh key={`${i}-${j}`} position={[j * 4, 0, -i * 4]}>
                  <boxGeometry args={[curSize, curSize, curSize, 1, 1, 1]} />
                  <meshBasicMaterial color={color} />
                </mesh>
              );
            })
          )}
        </group>
      </group>
      <Effect />
    </>
  );
};

export default Lifecycle(BloomEffect);
