"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import PropTypes from "prop-types";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import BackIcon from "@/assets/icons/BackIcon";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import OutlinedIconButton from "@/components/advance/OutlinedIconButton";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

// Next
const ReuseAbleSlider = ({
  slidesToShowFullView = 10,
  slidesToShowAt800px = 7,
  slidesToShowAt600px = 5,
  slidesToShowAt480px = 3,
  slidesToShowAt370px = 3,
  children,
  totalArrayLength,
  isLeftPadding = true,
  isDragAble = true,
  isOrganization = false,
  isVoice = false,
}) => {
  const sliderRef = useRef();
  const { isSmallScreen } = useResponsiveScreen();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderSpeed, setSliderSpeed] = useState(8000); // Slow speed by default
  const [isPlaying, setIsPlaying] = useState(isOrganization); // Control autoplay manually
  const [isPlayingOrg, setIsPlayingOrg] = useState(isOrganization); // Control autoplay for organization

  useEffect(() => {
    if (isOrganization && isPlayingOrg) {
      const interval = setInterval(() => {
        sliderRef.current.slickNext();
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPlayingOrg, isOrganization]);

  const toggleAutoplay = (resume) => {
    if (isOrganization) {
      setIsPlayingOrg(resume);
      setIsPlaying(resume);
    }
  };

  useEffect(() => {
    const handleSpeedReset = () => {
      if (sliderSpeed === 300) {
        setTimeout(() => {
          setSliderSpeed(8000); // Reset to slow speed after transition
        }, 300); // Wait for the quick transition to finish
      }
    };

    handleSpeedReset();

    return () => {
      clearTimeout(handleSpeedReset);
    };
  }, [sliderSpeed]);

  const settings = {
    dots: false,
    infinite: isOrganization
      ? true
      : Number(totalArrayLength) > Number(slidesToShowFullView),
    speed: isOrganization ? 3000 : sliderSpeed,
    slidesToShow: Number(slidesToShowFullView),
    swipeToSlide: isSmallScreen ? false : true,
    arrows: true,
    cssEase: "linear",
    draggable: isDragAble,
    autoplay: isOrganization ? isPlayingOrg : isPlaying,
    autoplaySpeed: isOrganization ? 0 : 0,
    fade: false,
    afterChange: (index) => {
      (setCurrentSlide(index), setSliderSpeed(6000)); // Ensure speed is reset when auto-sliding
    },

    ref: sliderRef,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Number(slidesToShowFullView) },
      },
      {
        breakpoint: 800,
        settings: { slidesToShow: Number(slidesToShowAt800px) },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: Number(slidesToShowAt600px) },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: Number(slidesToShowAt480px) },
      },
      {
        breakpoint: 370,
        settings: { slidesToShow: Number(slidesToShowAt370px) },
      },
    ],
  };

  const goToNext = (e) => {
    if (e) e.target.blur();
    setSliderSpeed(300); // Set fast speed for manual change
    if (isOrganization) {
      toggleAutoplay(false); // Stop autoplay permanently for organization only
      sliderRef.current.slickGoTo(currentSlide + 5);
    } else {
      sliderRef.current.slickNext();
    }
  };
  const goToPrev = (e) => {
    if (e) e.target.blur();
    setSliderSpeed(300); // Set fast speed for manual change
    if (isOrganization) {
      toggleAutoplay(false); // Stop autoplay permanently for organization only
      sliderRef.current.slickGoTo(currentSlide - 5);
    } else {
      sliderRef.current.slickPrev();
    }
  };

  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled =
    currentSlide >= totalArrayLength - settings.slidesToShow;

  return (
    <>
      <BoxComponent
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {!isVoice && (
          <BoxComponent
            sx={{ width: "5%", display: { xs: "none", sm: "block" } }}
          >
            <OutlinedIconButton
              onClick={(e) => goToPrev(e)}
              disabled={isPrevDisabled && !isOrganization}
              sx={{
                overflow: "hidden",
                zIndex: 2,
                "&.Mui-disabled": { background: "#ffffff !important" },
                cursor:
                  isPrevDisabled && !isOrganization ? "default" : "pointer",
                pointerEvents:
                  isPrevDisabled && !isOrganization ? "none" : "auto",
              }}
            >
              <BackIcon isDisabled={isPrevDisabled && !isOrganization} />
            </OutlinedIconButton>
          </BoxComponent>
        )}
        <BoxComponent
          sx={{
            width: { xs: "100%", sm: isVoice ? "100%" : "90%" },
            paddingLeft: isLeftPadding ? "10px !important" : "auto",
          }}
        >
          <Slider {...settings}>{children}</Slider>
        </BoxComponent>
        {!isVoice && (
          <BoxComponent
            sx={{ display: { xs: "none", sm: "block" }, width: "5%" }}
          >
            <OutlinedIconButton
              onClick={(e) => goToNext(e)}
              disabled={isNextDisabled && !isOrganization}
              sx={{
                overflow: "hidden",
                zIndex: 2,
                "&.Mui-disabled": { background: "#ffffff !important" },
                cursor:
                  isNextDisabled && !isOrganization ? "default" : "pointer",
                pointerEvents:
                  isNextDisabled && !isOrganization ? "none" : "auto",
              }}
            >
              <BackIcon
                isDisabled={isNextDisabled && !isOrganization}
                style={{ transform: "rotateY(180deg)" }}
              />
            </OutlinedIconButton>
          </BoxComponent>
        )}
      </BoxComponent>
    </>
  );
};

ReuseAbleSlider.propTypes = {
  slidesToShowFullView: PropTypes.number,

  slidesToShowAt800px: PropTypes.number,

  slidesToShowAt600px: PropTypes.number,

  slidesToShowAt480px: PropTypes.number,
  slidesToShowAt370px: PropTypes.number,
  isDragAble: PropTypes.bool,
  children: PropTypes.node,
  totalArrayLength: PropTypes.number,
  isLeftPadding: PropTypes.bool,
  isOrganization: PropTypes.bool,
};

export default React.memo(ReuseAbleSlider);
