import type { Texture, WebGLRenderer, WebGLRenderTarget } from 'three'
import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { Uniform } from 'three'
import { GaussianBlurPass } from './pass/GaussianPass'

interface IProps {
  loopCount?: number
  downsample?: number
  mixFactor?: number
  basePow?: number
  blurPow?: number
  mode?: string
}

const fragmentShader = /* glsl */ `
uniform sampler2D uBlurTex;
uniform float uMixFactor;
uniform float uBlurPow;
uniform float uBasePow;

// UFSH 2024 Tower of Fantasy share
/* 
Reference：
  https://zhuanlan.zhihu.com/p/675826591
  https://media.colorfulpalette.co.jp/n/n51bf8818b89d
  https://www.pixiv.net/artworks/10325142

*/
 void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    { 
      /* 
      Screen mix
      */
     #ifdef MODE_SCREENMIX

      vec4 blendColor = texture2D(uBlurTex, uv);  
      vec4 baseColor = inputColor;  
  
      float mixFactor = uMixFactor; 
  
      vec3 screenColor = 1.0 - (1.0 - baseColor.rgb) * (1.0 - blendColor.rgb);  
  
      vec3 resultColor = mix(baseColor.rgb, screenColor, mixFactor);  
  
      outputColor = vec4(resultColor, baseColor.a); 
  
      #endif

      #ifdef MODE_MAXBLEND

      vec4 blurColor = texture2D(uBlurTex, uv);
      vec4 baseColor = inputColor;

      vec3 mulBlurColor = pow(blurColor.rgb, vec3(uBlurPow));
      vec3 mulColor = pow(baseColor.rgb, vec3(uBasePow));

      vec3 screenColor = mulColor.rgb + mulBlurColor - mulBlurColor * mulColor.rgb;

      // vec3 screenColor = 1.0 - (1.0 - mulColor.rgb) * (1.0 - mulBlurColor.rgb);

      vec3 finalColor = max(baseColor.rgb, screenColor);

      outputColor = vec4(finalColor, baseColor.a);

      #endif

    }
`

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
    deltaTime?: number | undefined,
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
