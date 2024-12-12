import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useControls } from 'leva'
import { GaussianBlur } from '../../Effect/GaussianBlur'
import { BaseScene } from '../base/BaseScene'

function GaussianBlurEffect() {
  const props = useControls('GaussianBlur', {
    loopCount: {
      value: 5,
      min: 1,
      max: 10,
      step: 1,
    },
    downsample: {
      value: 1,
      min: 1,
      max: 10,
      step: 1,
    },
  })

  const Effect = EffectWrapper([
    {
      component: GaussianBlur,
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

export default SceneLifecycle(GaussianBlurEffect)
