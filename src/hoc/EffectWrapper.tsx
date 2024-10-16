import { EffectComposer } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import { FC, useEffect, useRef } from "react";
import { HalfFloatType } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useInteractStore } from "@utils/Store";

const EffectWrapper = (Component: FC, props: any) => {
  return function HighOrderComponent() {
    const composerRef = useRef<any>(null);
    const composerRef2 = useRef<any>(null);
    const gl = useThree((state) => state.gl);

    useEffect(() => {
      const composer = composerRef.current;
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
      const composer2 = composerRef2.current;
      const halfWidth = innerWidth / 2;
      const sliderPos = useInteractStore.getState().sliderPos;
      gl.autoClear = true;
      gl.setScissorTest(true);
      gl.setScissor(0, 0, sliderPos - 2, innerHeight);
      composer.render(delta);
      gl.setScissor(sliderPos + 2, 0, innerWidth - sliderPos + 2, innerHeight);
      gl.render(state.scene, state.camera);
    },1);

    return (
      <>
        <EffectComposer frameBufferType={HalfFloatType} ref={composerRef} disableNormalPass >
          <Component {...props} />
        </EffectComposer>
      </>
    );
  };
};

export { EffectWrapper };
