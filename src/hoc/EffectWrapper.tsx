import { EffectComposer } from "@react-three/postprocessing";
import { FC, useEffect, useRef } from "react";
import { Color, HalfFloatType } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useInteractStore } from "@utils/Store";

const EffectWrapper = (Component: FC, props: any) => {
  return function HighOrderComponent() {
    const composerRef = useRef<any>(null);
    const gl = useThree((state) => state.gl);
    const scene = useThree((state) => state.scene);

    useEffect(() => {
      const composer = composerRef.current;
      const bgColor = props.background;

      if (bgColor) {
        scene.background = new Color(bgColor);
      } else {
        scene.background = new Color("black");
      }
      return () => {
        gl.setScissorTest(false);

        composer.dispose();
        composer.passes.forEach((pass: any) => {
          pass.dispose();
        });
      };
    });

    useFrame((state, delta) => {
      const { gl } = state;
      const composer = composerRef.current;
      const sliderPos = useInteractStore.getState().sliderPos;
      gl.autoClear = true;
      gl.setScissorTest(true);
      gl.setScissor(0, 0, sliderPos * innerWidth - 2, innerHeight);
      composer.render(delta);
      gl.setScissor(
        sliderPos * innerWidth + 2,
        0,
        innerWidth - sliderPos * innerWidth + 2,
        innerHeight
      );
      gl.render(state.scene, state.camera);
    }, 1);

    return (
      <>
        <EffectComposer
          frameBufferType={HalfFloatType}
          ref={composerRef}
          disableNormalPass
        >
          <Component {...props} />
        </EffectComposer>
      </>
    );
  };
};

export { EffectWrapper };
