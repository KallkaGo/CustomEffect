import { Effect } from "postprocessing";
import { Texture, Uniform, WebGLRenderTarget, WebGLRenderer } from "three";
import { FC, useEffect, useMemo, useRef } from "react";
import { GaussianBlurPass } from "./pass/GaussianPass";

interface IProps {
  loopCount?: number;
  downsample?: number;
  threshold?: number;
}

const fragmentShader = /* glsl */ `
uniform sampler2D map;
uniform float threshold;

float getBrightness(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

 void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    { 
        vec4 blendcolor = texture2D(map, uv);
        vec4 baseColor = inputColor;

        // 从模糊后的图像中提取暗部区域
        float brightness = getBrightness(blendcolor.rgb);
        vec3 resultColor = baseColor.rgb;
        if(brightness < threshold) {
          resultColor = mix(baseColor, blendcolor, 0.5).rgb;
        }
        outputColor = vec4(resultColor, baseColor.a);
    }
`;

class DiffusionEffect extends Effect {
  private gaussianBlurPass: GaussianBlurPass;
  constructor(
    props: IProps = {
      loopCount: 5,
      downsample: 2,
      threshold: 0.5,
    }
  ) {
    super("DualBlurEffect", fragmentShader, {
      uniforms: new Map<string, any>([
        ["map", new Uniform(null)],
        ["threshold", new Uniform(props.threshold)],
      ]),
    });
    this.gaussianBlurPass = new GaussianBlurPass(props);
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget<Texture>,
    deltaTime?: number | undefined
  ) {
    this.gaussianBlurPass.render(renderer, inputBuffer);
    this.uniforms.get("map")!.value = this.gaussianBlurPass.finRT.texture;
  }

  dispose(): void {
    this.gaussianBlurPass.dispose();
  }
}

const Diffusion = (props: IProps) => {
  const effect = useMemo(() => {
    return new DiffusionEffect(props);
  }, [props]);

  useEffect(() => {
    return () => {
      effect.dispose();
    };
  });

  return <primitive object={effect} dispose={effect.dispose} />;
};

export { Diffusion };
