"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

// Next
const CarouselComponentWithParentControls = ({
  children,
  slidesToShow = 3,
  containerStyleOverrides,
  sliderRef,
  draggable = true,
  infinite = false,
  centerMode = false,
  className = "carousel-container",
  variableWidth = false,
  mobileViewSlidesToShow = 1,
  vertical = false,
  verticalSwiping = false,
  slideToShowIn1080 = 2,
  slideToShowIn780 = 2,
  ...otherSettings
}) => {
  const settings = {
    dots: false,
    infinite: infinite,
    speed: 200,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    centerMode,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    vertical: vertical,
    verticalSwiping: verticalSwiping,
    draggable,
    ref: sliderRef,
    variableWidth,
    responsive: [
      {
        breakpoint: 1400, // tablet breakpoint
        settings: {
          slidesToShow: slidesToShow, // 2 items for tablet view
        },
      },
      {
        breakpoint: 1080, // mobile breakpoint
        settings: {
          slidesToShow: slideToShowIn1080, // 1 item for mobile view
        },
      },
      {
        breakpoint: 780, // mobile breakpoint
        settings: {
          slidesToShow: slideToShowIn780,
        },
      },

      {
        breakpoint: 714, // mobile breakpoint
        settings: {
          slidesToShow: mobileViewSlidesToShow,
        },
      },
    ],
    ...otherSettings,
  };

  return (
    <BoxComponent sx={{ ...containerStyleOverrides }}>
      <div className={className}>
        <Slider {...settings}>{children}</Slider>
      </div>
    </BoxComponent>
  );
};

CarouselComponentWithParentControls.propTypes = {
  centerMode: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  containerStyleOverrides: PropTypes.any,
  draggable: PropTypes.bool,
  infinite: PropTypes.bool,
  mobileViewSlidesToShow: PropTypes.number,
  sliderRef: PropTypes.any.isRequired,
  slidesToShow: PropTypes.number,
  variableWidth: PropTypes.bool,
  vertical: PropTypes.bool,
  verticalSwiping: PropTypes.bool,
  slideToShowIn1080: PropTypes.number,
  slideToShowIn780: PropTypes.number,
};

export default CarouselComponentWithParentControls;
