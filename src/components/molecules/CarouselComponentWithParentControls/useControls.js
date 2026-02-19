/* eslint-disable indent */
import { useRef } from "react";

const useControls = () => {
  const sliderRef = useRef();

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  return { sliderRef, goToNext, goToPrev };
};

export default useControls;
