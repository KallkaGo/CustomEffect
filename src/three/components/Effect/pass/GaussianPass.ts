import { Pass, ShaderPass } from "postprocessing";
import { ShaderMaterial, Uniform, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";
import vertexShader from '../shader/GaussianBlur/vertex.glsl'
import fragmentShader from '../shader/GaussianBlur/fragment.glsl'

interface IProps {
  loopCount?: number;
}

class GaussianBlurPass extends Pass {
  private gaussianBlurMaterial: ShaderMaterial
  private pingpongBuffer: WebGLRenderTarget[] = []
  private blurPass: ShaderPass
  private loopCount: number

  constructor({ loopCount = 5 }: IProps) {
    super('GaussianBlurPass')

    this.gaussianBlurMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tDiffuse: new Uniform(null),
        uResolution: new Uniform(new Vector2(innerWidth, innerHeight)),
        uHorizontal: new Uniform(null),
      }
    })

    this.pingpongBuffer.forEach((buffer) => {
      buffer.dispose()
    })

    this.pingpongBuffer[0] = new WebGLRenderTarget(innerWidth, innerHeight)
    this.pingpongBuffer[1] = new WebGLRenderTarget(innerWidth, innerHeight)

    this.blurPass = new ShaderPass(this.gaussianBlurMaterial)

    this.loopCount = loopCount

  }

  render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget) {
    const { loopCount, pingpongBuffer, gaussianBlurMaterial } = this
    let horizontal = true;
    let firstIteration = true;

    for (let i = 0; i < loopCount * 2; i++) {
      gaussianBlurMaterial.uniforms['tDiffuse'].value = firstIteration ? inputBuffer.texture : pingpongBuffer[horizontal ? 0 : 1].texture;
      gaussianBlurMaterial.uniforms['uHorizontal'].value = horizontal
      this.blurPass.render(renderer, inputBuffer , pingpongBuffer[horizontal ? 1 : 0]);
      horizontal = !horizontal;
      if (firstIteration) firstIteration = false;
    }

  }

  get finRT() {
    return this.pingpongBuffer[0]
  }

}

export { GaussianBlurPass }