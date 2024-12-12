import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useControls } from 'leva'
import GTToneMap from '../../Effect/GTToneMap'
import { BaseScene } from '../base/BaseScene'

function GTToneMapping() {
  const gtProps = useControls('ToneMapGT', {
    MaxLuminanice: {
      value: 2,
      min: 1,
      max: 100,
      step: 0.01,
    },
    Contrast: {
      value: 1,
      min: 1,
      max: 5,
      step: 0.01,
    },
    LinearSectionStart: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    LinearSectionLength: {
      value: 0.12,
      min: 0,
      max: 0.99,
      step: 0.01,
    },
    BlackTightnessC: {
      value: 1.69,
      min: 1,
      max: 3,
      step: 0.01,
    },
    BlackTightnessB: {
      value: 0.0,
      min: 0,
      max: 1,
      step: 0.25,
    },
    Enabled: true,
  })

  const Effect = EffectWrapper([
    {
      component: GTToneMap,
      props: gtProps,
    },
  ])

  return (
    <>
      <BaseScene />
      <Effect />
    </>
  )
}

export default SceneLifecycle(GTToneMapping)
