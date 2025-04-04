import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { OrbitControls } from '@react-three/drei'
import {
  useGameStore,
  useInteractStore,
  useLoadedStore,
  useSceneStore,
} from '@utils/Store'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { DitheredTransparency } from './base/DitheredTranparency'
import { HonkaiStarrailScene } from './base/HonkaiStarrail'
import BloomEffect from './items/BloomEffect'
import ColorCorrection from './items/ColorCorrection'
import DiffusionEffect from './items/Diffusion'
import DistortionEffect from './items/Distortion'
import DualBlurEffect from './items/DualBlurEffect'
import GaussianBlurEffect from './items/GaussianBlur'
import GTToneMapping from './items/GTToneMapping'
import Mask from './items/Mask'
import PaintEffect from './items/PaintEffect'
import RetroEffect from './items/RetroEffect'
import SdfTemplate from './items/SdfTemplate'
import SobelOutlineEffect from './items/SobelOutline'
import TransitionEffect from './items/Transition'

const EFFECT_MAP = [
  { key: 'dualblur', Component: DualBlurEffect },
  { key: 'gaussianblur', Component: GaussianBlurEffect },
  { key: 'diffusion', Component: DiffusionEffect },
  { key: 'bloom', Component: BloomEffect },
  { key: 'gtToneMap', Component: GTToneMapping },
  { key: 'retro', Component: RetroEffect },
  { key: 'paint', Component: PaintEffect },
  { key: 'distortion', Component: DistortionEffect },
  { key: 'colorCorrection', Component: ColorCorrection },
  { key: 'ditheredTransparency', Component: DitheredTransparency },
  { key: 'honkaiStarrail', Component: HonkaiStarrailScene },
  { key: 'sdf', Component: SdfTemplate },
  { key: 'transition', Component: TransitionEffect },
  { key: 'mask', Component: Mask },
  { key: 'sobelOutline', Component: SobelOutlineEffect },
]

function Sketch() {
  const { controlDom, controlEnable } = useInteractStore(
    useShallow(state => ({
      controlEnable: state.controlEnable,
      controlDom: state.controlDom,
    })),
  )

  const showComplete = useLoadedStore(state => state.showComplete)
  const sceneState = useSceneStore()
  const initiale = useRef(true)
  const OrbitControlsRef = useRef<OrbitControlsImpl>(null)

  const [curEffect, setCurEffect] = useState('honkaiStarrail')

  useControls('Effect', {
    effect: {
      value: curEffect,
      options: [...Object.keys(sceneState)],
      onChange: (value) => {
        if (initiale.current) {
          initiale.current = false
          return
        }
        useGameStore.setState({ transfer: true })
        useLoadedStore.setState({ ready: false })
        useInteractStore.setState({ sliderPos: 0.5 })
        setCurEffect(value)
      },
    },
  })

  useEffect(() => {
    if (showComplete) {
      const sceneData = useSceneStore.getState()
      OrbitControlsRef.current?.reset()
      useSceneStore.setState(
        Object.fromEntries(
          Object.keys(sceneData).map(key => [key, key === curEffect]),
        ),
      )
    }
  }, [showComplete])

  const activeEffects = useMemo(() => {
    return EFFECT_MAP.filter(
      ({ key }) => sceneState[key as keyof typeof sceneState],
    ).map(({ Component, key }) => <Component key={key} />)
  }, [sceneState])

  return (
    <>
      <OrbitControls
        domElement={controlDom}
        enabled={controlEnable}
        ref={OrbitControlsRef}
        minDistance={0.1}
      />
      <color attach="background" args={['black']} />
      {activeEffects}
    </>
  )
}

export default Sketch
