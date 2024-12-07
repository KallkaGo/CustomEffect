import { Effect } from "postprocessing";
import fragmentShader from "./shader/Retro/fragment.glsl";
import { Uniform, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";
import { useEffect, useMemo } from "react";
import { useInteractStore } from "@utils/Store";

interface IProps {
  colorNum?: number;
  pixelSize?: number;
  maskIntensity?: number;
  curveIntensity?: number;
}

class RetroEffect extends Effect {
  constructor(props: IProps) {
    super("OrderedDithering", fragmentShader, {
      uniforms: new Map<string, any>([
        ["uColorNum", new Uniform(props.colorNum)],
        ["uPixelSize", new Uniform(props.pixelSize)],
        ["uMaskIntensity", new Uniform(props.maskIntensity)],
        ["uResolution", new Uniform(new Vector2())],
        ["uCurveIntensity", new Uniform(props.curveIntensity)],
      ]),
    });
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    deltaTime?: number
  ): void {
    const slidePos = useInteractStore.getState().sliderPos;

    this.uniforms
      .get("uResolution")!
      .value.set(
        slidePos * innerWidth * devicePixelRatio,
        innerHeight * devicePixelRatio
      );
  }
}

export default function Retro(props: IProps = { colorNum: 4 }) {
  const effect = useMemo(() => {
    return new RetroEffect(props);
  }, [JSON.stringify(props)]);

  useEffect(() => {
    return () => {
      effect.dispose();
    };
  });

  return <primitive object={effect} dispose={effect.dispose} />;
}
