import type { ShaderPass } from 'postprocessing'
import type {
  Texture,
  WebGLRenderer,
} from 'three'
import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import {
  Color,

  HalfFloatType,
  ShaderMaterial,
  SRGBColorSpace,
  Uniform,
  WebGLRenderTarget,
} from 'three'

import { DualBlurPass } from './pass/DualBlurPass'

interface IProps {
  luminanceThreshold?: number
  luminanceSmoothing?: number
  radius?: number
  intensity?: number
  iteration?: number
  glowColor?: string
}

const fragmentShader = /* glsl */ `
uniform sampler2D blurMap;
uniform float intensity;
uniform vec3 glowColor;
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
{ 
    vec4 color = texture2D(blurMap, uv);
    outputColor = vec4(inputColor.rgb + glowColor * intensity * color.rgb, inputColor.a); ;
}
`

class BloomEffect extends Effect {
  public luminanceThreshold: number
  private dulaBlurPass!: DualBlurPass
  public renderTarget: WebGLRenderTarget

  constructor({
    luminanceThreshold = 0.1,
    radius = 1,
    intensity = 1,
    glowColor = 'white',
    iteration = 4,
  }: IProps) {
    super('Bloom', fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ['blurMap', new Uniform(null)],
        ['intensity', new Uniform(intensity)],
        ['glowColor', new Uniform(new Color(glowColor))],
      ]),
    })
    this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false })
    this.renderTarget.texture.name = 'Bloom.Target'
    this.luminanceThreshold = luminanceThreshold
    this.dulaBlurPass = new DualBlurPass({
      loopCount: iteration,
      blurRange: radius,
      additive: true,
    })
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget<Texture>,
    _: number | undefined,
  ) {
    this.renderTarget.setSize(inputBuffer.width, inputBuffer.height)
    this.dulaBlurPass.LuminanceThreshold
      = this.luminanceThreshold
    this.dulaBlurPass.render(renderer, inputBuffer)
    this.uniforms.get('blurMap')!.value = this.dulaBlurPass.finRT.texture
  }

  dispose(): void {
    this.dulaBlurPass.dispose()
  }
}

function Bloom(props: IProps) {
  const effect = useMemo(() => new BloomEffect(props), [props])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  })

  return <primitive object={effect} dispose={effect.dispose} />
}

export { Bloom }
