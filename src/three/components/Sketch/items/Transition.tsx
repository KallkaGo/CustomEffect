import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import { SRGBColorSpace } from 'three'
import Transition from '../../Effect/Transition'
import RES from '../../RES'

function TransitionEffect() {
  const [diffuse1, diffuse2, diffuse3] = useTexture([RES.textures.sample1, RES.textures.sample2, RES.textures.sample3])
  diffuse1.colorSpace = diffuse2.colorSpace = diffuse3.colorSpace = SRGBColorSpace

  const { progress, intensity, nextTexture } = useControls({
    nextTexture: {
      value: diffuse3,
      options: {
        珂莱塔: diffuse3,
        洛可可: diffuse2,
      },
    },
    progress: { value: 0, min: 0, max: 1, step: 0.01 },
    intensity: { value: 0.34, min: 0, max: 1, step: 0.01 },
  })

  const Effect = EffectWrapper([
    {
      component: Transition,
      props: {
        diffuse1,
        diffuse2: nextTexture,
        progress,
        intensity,
      },
    },
  ])

  return (

    <Effect />

  )
}

export default SceneLifecycle(TransitionEffect, { scissor: false, controlEnable: false })
