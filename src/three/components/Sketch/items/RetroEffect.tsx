import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useControls } from 'leva'
import Retro from '../../Effect/Retro'
import { BaseScene } from '../base/BaseScene'

function RetroEffect() {
  const props = useControls('Retro', {
    maskIntensity: {
      value: 0.8,
      min: 0.0,
      max: 1.0,
    },
    colorNum: {
      value: '16.0',
      options: ['2.0', '4.0', '8.0', '16.0'],
    },
    pixelSize: {
      value: '4.0',
      options: ['4.0', '8.0', '16.0', '32.0'],
    },
    curveIntensity: {
      value: 0.3,
      min: 0.0,
      max: 0.5,
    },
  })

  const Effect = EffectWrapper([
    {
      component: Retro,
      props,
    },
  ])

  return (
    <>
      <color attach="background" args={['#335be0']} />
      <BaseScene />
      <Effect />
    </>
  )
}

export default SceneLifecycle(RetroEffect)
