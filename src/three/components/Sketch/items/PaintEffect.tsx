import type { GLTF } from 'three-stdlib'
import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useTexture } from '@react-three/drei'
import { SMAA } from '@react-three/postprocessing'
import textureSrc from '@textures/waterColor.png'
import { useKTX2Loader } from '@utils/useKTX2Loader'
import { useControls } from 'leva'
import { EdgeDetectionMode, SMAAPreset } from 'postprocessing'
import Kuwahara from '../../Effect/Kuwahara'
import QuantizationAndToneMap from '../../Effect/QuantizationAndToneMap'
import RES from '../../RES'

function Model({ modelName }: { modelName: string }) {
  const [plant, greenHouse] = useKTX2Loader(
    [RES.models.plant, RES.models.greenHouse],
    false,
    true,
  ) as GLTF[]

  return (
    <>
      <color attach="background" args={['#3386E0']} />
      <group
        rotation={[0, 0, 0]}
        position={modelName === 'plant' ? [0, -1, 0] : [0, -0.5, 0]}
        scale={modelName === 'plant' ? 0.7 : 0.2}
      >
        <primitive
          object={modelName === 'plant' ? plant.scene : greenHouse.scene}
        />
      </group>
    </>
  )
}

function PaintEffect() {
  const tex = useTexture(textureSrc)

  const modelProps = useControls('model', {
    url: {
      value: 'plant',
      options: {
        plant: 'plant',
        greenHouse: 'greenHouse',
      },
    },
  })

  const kuawaharaProps = useControls('Kuwahara', {
    radius: {
      value: 2,
      min: 1,
      max: 25,
      step: 1,
    },
  })

  const qtProps = useControls('QuantizationAndToneMap', {
    adjustment: {
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.1,
      labelL: 'saturating',
    },
  })

  const antiAliasingprops = useControls('SMAA', {
    preset: {
      value: SMAAPreset.MEDIUM,
      options: SMAAPreset,
    },
    edgeDetectionMode: {
      value: EdgeDetectionMode.COLOR,
      options: EdgeDetectionMode,
    },
  })

  const Effect = EffectWrapper([
    {
      component: Kuwahara,
      props: kuawaharaProps,
    },
    {
      component: QuantizationAndToneMap,
      props: {
        ...qtProps,
        tex,
      },
    },
    {
      component: SMAA,
      props: antiAliasingprops,
    },
  ])

  return (
    <>
      <Model modelName={modelProps.url} />
      <Effect />
    </>
  )
}

export default SceneLifecycle(PaintEffect)
