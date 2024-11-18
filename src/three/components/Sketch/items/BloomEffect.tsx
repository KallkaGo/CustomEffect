import { Bloom } from "../../Effect/Bloom";
import { useControls } from "leva";
import { EffectWrapper } from "@/hoc/EffectWrapper";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";

const ROW = new Array(5).fill(0);
const COLUMN = new Array(3).fill(0);
const colors = ["#ebcc4b", "#3af1c4", "#61ee61"];

const BloomEffect = () => {
  const props = useControls("Bloom", {
    intensity: {
      value: 1,
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
      value: 0.1,
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
  ]);

  useEffect(() => {
    camera.position.set(-12, 8, 10);
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
              const curSize = 0.2 * (i + 1);
              return (
                <mesh key={`${i}-${j}`} position={[j * 4, 0, -i * 3]}>
                  <boxGeometry args={[curSize, curSize, curSize]} />
                  <meshBasicMaterial color={colors[j]} />
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

export { BloomEffect };
