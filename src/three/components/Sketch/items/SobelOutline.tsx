import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useThree } from '@react-three/fiber'
import { SMAA } from '@react-three/postprocessing'
import { useDepthBuffer } from '@utils/useDepthBuffer'
import { useNormalBuffer } from '@utils/useNormalBuffer'
import { useControls } from 'leva'
import { useEffect } from 'react'
import SobelOutlineEffect from '../../Effect/SobelOutline'

function SobelOutline() {
  const camera = useThree(state => state.camera)

  const normalTexture = useNormalBuffer(innerWidth, innerHeight)

  const depthTexture = useDepthBuffer(innerWidth, innerHeight)

  const props = useControls('SobelOutline', {
    thickness: {
      value: 2,
      min: 1,
      max: 10,
    },
    depthScale: {
      value: 1,
      min: 1,
      max: 10,
    },
    depthBias: {
      value: 2,
      min: 1,
      max: 10,
    },
    normalScale: {
      value: 1,
      min: 1,
      max: 10,
    },
    normalBias: {
      value: 1,
      min: 1,
      max: 10,
    },
  })

  const Effect = EffectWrapper([
    {
      component: SobelOutlineEffect,
      props: {
        depthTexture,
        normalTexture,
        ...props,
      },
    },
    {
      component: SMAA,
      props: {

      },
    },
  ])

  useEffect(() => {
    camera.position.set(6, 4, 10)
    return () => {
      depthTexture.dispose()
      normalTexture.dispose()
    }
  }, [])

  return (
    <>
      <color attach="background" args={['#342aea']} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={12} />
      <mesh receiveShadow position={[-1, 2, 1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh
        rotation={[0, Math.PI / 3, 0]}
        position={[2, 0.75, 2]}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[10, 10, 100, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <Effect />
    </>
  )
}

export default SceneLifecycle(SobelOutline, {
  scissor: false,
  controlEnable: true,
})
