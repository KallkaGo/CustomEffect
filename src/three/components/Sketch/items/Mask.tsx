import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useTexture } from '@react-three/drei'
import { SRGBColorSpace } from 'three'
import MaskEffect from '../../Effect/Mask'
import RES from '../../RES'

function Mask() {
  const diffuse = useTexture(RES.textures.firefly)
  diffuse.colorSpace = SRGBColorSpace

  const Effect = EffectWrapper([
    {
      component: MaskEffect,
      props: {
        channel0: diffuse,
      },
    },
  ])

  return (

    <Effect />

  )
}

export default SceneLifecycle(Mask, { scissor: false, controlEnable: false })
