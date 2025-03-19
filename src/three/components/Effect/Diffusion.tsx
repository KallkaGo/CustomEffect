import type { Texture, WebGLRenderer, WebGLRenderTarget } from 'three'
import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { Uniform } from 'three'
import { GaussianBlurPass } from './pass/GaussianPass'
import fragmentShader from './shader/Diffusion/fragment.glsl'

interface IProps {
  loopCount?: number
  downsample?: number
  mixFactor?: number
  basePow?: number
  blurPow?: number
  mode?: string
}

class DiffusionEffect extends Effect {
  private gaussianBlurPass: GaussianBlurPass
  constructor(
    props: IProps = {
      loopCount: 5,
      downsample: 2,
      mixFactor: 0.2,
      mode: 'SCREENMIX',
    },
  ) {
    super('DualBlurEffect', fragmentShader, {
      defines: new Map<string, any>([[`MODE_${props.mode}`, '']]),
      uniforms: new Map<string, any>([
        ['uBlurTex', new Uniform(null)],
        ['uMixFactor', new Uniform(props.mixFactor)],
        ['uBlurPow', new Uniform(props.blurPow)],
        ['uBasePow', new Uniform(props.basePow)],
      ]),
    })
    this.gaussianBlurPass = new GaussianBlurPass(props)
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget<Texture>,
    _: number | undefined,
  ) {
    this.gaussianBlurPass.render(renderer, inputBuffer)
    this.uniforms.get('uBlurTex')!.value = this.gaussianBlurPass.finRT.texture
  }

  dispose(): void {
    this.gaussianBlurPass.dispose()
  }
}

function Diffusion(props: IProps) {
  const effect = useMemo(() => {
    return new DiffusionEffect(props)
  }, [props])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  })

  return <primitive object={effect} dispose={effect.dispose} />
}

export { Diffusion }
