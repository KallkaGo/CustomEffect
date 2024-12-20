import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useControls } from 'leva'
import { DualBlur } from '../../Effect/DualBlur'
import { BaseScene } from '../base/BaseScene'

function DualBlurEffect() {
  const props = useControls('DualBlur', {
    loopCount: {
      value: 5,
      min: 1,
      max: 10,
      step: 1,
    },
    blurRange: {
      value: 0,
      min: 0,
      max: 10,
      step: 0.001,
    },
  })

  const Effect = EffectWrapper([
    {
      component: DualBlur,
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

export default SceneLifecycle(DualBlurEffect)
