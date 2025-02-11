import type { Texture, WebGLRenderer, WebGLRenderTarget } from 'three'
import { useInteractStore } from '@utils/Store'
import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { Color, Uniform, Vector2 } from 'three'
import fragmenrShader from './shader/Mask/fragment.glsl'

interface IProps {
  channel0?: Texture
  mode?: string
  glowColor?: string
}

class MaskEffect extends Effect {
  constructor(props: IProps = {
    mode: 'DEFAULT',
    glowColor: 'white',
  }) {
    super('Mask', fragmenrShader, {
      defines: new Map<string, any>([[`MODE_${props.mode ?? 'DEFAULT'}`, '']]),
      uniforms: new Map<string, any>([
        ['uChannel0', new Uniform(props.channel0)],
        ['uMousePos', new Uniform(new Vector2(0, 0))],
        ['uImageSize', new Uniform(new Vector2(1920, 1080))],
        ['uGlowColor', new Uniform(new Color(props.glowColor))],
      ]),
    })
  }

  update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, deltaTime?: number): void {
    const { x, y } = useInteractStore.getState().mousePosition
    this.uniforms.get('uMousePos')!.value.set(x, y)
  }
}

export default function Mask(props: IProps,

) {
  const effect = useMemo(() => {
    return new MaskEffect(props)
  }, [props])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  })

  return <primitive object={effect} dispose={effect.dispose} />
}
