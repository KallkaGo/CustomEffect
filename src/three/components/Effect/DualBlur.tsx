import { Effect } from "postprocessing";
import { Texture, Uniform, WebGLRenderTarget, WebGLRenderer } from "three";
import { FC, useEffect, useMemo, useRef } from "react";
import { DualBlurPass } from "./pass/DualBlurPass";

interface IProps {
  loopCount?: number;
  blurRange?: number;
  additive?: boolean;
}

const fragmentShader = /* glsl */ `
uniform sampler2D map;
 void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    { 
        vec4 color = texture2D(map, uv);
        outputColor = color;
    }
`;

class DualBlurEffect extends Effect {
  private dualBlurPass: DualBlurPass;
  constructor(
    props: IProps = {
      loopCount: 4,
      blurRange: 0,
      additive: false,
    }
  ) {
    super("DualBlurEffect", fragmentShader, {
      uniforms: new Map([["map", new Uniform(null)]]),
    });
    this.dualBlurPass = new DualBlurPass(props);
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget<Texture>,
    deltaTime?: number | undefined
  ) {
    this.dualBlurPass.render(renderer, inputBuffer);
    this.uniforms.get("map")!.value = this.dualBlurPass.finRT.texture;
  }
}

const DualBlur = (props: IProps) => {
  const effect = useMemo(() => {
    return new DualBlurEffect(props);
  }, [props]);

  useEffect(() => {
    return () => {
      effect.dispose();
    };
  });

  return <primitive object={effect} dispose={effect.dispose} />;
};

export { DualBlur };
