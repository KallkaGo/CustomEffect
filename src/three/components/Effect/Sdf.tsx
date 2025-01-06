import { Effect } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import fragmenrShader from './shader/Sdf/fragment.glsl'

class SdfTemplateEffect extends Effect {
  constructor() {
    super('GTToneMap', fragmenrShader, {
      uniforms: new Map<string, any>([
        
      ]),
    })
  }
}

export default function SdfTemplate(

) {
  const effect = useMemo(() => {
    return new SdfTemplateEffect()
  }, [])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  })

  return <primitive object={effect} dispose={effect.dispose} />
}
