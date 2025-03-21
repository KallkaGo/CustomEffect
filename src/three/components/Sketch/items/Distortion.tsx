import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import { useGameStore } from '@utils/Store'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useEffect } from 'react'
import { SRGBColorSpace } from 'three'
import Distortion from '../../Effect/Distortion'
import RES from '../../RES'

function DistortionEffect() {
  const diffuseTex = useTexture(RES.textures.firefly)
  diffuseTex.colorSpace = SRGBColorSpace

  const props = useControls('Distortion', {
    porgress: {
      value: 0.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    highLight: '#2375da',
    animation: {
      value: true,
    },
    blendWithDiffuse: false,
  })

  const Effect = EffectWrapper([
    {
      component: Distortion,
      props: {
        ...props,
        diffuse: diffuseTex,
      },
    },
  ])

  useGSAP(
    () => {
      const param = {
        porgress: 0,
      }
      gsap.killTweensOf(param)
      if (!props.animation)
        return
      gsap.to(param, {
        porgress: 1.0,
        duration: 1.34,
        ease: 'power1.inOut',
        // loading panel has 1 delay and.34 animation
        delay: 1.34,
        onUpdate: () => {
          useGameStore.setState({ progress: param.porgress })
        },
        repeat: -1,
      })
    },
    { dependencies: [props.animation] },
  )

  useEffect(() => {
    return () => {
      diffuseTex.dispose()
    }
  }, [diffuseTex])

  return (
    <Effect />
  )
}

export default SceneLifecycle(DistortionEffect, { scissor: false, controlEnable: true })
