import { EffectComposer } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import { FC, useEffect, useRef } from "react";
import { HalfFloatType } from "three";

const EffectWrapper = (Component: FC, props: any) => {
  return function HighOrderComponent() {
    const composerRef = useRef<any>(null);

    useEffect(() => {
      const composer = composerRef.current;
      return () => {
        composer.dispose();
        composer.passes.forEach((pass: any) => {
          pass.dispose();
        });
      };
    });

    return (
      <EffectComposer frameBufferType={HalfFloatType} ref={composerRef}>
        <Component {...props} />
      </EffectComposer>
    );
  };
};

export { EffectWrapper };
