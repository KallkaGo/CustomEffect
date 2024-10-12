import { EffectComposer } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import { FC, useEffect, useRef } from "react";
import { HalfFloatType } from "three";
import Base from "@/three/components/Sketch/items/BaseEffect";
import { useFrame, useThree } from "@react-three/fiber";

const EffectWrapper = (Component: FC, props: any) => {
  return function HighOrderComponent() {
    const composerRef = useRef<any>(null);
    const composerRef2 = useRef<any>(null);
    const gl = useThree((state) => state.gl);

    useEffect(() => {
      const composer = composerRef.current;

      const composer2 = composerRef2.current;
      return () => {
        gl.setScissorTest(false);

        composer.dispose();
        composer.passes.forEach((pass: any) => {
          pass.dispose();
        });

        composer2.dispose();
        composer2.passes.forEach((pass: any) => {
          pass.dispose();
        });
      };
    });

    useFrame((state, delta) => {
      const { gl } = state;
      const composer = composerRef.current;
      const composer2 = composerRef2.current;
      const halfWidth = innerWidth / 2;
      gl.autoClear = true;
      gl.setScissorTest(true);
      gl.setScissor(0, 0, halfWidth - 5, innerHeight);
      composer.render(delta);
      gl.setScissor(halfWidth, 0, halfWidth, innerHeight);
      composer2.render(delta);
    }, 2);

    return (
      <>
        <EffectComposer frameBufferType={HalfFloatType} ref={composerRef}>
          <Component {...props} />
        </EffectComposer>
        <EffectComposer frameBufferType={HalfFloatType} ref={composerRef2}>
          <Base />
        </EffectComposer>
      </>
    );
  };
};

export { EffectWrapper };
