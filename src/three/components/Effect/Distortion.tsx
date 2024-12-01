import { Effect } from "postprocessing";
import fragmenrShader from "./shader/Distortion/fragment.glsl";
import {
  Color,
  Texture,
  Uniform,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { useEffect, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { useGameStore } from "@utils/Store";

interface IProps {
  porgress?: number;
  highLight?: Color;
  diffuse?: Texture;
  animation?: boolean;
  blendWidthDiffuse?: boolean;
}

class DistortionEffect extends Effect {
  private animation: boolean;
  constructor(props: IProps) {
    super("Distortion", fragmenrShader, {
      defines: props.blendWidthDiffuse
        ? new Map([["BLEND_WIDTH_DIFFUSE", ""]])
        : undefined,
      uniforms: new Map<string, any>([
        ["uPorgress", new Uniform(props.porgress)],
        ["uHighLight", new Uniform(new Color(props.highLight))],
        ["uDiffuse", new Uniform(props.diffuse)],
        ["uCenter", new Uniform(new Vector2(0.5, 0.5))],
      ]),
    });
    this.animation = props.animation!;
  }
  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    deltaTime?: number
  ): void {
    if (this.animation) {
      this.uniforms.get("uPorgress")!.value = useGameStore.getState().progress;
    }
  }
}

export default function Distortion(props: IProps = {}) {
  const effect = useMemo(() => {
    return new DistortionEffect(props);
  }, [props]);

  useEffect(() => {
    return () => {
      effect.dispose();
    };
  });

  return <primitive object={effect} dispose={effect.dispose} />;
}
