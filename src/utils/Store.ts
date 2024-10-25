import { create } from "zustand";
/**
 * 用户交互状态
 */
const useInteractStore = create(() => ({
    touch: false,
    auto: false,
    demand: false,
    isMute: false,
    audioAllowed: false,
    browserHidden: false,
    begin: false,
    controlDom: document.createElement("div"),  //控制器的dom
    end: false,
    sliderPos: 0.5,
}));

const useGameStore = create(() => ({
    time: 0,
    transfer: false,
    bodyColor: '#26d6e9'
}));


const useSceneStore = create(() => ({
    original: true,
    dualblur: false,
    gaussianblur: false,
    diffusion: false,
    bloom: false,
    gtToneMap: false,
    retro: false
}));

const useLoadedStore = create(() => ({
    ready: false,
}));


export { useInteractStore, useGameStore, useLoadedStore, useSceneStore };
