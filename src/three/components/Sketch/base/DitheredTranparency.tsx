import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import {
  Group,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  RepeatWrapping,
  Uniform,
  Vector2,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import textureSrc from "@textures/dot-dither-sample.png";
import { useTexture } from "@react-three/drei";
import commonVeretx from "./shader/commonVertex.glsl";
import ditherTextureFragment from "./shader/ditherTexture.glsl";
import noDitherTextureFragment from "./shader/noDitherTexture.glsl";
import { useControls } from "leva";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const DitheredTranparency = () => {
  const ditherTexture = useTexture(textureSrc);
  ditherTexture.wrapS = ditherTexture.wrapT = RepeatWrapping;

  const [isAni, setisAni] = useState(false);

  const uniforms = useMemo(
    () => ({
      uResolution: new Uniform(new Vector2(innerWidth, innerHeight)),
      uTexture: new Uniform(ditherTexture),
      uFactor: new Uniform(1),
    }),
    []
  );

  useControls("Dither", {
    alphaThreshold: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (value) => {
        uniforms.uFactor.value = value;
      },
    },
    animation: {
      value: false,
      onChange: (value) => {
        setisAni(value);
      },
    },
  });

  useGSAP(
    () => {
      gsap.killTweensOf(uniforms.uFactor);
      gsap.set(uniforms.uFactor, {
        value: 1,
      });
      if (!isAni) return;

      gsap.to(uniforms.uFactor, {
        keyframes: [
          { value: 0, duration: 0.9, ease: "power1.inOut" },
          { value: 1, duration: 0.9, ease: "power1.inOut", delay: 0.5 },
        ],
        repeat: -1,
      });
    },
    { dependencies: [isAni] }
  );

  return (
    <>
      <mesh position={[-1, 0, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <ambientLight  />
        <directionalLight position={[6, 4, 5]} />
        <CustomShaderMaterial
          baseMaterial={MeshToonMaterial}
          color={"#ebcc4b"}
          uniforms={uniforms}
          vertexShader={commonVeretx}
          fragmentShader={noDitherTextureFragment}
          silent
        />
      </mesh>

      <mesh position={[1, 0, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <CustomShaderMaterial
          baseMaterial={MeshToonMaterial}
          color={"#61ee61"}
          silent
          uniforms={uniforms}
          vertexShader={commonVeretx}
          fragmentShader={ditherTextureFragment}
        />
      </mesh>
    </>
  );
};

export { DitheredTranparency };
