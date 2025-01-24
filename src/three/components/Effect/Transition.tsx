import type { Texture, WebGLRenderer, WebGLRenderTarget } from 'three'
import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { Uniform, Vector2 } from 'three'
import fragmenrShader from './shader/Trans/fragment.glsl'

interface IProps {
  diffuse1: Texture
  diffuse2: Texture
  progress: number
  intensity: number
}

class Transition extends Effect {
  constructor(props: IProps) {
    super('Transition', fragmenrShader, {
      uniforms: new Map<string, any>([
        ['uProgress', new Uniform(props.progress)],
        ['uCurrentTexture', new Uniform(props.diffuse1)],
        ['uNextTexture', new Uniform(props.diffuse2)],
        ['uImageSize', new Uniform(new Vector2(1920, 1080))],
        ['uScreenSize', new Uniform(new Vector2(innerWidth, innerHeight))],
        ['uIntensity', new Uniform(props.intensity)],
        ['uResolution', new Uniform(new Vector2())],
      ]),
    })
  }

  update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, deltaTime?: number): void {
    this.uniforms.get('uScreenSize')!.value.set(innerWidth * devicePixelRatio, innerHeight * devicePixelRatio)
  }
}

export default function TransitionEffect(
  props: IProps,
) {
  const effect = useMemo(() => {
    return new Transition(props)
  }, [props])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  })

  return <primitive object={effect} dispose={effect.dispose} />
}
