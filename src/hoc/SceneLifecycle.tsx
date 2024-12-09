import { useGameStore, useInteractStore, useLoadedStore } from "@utils/Store";
import { FC, useEffect } from "react";

export const SceneLifecycle = (WrappedComponent: FC, scissor = true) => {
  return function SceneLifecycleWrapper(props: any) {
    useEffect(() => {
      useLoadedStore.setState({ ready: true });
      useInteractStore.setState({ controlEnable: true });
      useGameStore.setState({ showSlider: scissor });

      return () => {
        useGameStore.setState({ showSlider: false });
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
};
