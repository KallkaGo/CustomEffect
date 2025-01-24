import { EffectWrapper } from '@/hoc/EffectWrapper'
import { SceneLifecycle } from '@/hoc/SceneLifecycle'
import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import { useGameStore, useInteractStore } from '@utils/Store'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { SRGBColorSpace } from 'three'
import Transition from '../../Effect/Transition'
import RES from '../../RES'

function TransitionEffect() {
  const textureList = useTexture([RES.textures.sample1, RES.textures.sample2, RES.textures.sample4, RES.textures.sample3])
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
    const { current } = baseParams

    if (!current.aniDone || !arrowState)
      return

    current.aniDone = false

    const isLeft = arrowState === 'left'
    current.curIndex += isLeft ? -1 : 1

    current.curIndex = (current.curIndex + textureList.length) % textureList.length

    if (isLeft) {
      [current.curTexture, current.nextTexture] = [textureList[current.curIndex], current.curTexture]
    }
    else {
      current.nextTexture = textureList[current.curIndex]
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

  useEffect(() => {
    return () => {
      textureList.forEach((texture) => {
        texture.dispose()
      })
    }
  }, [])

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
