import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useControls } from 'leva'
import { Diffusion } from '../../Effect/Diffusion'
import { BaseScene } from '../base/BaseScene'

function DiffusionEffect() {
  const props = useControls('Diffusion', {
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

  const Effect = EffectWrapper([
    {
      component: Diffusion,
      props,
    },
  ])

  return (
    <>
      <BaseScene />
      <Effect />
    </>
  )
}

export default SceneLifecycle(DiffusionEffect)
