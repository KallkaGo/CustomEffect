import { Effect } from "postprocessing";
import { useEffect, useMemo } from "react";

class BaseEffect extends Effect {
  constructor() {
    super(
      "BaseEffect",
      /*glsl*/ `
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        outputColor = inputColor;
      }
      `
    );
  }
}

export default function Base() {
  const effect = useMemo(() => {
    return new BaseEffect();
  }, []);

  return <primitive object={effect} />;
}


