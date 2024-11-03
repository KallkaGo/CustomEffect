import { Effect } from "postprocessing";
import fragmenrShader from "./shader/QuantizationAndToneMap/fragment.glsl";
import { Texture, Uniform } from "three";
import { useEffect, useMemo } from "react";

interface IProps {
  adjustment?: number;
  tex?: Texture
}

class QuantizationAndToneMapEffect extends Effect {
  constructor(props: IProps) {
    super("GTToneMap", fragmenrShader, {
      uniforms: new Map<string, any>([
        ["uAdjustment", new Uniform(props.adjustment)],
        ["uTex", new Uniform(props.tex)],
      ]),
    });
  }
}

export default function QuantizationAndToneMap(
  props: IProps = {
    adjustment: 1.5,
  }
) {
  const effect = useMemo(() => {
    return new QuantizationAndToneMapEffect(props);
  }, [JSON.stringify(props)]);

  useEffect(() => {
    return () => {
      effect.dispose();
    };
  });

  return <primitive object={effect} dispose={effect.dispose} />;
}
