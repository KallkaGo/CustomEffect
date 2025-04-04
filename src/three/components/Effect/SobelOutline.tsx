import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { type Texture, Uniform } from 'three'
import fragmenrShader from './shader/SobelOutline/fragment.glsl'

interface IProps {
  depthTexture: Texture
  normalTexture: Texture
  cameraNear: number
  cameraFar: number
  depthScale: number
  depthBias: number
  normalScale: number
  normalBias: number
}

class SobelOutlineEffect extends Effect {
  constructor(props: IProps) {
    super('SobelOutline', fragmenrShader, {
      uniforms: new Map<string, any>([
        ['uDepthTexture', new Uniform(props.depthTexture)],
        ['uNormalTexture', new Uniform(props.normalTexture)],
        ['uCameraNear', new Uniform(props.cameraNear)],
        ['uCameraFar', new Uniform(props.cameraFar)],
        ['uOutLineDepthMul', new Uniform(props.depthScale ?? 1)],
        ['uOutLineDepthBias', new Uniform(props.depthBias ?? 1)],
        ['uOutLineNormalMul', new Uniform(props.normalScale ?? 1)],
        ['uOutLineNormalBias', new Uniform(props.normalBias ?? 1)],
      ]),
    })
  }
}

export default function SobelOutline(props: IProps) {
  const effect = useMemo(() => {
    return new SobelOutlineEffect(props)
  }, [props])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  })

  return <primitive object={effect} dispose={effect.dispose} />
}
