import type { WebGLRenderer } from 'three'
import type { Uniforms } from 'three-stdlib'
import { Pass, ShaderPass } from 'postprocessing'
import { HalfFloatType, ShaderMaterial, Uniform, Vector2, WebGLRenderTarget } from 'three'
import downFragment from '../shader/DualBlur/downFragment.glsl'
import downVertex from '../shader/DualBlur/downVertex.glsl'
import upFragment from '../shader/DualBlur/upFragment.glsl'
import upVertex from '../shader/DualBlur/upVertex.glsl'

interface IProps {
  loopCount?: number
  blurRange?: number
  additive?: boolean
}

class DualBlurPass extends Pass {
  private downSampleMaterial!: ShaderMaterial
  private upSampleMaterial!: ShaderMaterial

  private downSamplePass!: ShaderPass

  private upSamplePass!: ShaderPass

  public loopCount: number = 0

  public additive: boolean

  public finRT!: WebGLRenderTarget

  public downRt: WebGLRenderTarget[] = []

  public upRt: WebGLRenderTarget[] = []

  constructor({ loopCount = 4, blurRange = 0, additive = false }: IProps) {
    super('DualBlurPass')

    this.dispose()

    this.loopCount = loopCount

    this.additive = additive

    this.downSampleMaterial = new ShaderMaterial({
      vertexShader: downVertex,
      fragmentShader: downFragment,
      uniforms: {
        inputBuffer: new Uniform(null),
        uSize: new Uniform(new Vector2()),
        u_blurRange: new Uniform(blurRange),
        uFirst: new Uniform(false),
        uLuminanceThreshold: new Uniform(0),
      },
    })

    this.downSampleMaterial.name = 'DualBlur.downSampleMaterial'

    this.upSampleMaterial = new ShaderMaterial({
      vertexShader: upVertex,
      fragmentShader: upFragment,
      uniforms: {
        inputBuffer: new Uniform(null),
        uSize: new Uniform(new Vector2()),
        u_blurRange: new Uniform(blurRange),
        uCurDownSample: new Uniform(null),
      },
    })

    this.upSampleMaterial.name = 'DualBlur.upSampleMaterial'

    this.downSamplePass = new ShaderPass(this.downSampleMaterial)

    this.upSamplePass = new ShaderPass(this.upSampleMaterial)

    this.finRT = new WebGLRenderTarget(1, 1, {
      type: HalfFloatType,
    })

    // initial
    for (let i = 0; i < this.loopCount; i++) {
      const rtDown = new WebGLRenderTarget(1, 1, {
        type: HalfFloatType,
      })
      const rtUp = new WebGLRenderTarget(1, 1, {
        type: HalfFloatType,
      })
      this.downRt[i] = rtDown
      this.upRt[i] = rtUp
    }
  }

  render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget) {
    const count = this.loopCount
    let width = inputBuffer.width
    let height = inputBuffer.height
    const { downRt, upRt } = this

    // down sample
    for (let i = 0; i < count; i++) {
      width = Math.max(Math.floor((width + 1) / 2), 1)
      height = Math.max(Math.floor((height + 1) / 2), 1)
      downRt[i].setSize(width, height)
      upRt[i].setSize(width, height)
      this.finRT.setSize(width, height)
      this.downSampleMaterial.uniforms.uSize.value.set(
        1 / downRt[i].width,
        1 / downRt[i].height,
      )

      this.downSampleMaterial.uniforms.uFirst.value = false

      if (i === 0) {
        this.finRT.texture = inputBuffer.texture
        this.additive && (this.downSampleMaterial.uniforms.uFirst.value = true)
      }
      this.downSamplePass.render(renderer, this.finRT, downRt[i])
      this.finRT.texture = downRt[i].texture
    }
    // up sample
    for (let i = count - 2; i >= 0; i--) {
      this.finRT.setSize(upRt[i].width, upRt[i].height)
      this.upSampleMaterial.uniforms.uSize.value.set(1 / upRt[i].width, 1 / upRt[i].height)
      this.additive && (this.upSampleMaterial.uniforms.uCurDownSample.value = downRt[i].texture)
      this.upSamplePass.render(renderer, this.finRT, upRt[i])
      this.finRT.texture = upRt[i].texture
    }
  }

  get LuminanceThreshold(): Uniforms {
    return this.downSampleMaterial.uniforms
  }

  set LuminanceThreshold(value: number) {
    this.LuminanceThreshold.uLuminanceThreshold.value = value
  }

  dispose() {
    const { downRt, upRt } = this
    downRt.forEach(rt => rt.dispose())
    upRt.forEach(rt => rt.dispose())
    this.finRT && this.finRT.dispose()
    this.downSampleMaterial && this.downSampleMaterial.dispose()
    this.upSampleMaterial && this.upSampleMaterial.dispose()
  }
}

export { DualBlurPass }
