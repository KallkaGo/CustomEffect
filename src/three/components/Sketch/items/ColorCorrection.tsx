import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import { SRGBColorSpace } from 'three'
import { ColorCorrection } from '../../Effect/ColorCorrection'
import RES from '../../RES'

const CONTROL_MAP = [
  { key: 'saturation', debug: {
    saturationAmount: {
      value: 1.0,
      min: 0.0,
      max: 5.0,
      step: 0.01,
    },
  } },
  { key: 'contrast', debug: {
    contrastAmount: {
      value: 1.0,
      min: 1.0,
      max: 10.0,
      step: 0.01,
    },
  } },
  { key: 'vignette', debug: {
    vignetteAmount: {
      value: 0.25,
      min: 0.0,
      max: 1.0,
      step: 0.01,
    },
  } },
  { key: 'colorboost', debug: {
    refColor: {
      value: '#3284c7',
    },
  } },
  {
    key: 'pixelation',
    debug: {
      dimension: {
        value: 128,
        options: [64, 128, 256, 512, 1024],
      },
    },
  },
]

function Control(mode: string) {
  const control = CONTROL_MAP.find(item => item.key.toLocaleUpperCase() === mode)

  const controlProps = useControls({
    ...control?.debug,
  }, [mode])!

  return controlProps
}

function DiffusionEffect() {
  const diffuse = useTexture(RES.textures.diffuse)
  diffuse.colorSpace = SRGBColorSpace

  const { mode } = useControls('Color', {
    mode: {
      value: 'SATURATION',
      options: [
        'SATURATION',
        'CONTRAST',
        'COLORBOOST',
        'VIGNETTE',
        'PIXELATION',
        'DISTORTION',
      ],
    },
  })

  const props = Control(mode)

  const Effect = EffectWrapper([
    {
      component: ColorCorrection,
      props: {
        ...props,
        diffuse,
        mode,
      },
    },
  ])

  return (
    <Effect />
  )
}

export default SceneLifecycle(DiffusionEffect, false)
