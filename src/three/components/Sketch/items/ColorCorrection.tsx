import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import { SRGBColorSpace } from 'three'
import { ColorCorrection } from '../../Effect/ColorCorrection'
import RES from '../../RES'

function DiffusionEffect() {
  const diffuse = useTexture(RES.textures.diffuse)
  diffuse.colorSpace = SRGBColorSpace

  const props = useControls('Color', {
    mode: {
      value: 'SATURATION',
      options: [
        'SATURATION',
        'CONTRAST',
        'COLORBOOST',
        'VIGNETTE',
      ],
    },
    saturationAmount: {
      value: 1.0,
      min: 0.0,
      max: 5.0,
      step: 0.01,
    },
    contrastAmount: {
      value: 1.0,
      min: 1.0,
      max: 10.0,
      step: 0.01,
    },
    refColor: {
      value: '#3284c7',
    },
    vignetteAmount: {
      value: 0.25,
      min: 0.0,
      max: 1.0,
      step: 0.01,
    },
  })

  const Effect = EffectWrapper([
    {
      component: ColorCorrection,
      props: {
        ...props,
        diffuse,
      },
    },
  ])

  return (
    <Effect />
  )
}

export default SceneLifecycle(DiffusionEffect, false)
