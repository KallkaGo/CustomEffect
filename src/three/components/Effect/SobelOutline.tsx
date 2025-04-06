import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { type Texture, Uniform } from 'three'
import fragmenrShader from './shader/SobelOutline/fragment.glsl'

interface IProps {
  depthTexture?: Texture
  normalTexture?: Texture
  depthScale: number
  depthBias: number
  normalScale: number
  normalBias: number
  thickness: number
}

class SobelOutlineEffect extends Effect {
  constructor(props: IProps = {
    depthScale: 1,
    depthBias: 1,
    normalScale: 1,
    normalBias: 1,
    thickness: 1
  }) {
    super('SobelOutline', fragmenrShader, {
      uniforms: new Map<string, any>([
        ['uDepthTexture', new Uniform(props?.depthTexture)],
        ['uNormalTexture', new Uniform(props?.normalTexture)],
        ['uOutLineDepthMul', new Uniform(props.depthScale)],
        ['uOutLineDepthBias', new Uniform(props.depthBias)],
        ['uOutLineNormalMul', new Uniform(props.normalScale)],
        ['uOutLineNormalBias', new Uniform(props.normalBias)],
        ['uThickness', new Uniform(props.thickness)],
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
  },[])

  return <primitive object={effect} dispose={effect.dispose} />
}
