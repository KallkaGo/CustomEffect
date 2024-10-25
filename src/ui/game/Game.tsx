import {
  PointerEvent as IPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { useGameStore, useInteractStore, useSceneStore } from "@utils/Store";
import { GameWrapper } from "./style";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Game = () => {
  const controlRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const aniDone = useRef(false);
  const baseParam = useRef({
    down: false,
    startPos: 0,
    curPos: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const original = useSceneStore((state) => state.original);

  useGSAP(() => {
    gsap.set(gameRef.current, { opacity: 0 });
    gsap.to(gameRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        aniDone.current = true;
      },
    });
  });

  useEffect(() => {
    useInteractStore.setState({ controlDom: controlRef.current! });
  }, []);

  const handlePointerEvent = (e: IPointerEvent, flag: boolean) => {
    console.log(e.type, flag);
    useInteractStore.setState({ touch: flag });
  };

  const handlePointerDown = (e: IPointerEvent) => {
    baseParam.current.down = true;
    baseParam.current.startPos = e.clientX;
    document.body.addEventListener("pointermove", handlePointerMove);
    document.body.addEventListener("pointerup", handlePointerUp);
    document.body.addEventListener("pointerleave", handlePointerUp);
  };

  const handlePointerUp = (e: PointerEvent) => {
    baseParam.current.down = false;
    document.body.removeEventListener("pointermove", handlePointerMove);
    document.body.removeEventListener("pointerup", handlePointerUp);
    document.body.removeEventListener("pointerleave", handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    const { down } = baseParam.current;
    if (!down) return;
    baseParam.current.curPos = e.clientX;
    const left = e.clientX / innerWidth;
    sliderRef.current!.style.left = `${left * 100}%`;
    useInteractStore.setState({ sliderPos: left});
  };

  return (
    <>
      <GameWrapper className="game" ref={gameRef}>
        <div
          className="control"
          ref={controlRef}
          onPointerDown={(e) => handlePointerEvent(e, true)}
          onPointerUp={(e) => handlePointerEvent(e, false)}
        ></div>
        <div
          className="slider-line"
          ref={sliderRef}
          style={{ display: `${original ? "none" : "flex"}` }}
        >
          <div className="line"></div>
          <div className="slider-container" onPointerDown={handlePointerDown}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              style={{ transform: "rotate(180deg)" }}
            >
              <title>Arrow</title>
              <desc>An icon representing an arrow</desc>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
            >
              <title>Arrow</title>
              <desc>An icon representing an arrow</desc>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </GameWrapper>
    </>
  );
};

export default Game;
