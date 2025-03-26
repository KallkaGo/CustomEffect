import type { FC } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { useGameStore, useInteractStore } from '@utils/Store'
import { memo, useEffect, useRef } from 'react'
import { HalfFloatType } from 'three'

interface IComponents {
  component: FC<any>
  props: any
}

function EffectWrapper(components: IComponents[]) {
  return memo(() => {
    const composerRef = useRef<any>(null)
    const gl = useThree(state => state.gl)

    useEffect(() => {
      const composer = composerRef.current
      return () => {
        gl.setScissorTest(false)
        composer.dispose()
      }
    })

    useFrame((state, delta) => {
      const { gl } = state
      const composer = composerRef.current
      const sliderPos = useInteractStore.getState().sliderPos
      gl.autoClear = true
      const scissor = useGameStore.getState().showSlider
      if (scissor) {
        gl.setScissorTest(true)
        gl.setScissor(0, 0, sliderPos * innerWidth - 2, innerHeight)
        composer.render(delta)
        gl.setScissor(
          sliderPos * innerWidth + 2,
          0,
          innerWidth - sliderPos * innerWidth + 2,
          innerHeight,
        )
        gl.render(state.scene, state.camera)
      }
      else {
        composer.render(delta)
      }
    }, 1)

    return (

      <EffectComposer
        frameBufferType={HalfFloatType}
        ref={composerRef}
      >
        {components.map((item, index) => (
          <item.component
            key={`Effect_${item.component.name || index}`}
            index={index}
            {...item.props}
          />
        ))}
      </EffectComposer>

    )
  })
}

export { EffectWrapper }
