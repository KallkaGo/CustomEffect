import type {
  Mesh,
  ShaderMaterial,
} from 'three'
import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useInteractStore, useLoadedStore } from '@utils/Store'
import gsap from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Sphere,
  SRGBColorSpace,
  Uniform,
  Vector3,
  Vector4,
} from 'three'
import { randFloat } from 'three/src/math/MathUtils.js'
import { useShallow } from 'zustand/react/shallow'
import RES from '../../RES'
import fragmentShader from './shader/points/fragment.glsl'
import vertexShader from './shader/points/vertex.glsl'

const NUM_POINTS = 1000
const POINTS_SEGEMNTS = 1
const POINTS_VERTICES = (POINTS_SEGEMNTS + 1) * 2

function getBezierPos(dir: number) {
  return [
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
  ]
}

const berzierPos = {
  left: getBezierPos(-1),
  right: getBezierPos(1),
}

function HonkaiStarrailScene() {
  const [diffuseTex, particleTex] = useTexture([
    RES.textures.HonkaiStarrailLogo,
    RES.textures.particle,
  ])
  diffuseTex.colorSpace = SRGBColorSpace
  particleTex.colorSpace = SRGBColorSpace

  const leftRef = useRef<Mesh>(null)
  const rightRef = useRef<Mesh>(null)
  const logoRef = useRef<Mesh>(null)
  const baseParams = useRef({
    time: 0,
  })

  const { camera, gl } = useThree(
    useShallow(state => ({
      camera: state.camera,
      gl: state.gl,
    })),
  )

  const geo = useMemo(() => {
    const indices: number[] = []
    for (let i = 0; i < POINTS_SEGEMNTS; i++) {
      const vi = i * 2
      indices[i * 12 + 0] = vi + 0
      indices[i * 12 + 1] = vi + 1
      indices[i * 12 + 2] = vi + 2

      indices[i * 12 + 3] = vi + 2
      indices[i * 12 + 4] = vi + 1
      indices[i * 12 + 5] = vi + 3

      /* Back Side  */
      // no need
      // const fi = POINTS_VERTICES + vi
      // indices[i * 12 + 6] = fi + 2
      // indices[i * 12 + 7] = fi + 1
      // indices[i * 12 + 8] = fi + 0

      // indices[i * 12 + 9] = fi + 3
      // indices[i * 12 + 10] = fi + 1
      // indices[i * 12 + 11] = fi + 2
    }

    const geometry = new InstancedBufferGeometry()

    const startArr = new Float32Array(3 * NUM_POINTS)
    const endArr = new Float32Array(3 * NUM_POINTS)
    const rndArr = new Float32Array(3 * NUM_POINTS)

    for (let i = 0; i < NUM_POINTS; i++) {
      startArr[3 * i] = (Math.random() - 0.5) * 0.5
      startArr[3 * i + 1] = (Math.random() - 0.5) * 0.25
      startArr[3 * i + 2] = (Math.random() - 0.5) * 0.25

      endArr[3 * i] = (Math.random() - 0.5) * 0.5
      endArr[3 * i + 1] = (Math.random() - 0.5) * 0.25
      endArr[3 * i + 2] = (Math.random() - 0.5) * 0.25

      rndArr[3 * i] = 0.15 * Math.random() + 0.1
      rndArr[3 * i + 1] = randFloat(0, 1)
      rndArr[3 * i + 2] = 0.6 * Math.random() + 0.4
    }
    geometry.setAttribute('start', new InstancedBufferAttribute(startArr, 3))
    geometry.setAttribute('end', new InstancedBufferAttribute(endArr, 3))
    geometry.setAttribute('rnd', new InstancedBufferAttribute(rndArr, 3))
    geometry.setIndex(indices)
    geometry.instanceCount = NUM_POINTS
    geometry.boundingSphere = new Sphere(new Vector3(0, 0, 0), 1)

    return geometry
  }, [])

  const commonuniforms = useMemo(
    () => ({
      pointsParams: new Uniform(new Vector4(POINTS_SEGEMNTS, 0, 0, 0)),
      time: new Uniform(0),
      progress: new Uniform(0),
      ending: new Uniform(0),
      diffuse: new Uniform(particleTex),
    }),
    [particleTex],
  )

  const leftuniforms = useMemo(
    () => ({
      ...commonuniforms,
      bezierPos: new Uniform(berzierPos.left),
      dir: new Uniform(-1),
    }),
    [commonuniforms],
  )

  const rightuniforms = useMemo(
    () => ({
      ...commonuniforms,
      bezierPos: new Uniform(berzierPos.right),
      dir: new Uniform(1),
    }),
    [commonuniforms],
  )

  useGSAP(
    () => {
      const tl = gsap.timeline()

      const material = logoRef.current!.material
      const position = logoRef.current!.position
      const rotation = logoRef.current!.rotation

      tl.set(material, { opacity: 0 }).set(position, {
        x: 0,
        y: 0,
        z: -2,
      })

      tl.to(material, {
        opacity: 1,
        duration: 0.5,
        ease: 'power1.inOut',
        delay: 1.34,
      })
        .to(
          position,
          {
            z: -1,
            duration: 0.5,
            ease: 'back.inOut',
            delay: 1.34,
          },
          0,
        )
        .fromTo(
          rotation,
          {
            x: 1,
            y: 1,
          },
          {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'back.inOut',
            delay: 1.34,
          },
          0,
        )
    },
    { dependencies: [] },
  )

  useEffect(() => {
    const cb = () => {
      camera.zoom = Math.max(1, innerWidth / innerHeight / (16 / 9))

      camera.updateProjectionMatrix()
    }

    cb()

    window.addEventListener('resize', cb)

    const leftPoints = leftRef.current
    const rightPoints = rightRef.current

    const leftMat = leftPoints!.material as ShaderMaterial
    const rightMat = rightPoints!.material as ShaderMaterial

    leftMat.defines.NUM_SEGMENT = leftMat.uniforms.bezierPos.value.length
    rightMat.defines.NUM_SEGMENT = rightMat.uniforms.bezierPos.value.length

    camera.position.set(0, 0, 6)

    camera.lookAt(0, 0, 0)

    useLoadedStore.setState({ ready: true })
    useInteractStore.setState({ controlEnable: false })

    return () => {
      diffuseTex.dispose()
      particleTex.dispose()
      window.removeEventListener('resize', cb)
      camera.zoom = 1
    }
  }, [camera, gl, diffuseTex, particleTex, geo])

  useFrame((state, delta) => {
    delta %= 1
    baseParams.current.time += delta
    if (baseParams.current.time > 2.1) {
      commonuniforms.time.value += delta
      commonuniforms.progress.value
        += 0.025 * (0.8 - commonuniforms.progress.value)
      // commonuniforms.progress.value = Math.min(
      //   commonuniforms.progress.value + delta,
      //   0.8
      // );
    }
  })

  return (
    <>
      <mesh ref={logoRef} >
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
          blending={AdditiveBlending}
        />
      </mesh>
      <mesh geometry={geo} ref={rightRef} visible >
        <shaderMaterial
          uniforms={rightuniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </>
  )
}

export { HonkaiStarrailScene }
