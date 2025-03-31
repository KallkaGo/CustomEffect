import type { FC } from 'react'
import type { IProps } from '../types'
import { useGSAP } from '@gsap/react'
import { useInteractStore, useLoadedStore } from '@utils/Store'
import Sys from '@utils/Sys'
import gsap from 'gsap'
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LoadWrapper } from './style'

/**
 * 加载总数
 */
const TOTAL = 24

const Load: FC<IProps> = memo(({ emit }) => {
  const panelRef = useRef<HTMLDivElement>(null)

  const ready = useLoadedStore(state => state.ready)

  const { contextSafe } = useGSAP()

  const [device, setDevice] = useState<'pc' | 'mobile'>(Sys.getSystem)

  const levaDomRef = useRef<HTMLElement | null>(null)

  const initLevaStyle = contextSafe(() => {
    const levaDom = levaDomRef.current
    gsap.set(levaDom, { opacity: 0, pointerEvents: 'none' })
  })

  useEffect(() => {
    useLoadedStore.setState({ showComplete: true })

    const rootNode = document.getElementById('root') as HTMLElement

    const [levaDom] = Array.from(rootNode.childNodes).filter(item =>
      (item as HTMLElement).className.includes('leva'),
    )

    levaDomRef.current = levaDom as HTMLElement

    initLevaStyle()

    const onResize = () => {
      const sys = Sys.getSystem() === 'pc' ? 'pc' : 'mobile'
      setDevice(sys)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])



  const close = contextSafe(() => {
    useInteractStore.setState({ demand: false })
    const levaDom = levaDomRef.current

    if (levaDom) {
      gsap.to(levaDom, {
        opacity: 1,
        duration: 0.75,
        delay: 1,
        ease: 'sine.out',
        onComplete: () => {
          levaDom.style.pointerEvents = 'auto'
        },
      })
    }

    gsap.to(panelRef.current, {
      opacity: 0,
      duration: 0.75,
      delay: 1,
      ease: 'sine.out',
      onComplete: () => {
        useInteractStore.setState({ audioAllowed: true })
        useLoadedStore.setState({ showComplete: false })
        emit('hide-load')
        emit('show-game')
      },
    })

    useInteractStore.setState({ begin: true })
  })

  useEffect(() => {
    ready && close()
  }, [ready])

  return (
    <LoadWrapper ref={panelRef}>
      <div className="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="loadstr">
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
      </div>
    </LoadWrapper>
  )
})

export default Load
