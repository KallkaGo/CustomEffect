import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { OrthographicCamera, useTexture } from '@react-three/drei'
import { useInteractStore } from '@utils/Store'
import { useControls } from 'leva'
import { useEffect } from 'react'
import { SRGBColorSpace } from 'three'
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
    basePow:{
      value: 1.5,
      min: 1.0,
      max: 10.0,
      step: 0.01,
    }
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

  useEffect(() => {
    useInteractStore.setState({ controlEnable: false })
  }, [])

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
        <meshBasicMaterial map={diffuseTex} />
      </mesh>
      <Effect />
    </>
  )
}

export default SceneLifecycle(DiffusionEffect, { controlEnable: false, scissor: true })
