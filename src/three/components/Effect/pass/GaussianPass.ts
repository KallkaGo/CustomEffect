import type { WebGLRenderer } from 'three'
import { Pass, ShaderPass } from 'postprocessing'
import { ShaderMaterial, Uniform, Vector2, WebGLRenderTarget } from 'three'
import fragmentShader from '../shader/GaussianBlur/fragment.glsl'
import vertexShader from '../shader/GaussianBlur/vertex.glsl'

interface IProps {
  loopCount?: number
  downsample?: number
}

class GaussianBlurPass extends Pass {
  private gaussianBlurMaterial: ShaderMaterial
  private pingpongBuffer: WebGLRenderTarget[] = []
  private blurPass: ShaderPass
  private loopCount: number
  private downsample: number

  constructor({ loopCount = 5, downsample = 1 }: IProps) {
    super('GaussianBlurPass')

    this.downsample = downsample
    this.gaussianBlurMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tDiffuse: new Uniform(null),
        uResolution: new Uniform(new Vector2()),
        uHorizontal: new Uniform(null),
      },
    })

    this.pingpongBuffer[0] = new WebGLRenderTarget()
    this.pingpongBuffer[1] = new WebGLRenderTarget()

    this.blurPass = new ShaderPass(this.gaussianBlurMaterial)

    this.loopCount = loopCount
  }

  render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget) {
    const { loopCount, pingpongBuffer, gaussianBlurMaterial, downsample } = this
    let horizontal = true
    let firstIteration = true

    const width = Math.max(inputBuffer.width / downsample, 1)
    const height = Math.max(inputBuffer.height / downsample, 1)
    this.gaussianBlurMaterial.uniforms.uResolution.value.set(width, height)

    pingpongBuffer.forEach((rt) => {
      rt.setSize(width, height)
    })

    for (let i = 0; i < loopCount * 2; i++) {
      gaussianBlurMaterial.uniforms.tDiffuse.value = firstIteration ? inputBuffer.texture : pingpongBuffer[horizontal ? 0 : 1].texture
      gaussianBlurMaterial.uniforms.uHorizontal.value = horizontal
      this.blurPass.render(renderer, inputBuffer, pingpongBuffer[horizontal ? 1 : 0])
      horizontal = !horizontal
      if (firstIteration)
        firstIteration = false
    }
  }

  dispose(): void {
    this.pingpongBuffer.forEach(rt => rt.dispose())
  }

  get finRT() {
    return this.pingpongBuffer[0]
  }
}

export { GaussianBlurPass }
