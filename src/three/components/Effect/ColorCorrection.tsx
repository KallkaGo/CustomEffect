import type {
  Texture,
} from 'three'
import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import {
  Color,
  Uniform,
  Vector2,
} from 'three'
import fragmenrShader from './shader/ColorCorrection/fragment.glsl'

interface IProps {
  diffuse?: Texture
  saturationAmount?: number
  contrastAmount?: number
  vignetteAmount?: number
  refColor?: string
  dimension?: string
  mode: string
}

class ColorCorrectionEffect extends Effect {
  constructor(props: IProps = {
    mode: 'SATURATION',
  }) {
    super('ColorCorrection', fragmenrShader, {
      defines: new Map<string, any>([[`MODE_${props.mode}`, '']]),
      uniforms: new Map<string, any>([
        ['uDiffuse', new Uniform(props.diffuse)],
        ['uSaturationAmount', new Uniform(props.saturationAmount)],
        ['uContrastAmount', new Uniform(props.contrastAmount)],
        ['uRefColor', new Uniform(new Color(props.refColor))],
        ['uVignetteAmount', new Uniform(props.vignetteAmount)],
        ['uDimension', new Uniform(props.dimension)],
        ['uImageSize', new Uniform(new Vector2(1920, 1080))],
      ]),
    })
  }
}

function ColorCorrection(props: IProps) {
  const effect = useMemo(() => {
    return new ColorCorrectionEffect(props)
  }, [props])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  })

  return <primitive object={effect} dispose={effect.dispose} />
}

export { ColorCorrection }
