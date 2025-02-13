import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect } from 'react'
import { SRGBColorSpace } from 'three'
import MaskEffect from '../../Effect/Mask'
import RES from '../../RES'

function Mask() {
  const diffuse = useTexture(RES.textures.firefly)
  diffuse.colorSpace = SRGBColorSpace

  const debug = useControls('Mask', {
    mode: {
      value: 'DEFAULT',
      options: [
        'CUSTOM',
      ],
    },
    glowColor: {
      value: 'white',
    },
  })

  const Effect = EffectWrapper([
    {
      component: MaskEffect,
      props: {
        channel0: diffuse,
        ...debug,
      },
    },
  ])

  useEffect(() => {
    return () => {
      diffuse.dispose()
    }
  }, [diffuse])

  return (

    <Effect />

  )
}

export default SceneLifecycle(Mask, { scissor: false, controlEnable: false })
