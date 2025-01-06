import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import SdfTemplate from '../../Effect/Sdf'

function SdfEffect() {
  const Effect = EffectWrapper([
    {
      component: SdfTemplate,
      props: {

      },
    },
  ])

  return (

    <Effect />

  )
}

export default SceneLifecycle(SdfEffect, { scissor: false, controlEnable: false })
