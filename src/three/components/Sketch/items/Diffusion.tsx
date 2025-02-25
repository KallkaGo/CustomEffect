import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { OrthographicCamera, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useInteractStore } from '@utils/Store'
import { useControls } from 'leva'
import { useEffect, useMemo } from 'react'
import { MeshBasicMaterial, SRGBColorSpace, Uniform, Vector2 } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { Diffusion } from '../../Effect/Diffusion'
import RES from '../../RES'

const CONTROL_MAP = [
  { key: 'screenMix', debug: {
    mixFactor: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
    },
  } },
  { key: 'maxBlend', debug: {
    blurPow: {
      value: 2.0,
      min: 0.0,
      max: 10.0,
      step: 0.01,
    },
    basePow: {
      value: 1.5,
      min: 1.0,
      max: 10.0,
      step: 0.01,
    },
  } },

]

function Control(mode: string) {
  const control = CONTROL_MAP.find(item => item.key.toLocaleUpperCase() === mode)

  const controlProps = useControls({
    ...control?.debug,
  }, [mode])!

  return controlProps
}

function DiffusionEffect() {
  const diffuseTex = useTexture(RES.textures.firefly)
  diffuseTex.colorSpace = SRGBColorSpace

  const commonProps = useControls('blur', {
    loopCount: {
      value: 5,
      min: 1,
      max: 10,
      step: 1,
    },
    downsample: {
      value: 2,
      min: 1,
      max: 10,
      step: 1,
    },

  })

  const { mode } = useControls('MODE', {
    mode: {
      value: 'MAXBLEND',
      options: [
        'SCREENMIX',
      ],
    },
  })

  const props = Control(mode)

  const Effect = EffectWrapper([
    {
      component: Diffusion,
      props: {
        ...commonProps,
        ...props,
        mode,
      },
    },
  ])

  const uniforms = useMemo(() => ({
    diffuseTex: new Uniform(diffuseTex),
    uImageSize: new Uniform(new Vector2(1920, 1080)),
    uResolution: new Uniform(new Vector2()),
  }), [])

  useEffect(() => {
    useInteractStore.setState({ controlEnable: false })

    return () => {
      diffuseTex.dispose()
    }
  }, [diffuseTex])

  useFrame((state, _) => {
    uniforms.uResolution.value.set(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio)
  })

  return (
    <>
      <OrthographicCamera
        makeDefault
        manual
        position={[0, 0, 1]}
        left={0}
        right={1}
        top={1}
        bottom={0}
        near={0.1}
        far={1000}
      />
      <color attach="background" args={['black']} />
      <mesh position={[0.5, 0.5, 0]}>
        <planeGeometry args={[1, 1]} />
        <CustomShaderMaterial
          baseMaterial={MeshBasicMaterial}
          uniforms={uniforms}
          vertexShader={
            `
            varying vec2 vUv;
            void main() {
              vUv = uv;
            }
            `
          }
          fragmentShader={
            `
              varying vec2 vUv;
              uniform sampler2D diffuseTex;
              uniform vec2 uImageSize;
              uniform vec2 uResolution;

              vec2 calcCoord(in vec2 coord,in vec2 imageSize,in vec2 resolution) {
                vec2 textureImageSize = imageSize;
                vec2 screenSize = resolution;
                float rs = screenSize.x / screenSize.y;
                float ri = textureImageSize.x / textureImageSize.y;
                vec2 new = rs < ri ? vec2(textureImageSize.x * screenSize.y / textureImageSize.y, screenSize.y) : vec2(screenSize.x, textureImageSize.y * screenSize.x / textureImageSize.x);
                vec2 offset = (rs < ri ? vec2((new.x - screenSize.x) / 2.0, 0.0) : vec2(0.0, (new.y - screenSize.y) / 2.0)) / new;
                vec2 uv = coord * screenSize / new + offset;
                return uv;
              }

              void main() {
                vec2 newUV = calcCoord(vUv, uImageSize, uResolution);
                csm_DiffuseColor = texture2D(diffuseTex, newUV);
              }
            `
          }

        />
      </mesh>
      <Effect />
    </>
  )
}

export default SceneLifecycle(DiffusionEffect, { controlEnable: false, scissor: true })
