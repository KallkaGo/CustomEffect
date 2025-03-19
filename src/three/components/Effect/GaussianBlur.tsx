import type { Texture, WebGLRenderer, WebGLRenderTarget } from 'three'
import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { Uniform } from 'three'
import { GaussianBlurPass } from './pass/GaussianPass'

interface IProps {
  loopCount?: number
  downsample?: number
}

const fragmentShader = /* glsl */ `
uniform sampler2D map;
 void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    { 
        vec4 color = texture2D(map, uv);
        outputColor = color;
    }
`

class GaussianBlurEffect extends Effect {
  private gaussianBlurPass: GaussianBlurPass
  constructor(
    props: IProps = {
      loopCount: 5,
      downsample: 1,
    },
  ) {
    super('DualBlurEffect', fragmentShader, {
      uniforms: new Map([['map', new Uniform(null)]]),
    })
    this.gaussianBlurPass = new GaussianBlurPass(props)
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget<Texture>,
    _: number | undefined,
  ) {
    this.gaussianBlurPass.render(renderer, inputBuffer)
    this.uniforms.get('map')!.value = this.gaussianBlurPass.finRT.texture
  }
}

function GaussianBlur(props: IProps) {
  const effect = useMemo(() => {
    return new GaussianBlurEffect(props)
  }, [props])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  })

  return <primitive object={effect} dispose={effect.dispose} />
}

export { GaussianBlur }
