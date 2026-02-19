"use client";

import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types";
import IconButtonComp from "../../atoms/buttonComponent/IconButtonComp";

import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import OutlinedIconButton from "../../advance/OutlinedIconButton";
import BackIcon from "../../../assets/icons/BackIcon";

const ButtonElementController = ({ outlinedBtns, children, ...otherProps }) => {
  if (outlinedBtns) {
    return (
      <OutlinedIconButton className="action-btn" {...otherProps}>
        {children}
      </OutlinedIconButton>
    );
  } else {
    return (
      <IconButtonComp className="action-btn" {...otherProps}>
        {children}
      </IconButtonComp>
    );
  }
};

ButtonElementController.propTypes = {
  children: PropTypes.any,
  outlinedBtns: PropTypes.any,
};

const SlickCarousel = ({
  children,
  slidesToShow = 3,
  containerStyleOverrides,
  adjuscantBtns = false,
  outlinedBtns = false,
}) => {
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Calculate total slides and determine button states
  const childrenArray = React.Children.toArray(children);
  const totalSlides = childrenArray.length;
  const effectiveSlidesToShow = Math.min(slidesToShow, totalSlides);
  const maxSlideIndex = Math.max(0, totalSlides - effectiveSlidesToShow);

  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide >= maxSlideIndex;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(slidesToShow, totalSlides),
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    ref: sliderRef,
    afterChange: (current) => {
      setCurrentSlide(current);
    },
    responsive: [
      {
        breakpoint: 1400, // tablet breakpoint
        settings: {
          slidesToShow: Math.min(slidesToShow, totalSlides),
        },
      },
      {
        breakpoint: 1080, // mobile breakpoint
        settings: {
          slidesToShow: Math.min(3, totalSlides),
        },
      },
      {
        breakpoint: 780, // mobile breakpoint
        settings: {
          slidesToShow: Math.min(2, totalSlides),
        },
      },
      {
        breakpoint: 554, // mobile breakpoint
        settings: {
          slidesToShow: Math.min(1, totalSlides),
        },
      },
    ],
  };
  const goToNext = () => sliderRef.current.slickNext();
  const goToPrev = () => sliderRef.current.slickPrev();
  return (
    <BoxComponent sx={{ ...containerStyleOverrides }}>
      {adjuscantBtns ? null : (
        <BoxComponent
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mr: 2,
            mb: 2,
          }}
        >
          <ButtonElementController
            outlinedBtns={outlinedBtns}
            onClick={goToPrev}
            disabled={isPrevDisabled}
          >
            <BackIcon />
          </ButtonElementController>
          <ButtonElementController
            outlinedBtns={outlinedBtns}
            onClick={goToNext}
            disabled={isNextDisabled}
          >
            <BackIcon style={{ transform: "rotateY(180deg)" }} />
          </ButtonElementController>
        </BoxComponent>
      )}
      {adjuscantBtns ? (
        <ButtonElementController
          outlinedBtns={outlinedBtns}
          onClick={goToPrev}
          disabled={isPrevDisabled}
        >
          <BackIcon />
        </ButtonElementController>
      ) : null}
      <div className="carousel-container">
        <Slider {...settings}>{children}</Slider>
      </div>
      {adjuscantBtns ? (
        <ButtonElementController
          outlinedBtns={outlinedBtns}
          onClick={goToNext}
          disabled={isNextDisabled}
        >
          <BackIcon style={{ transform: "rotateY(180deg)" }} />
        </ButtonElementController>
      ) : null}
    </BoxComponent>
  );
};

SlickCarousel.propTypes = {
  adjuscantBtns: PropTypes.bool,
  children: PropTypes.node.isRequired,
  containerStyleOverrides: PropTypes.any,
  outlinedBtns: PropTypes.bool,
  slidesToShow: PropTypes.number,
};

export default SlickCarousel;
