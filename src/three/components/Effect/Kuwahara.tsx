import { Effect } from "postprocessing";
import fragmenrShader from "./shader/Kuwahara/fragment.glsl";
import { Uniform } from "three";
import { useEffect, useMemo } from "react";

interface IProps {
  radius?: number;
}

class KuwaharaEffect extends Effect {
  constructor(props: IProps) {
    super("GTToneMap", fragmenrShader, {
      uniforms: new Map([
        ["uRadius", new Uniform(props.radius)],
      ]),
    });
  }
}

export default function Kuwahara(
  props: IProps = {
    radius: 8,
  }
) {
  const effect = useMemo(() => {
    return new KuwaharaEffect(props);
  }, [JSON.stringify(props)]);

  useEffect(() => {
    return () => {
      effect.dispose();
    };
  });

  return <primitive object={effect} dispose={effect.dispose} />;
}
