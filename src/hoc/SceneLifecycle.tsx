import type { FC } from 'react'
import { useGameStore, useInteractStore, useLoadedStore } from '@utils/Store'
import { useEffect } from 'react'

interface ICfg {
  scissor?: boolean
  controlEnable?: boolean
}

export function SceneLifecycle(WrappedComponent: FC, cfg: ICfg = { scissor: true, controlEnable: true }) {
  return function SceneLifecycleWrapper(props: any) {
    useEffect(() => {
      useLoadedStore.setState({ ready: true })
      if (cfg.controlEnable) {
        useInteractStore.setState({ controlEnable: true })
      }
      useGameStore.setState({ showSlider: cfg.scissor })

      return () => {
        useGameStore.setState({ showSlider: false })
      }
    }, [])

    return <WrappedComponent {...props} />
  }
}
