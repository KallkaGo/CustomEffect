import type { Texture, WebGLRenderer, WebGLRenderTarget } from 'three'
import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { Uniform } from 'three'
import { GaussianBlurPass } from './pass/GaussianPass'

interface IProps {
  loopCount?: number
  downsample?: number
  mixFactor?: number
}

const fragmentShader = /* glsl */ `
uniform sampler2D map;
uniform float uMixFactor;

float getBrightness(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

// UFSH 2024 Tower of Fantasy share
 void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    { 
      /*
        max
      */

      // vec4 blendColor = texture2D(map, uv);
      // vec4 baseColor = inputColor;
      // vec3 resultColor = max(baseColor.rgb, blendColor.rgb);
      // outputColor = vec4(resultColor, baseColor.a);
      
      /* 
      Screen mix
      */

      vec4 blendColor = texture2D(map, uv);  
      vec4 baseColor = inputColor;  
  
      float mixFactor = uMixFactor; 
  
      vec3 screenColor = 1.0 - (1.0 - baseColor.rgb) * (1.0 - blendColor.rgb);  
  
      vec3 resultColor = mix(baseColor.rgb, screenColor, mixFactor);  
  
      outputColor = vec4(resultColor, baseColor.a);  
    }
`

class DiffusionEffect extends Effect {
  private gaussianBlurPass: GaussianBlurPass
  constructor(
    props: IProps = {
      loopCount: 5,
      downsample: 2,
      mixFactor: 0.2,
    },
  ) {
    super('DualBlurEffect', fragmentShader, {
      uniforms: new Map<string, any>([
        ['map', new Uniform(null)],
        ['uMixFactor', new Uniform(props.mixFactor)],
      ]),
    })
    this.gaussianBlurPass = new GaussianBlurPass(props)
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget<Texture>,
    deltaTime?: number | undefined,
  ) {
    this.gaussianBlurPass.render(renderer, inputBuffer)
    this.uniforms.get('map')!.value = this.gaussianBlurPass.finRT.texture
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
