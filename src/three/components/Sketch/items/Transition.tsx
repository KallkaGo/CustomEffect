import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import { useGameStore, useInteractStore } from '@utils/Store'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useRef } from 'react'
import { SRGBColorSpace } from 'three'
import Transition from '../../Effect/Transition'
import RES from '../../RES'

function TransitionEffect() {
  const textureList = useTexture([RES.textures.sample1, RES.textures.sample2, RES.textures.sample3])
  textureList.forEach((texture) => {
    texture.colorSpace = SRGBColorSpace
  })
  const baseParams = useRef({
    curIndex: 0,
    aniDone: true,
    curTexture: textureList[0],
    nextTexture: textureList[1],
  })

  const arrowState = useInteractStore(state => state.arrowState)

  const progress = useGameStore(state => state.transitionProgress)

  useGSAP(() => {
    if (!baseParams.current.aniDone || !arrowState)
      return
    baseParams.current.aniDone = false

    const isLeft = arrowState === 'left'

    baseParams.current.curIndex += isLeft ? -1 : 1

    if (baseParams.current.curIndex < 0) {
      baseParams.current.curIndex = textureList.length - 1
    }
    else if (baseParams.current.curIndex >= textureList.length) {
      baseParams.current.curIndex = 0
    }

    if (isLeft) {
      const tmp = baseParams.current.curTexture
      baseParams.current.curTexture = textureList[baseParams.current.curIndex]
      baseParams.current.nextTexture = tmp
    }
    else {
      baseParams.current.nextTexture = textureList[baseParams.current.curIndex]
    }

    const param = { progress: isLeft ? 1 : 0 }
    gsap.to(param, {
      progress: isLeft ? 0 : 1,
      duration: 0.75,
      ease: 'power2.inOut',
      onUpdate: () => {
        useGameStore.setState({ transitionProgress: param.progress })
      },
      onComplete: () => {
        baseParams.current.aniDone = true
        useInteractStore.setState({ arrowState: '' })
        if (!isLeft) {
          baseParams.current.curTexture = baseParams.current.nextTexture
        }
      },
    })
  }, { dependencies: [arrowState] })

  const { intensity } = useControls({

    intensity: { value: 0.34, min: 0, max: 1, step: 0.01 },
  })

  const Effect = EffectWrapper([
    {
      component: Transition,
      props: {
        diffuse1: baseParams.current.curTexture,
        diffuse2: baseParams.current.nextTexture,
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
