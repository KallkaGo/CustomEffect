import type {
  PointerEventHandler,
} from 'react'
import type { PageActionType } from './Reducer'
import { useInteractStore } from '@utils/Store'
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react'
import { useShallow } from 'zustand/react/shallow'
import Game from './game/Game'
import Load from './load/Load'
import { initialState, reducer } from './Reducer'
import { UIWrapper } from './style'

export default function UIContainer() {
  const { isMute, audioAllowed, browserHidden } = useInteractStore(
    useShallow(state => ({
      isMute: state.isMute,
      audioAllowed: state.audioAllowed,
      browserHidden: state.browserHidden,
    })),
  )
  const [state, dispatch] = useReducer(reducer, initialState)

  const container = useRef<Div>(null)

  useEffect(() => {
    if (audioAllowed) {
      // TODO:播放音乐
    }
  }, [audioAllowed])

  const handleEmit = useCallback((type: PageActionType, payload?: any) => {
    dispatch({ type, payload })
  }, [])

  /*
    防止页面消失失去抬起事件的处理
    通过冒泡 处理抬起事件 */
  const handlePointerUp: PointerEventHandler = (e) => {
    useInteractStore.setState({ touch: false })
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    useInteractStore.setState({ mousePosition: { x: e.clientX / innerWidth, y: (innerHeight - e.clientY) / innerHeight } })
  }

  return (

    <UIWrapper id="panel" ref={container} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove}>
      {state.game && <Game emit={handleEmit} />}
      {state.load && <Load emit={handleEmit} />}
    </UIWrapper>

  /*
        音乐示例
         <audio
                ref={musicRef}
                src={bgm}
                loop
                muted={isMute || !audioAllowed || browserHidden}
            />
         */
  )
}
