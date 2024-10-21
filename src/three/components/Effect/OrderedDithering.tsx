import { Effect } from "postprocessing";
import fragmentShader from "./shader/OrderredDithering/fragment.glsl";
import { Uniform } from "three";
import { useEffect, useMemo } from "react";

interface IProps {
  colorNum?: number;
}

class OrderedDitheringEffect extends Effect {
  constructor(props: IProps) {
    super("OrderedDithering", fragmentShader, {
      uniforms: new Map([["uColorNum", new Uniform(props.colorNum)]]),
    });
  }
}

export default function OrderedDithering(props: IProps = { colorNum: 4 }) {
  const effect = useMemo(() => {
    return new OrderedDitheringEffect(props);
  }, [JSON.stringify(props)]);

  useEffect(() => {
    return () => {
      effect.dispose();
    };
  });

  return <primitive object={effect} dispose={effect.dispose} />;
}
