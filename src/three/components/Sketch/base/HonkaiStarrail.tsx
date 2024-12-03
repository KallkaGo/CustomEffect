import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useInteractStore, useLoadedStore } from "@utils/Store";
import { useEffect, useMemo, useRef } from "react";
import {
  Group,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  SRGBColorSpace,
  Uniform,
  Vector3,
  Vector4,
} from "three";
import vertexShader from "./shader/points/vertex.glsl";
import fragmentShader from "./shader/points/fragment.glsl";
import RES from "../../RES";
import { time } from "console";
import { randFloat } from "three/src/math/MathUtils.js";

const NUM_POINTS = 1000;
const POINTS_SEGEMNTS = 1;
const POINTS_VERTICES = (POINTS_SEGEMNTS + 1) * 2;

const createUniforms = (dir: number) =>
  new Uniform([
    new Vector3(7 * dir, 0, 0),
    new Vector3(5.5 * dir, 0, 0),
    new Vector3(3.5 * dir, 0, 0),
    new Vector3(2.5 * dir, 0, 0),
    new Vector3(1.3 * dir, 0 * dir, 0),
    new Vector3(0.7 * dir, 0.7 * dir, 0),
    new Vector3(0, 1 * dir, 0),
    new Vector3(-0.7 * dir, 0.7 * dir, 0),
    new Vector3(-1 * dir, 0, 0),
    new Vector3(-1 * dir, 0, 0),
  ]);

const HonkaiStarrailScene = () => {
  const [diffuseTex, particleTex] = useTexture([
    RES.textures.HonkaiStarrailLogo,
    RES.textures.particle,
  ]);
  diffuseTex.colorSpace = SRGBColorSpace;

  const leftRef = useRef<Mesh>(null);
  const rightRef = useRef<Mesh>(null);

  const geo = useMemo(() => {
    const indices: number[] = [];
    for (let i = 0; i < POINTS_SEGEMNTS; i++) {
      const vi = i * 2;
      indices[i * 12 + 0] = vi + 0;
      indices[i * 12 + 1] = vi + 1;
      indices[i * 12 + 2] = vi + 2;

      indices[i * 12 + 3] = vi + 2;
      indices[i * 12 + 4] = vi + 1;
      indices[i * 12 + 5] = vi + 3;

      const fi = POINTS_VERTICES + vi;
      indices[i * 12 + 6] = fi + 2;
      indices[i * 12 + 7] = fi + 1;
      indices[i * 12 + 8] = fi + 0;

      indices[i * 12 + 9] = fi + 3;
      indices[i * 12 + 10] = fi + 1;
      indices[i * 12 + 11] = fi + 2;
    }

    const geometry = new InstancedBufferGeometry();

    let startArr = new Float32Array(3 * NUM_POINTS),
      endArr = new Float32Array(3 * NUM_POINTS),
      rndArr = new Float32Array(3 * NUM_POINTS);

    for (let i = 0; i < NUM_POINTS; i++) {
      startArr[3 * i] = (Math.random() - 0.5) * 0.5;
      startArr[3 * i + 1] = (Math.random() - 0.5) * 0.25;
      startArr[3 * i + 2] = (Math.random() - 0.5) * 0.25;

      endArr[3 * i] = (Math.random() - 0.5) * 0.5;
      endArr[3 * i + 1] = (Math.random() - 0.5) * 0.25;
      endArr[3 * i + 2] = (Math.random() - 0.5) * 0.25;

      rndArr[3 * i] = 0.15 * Math.random() + 0.1;
      rndArr[3 * i + 1] = randFloat(0, 1);
      rndArr[3 * i + 2] = 0.6 * Math.random() + 0.4;
    }
    geometry.setAttribute("start", new InstancedBufferAttribute(startArr, 3));
    geometry.setAttribute("end", new InstancedBufferAttribute(endArr, 3));
    geometry.setAttribute("rnd", new InstancedBufferAttribute(rndArr, 3));
    geometry.setIndex(indices);
    geometry.instanceCount = NUM_POINTS;

    return geometry;
  }, []);

  const commonuniforms = useMemo(
    () => ({
      pointsParams: new Uniform(new Vector4(POINTS_SEGEMNTS, 0, 0, 0)),
      time: new Uniform(0),
      progress: new Uniform(0),
      ending: new Uniform(0),
      diffuse: new Uniform(particleTex),
    }),
    []
  );

  const leftuniforms = useMemo(
    () => ({
      ...commonuniforms,
      bezierPos: createUniforms(-1),
    }),
    []
  );

  const rightuniforms = useMemo(
    () => ({
      ...commonuniforms,
      bezierPos: createUniforms(1),
    }),
    []
  );

  useEffect(() => {
    const leftPoints = leftRef.current;
    const rightPoints = rightRef.current;

    const leftMat = leftPoints!.material as ShaderMaterial;
    const rightMat = rightPoints!.material as ShaderMaterial;

    leftMat.defines.NUM_SEGMENT = leftMat.uniforms.bezierPos.value.length;
    rightMat.defines.NUM_SEGMENT = rightMat.uniforms.bezierPos.value.length;

    useLoadedStore.setState({ ready: true });
    useInteractStore.setState({ controlEnable: false });
  }, []);

  useFrame((state, delta) => {
    delta %= 1;
    commonuniforms.time.value += delta;
    commonuniforms.progress.value +=
      0.03 * (0.8 - commonuniforms.progress.value);
    console.log("commonuniforms.progress.value", commonuniforms.progress.value);
  });

  return (
    <>
      <mesh visible={true}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial map={diffuseTex} transparent depthWrite={false} />
      </mesh>
      <mesh geometry={geo} ref={leftRef}>
        <shaderMaterial
          uniforms={leftuniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={geo} ref={rightRef}>
        <shaderMaterial
          uniforms={rightuniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

export { HonkaiStarrailScene };
