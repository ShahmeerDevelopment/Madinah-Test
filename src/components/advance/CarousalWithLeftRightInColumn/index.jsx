/* eslint-disable indent */
"use client";

import StackComponent from "@/components/atoms/StackComponent";
import PropTypes from "prop-types";
import React from "react";
import SectionHeading from "../SectionHeading";
import SectionSubheading from "../SectionSubheading";
import CarouselComponentWithParentControls from "@/components/molecules/CarouselComponentWithParentControls";
import useControls from "@/components/molecules/CarouselComponentWithParentControls/useControls";
import LeftRightArrows from "@/components/UI/Discover/UI/LeftRightArrows";

//Next
const CarousalWithLeftRightInColumn = ({
  children,
  itemClassName = "country-card",
  heading,
  subHeading,
  slidesToShow = 4,
  itemStyleOverrides,
  draggable = true,
  headingStyles,
  headerStyles,
  showArrows = true,
  mobileViewSlidesToShow = 1,
  slideToShowIn1080 = 2,
}) => {
  const { sliderRef, goToNext, goToPrev } = useControls();

  return (
    <>
      <StackComponent alignItems="center" sx={{ ...headerStyles }}>
        <StackComponent sx={{ flexGrow: 1 }} direction="column" spacing="4px">
          {heading ? (
            <SectionHeading sx={{ ...headingStyles }}>{heading}</SectionHeading>
          ) : null}
          {subHeading ? (
            <SectionSubheading>{subHeading}</SectionSubheading>
          ) : null}
        </StackComponent>
        {showArrows ? (
          <LeftRightArrows rightAction={goToNext} leftAction={goToPrev} />
        ) : null}
      </StackComponent>
      <CarouselComponentWithParentControls
        draggable={draggable}
        sliderRef={sliderRef}
        slidesToShow={slidesToShow}
        slideToShowIn1080={slideToShowIn1080}
        infinite={true}
        mobileViewSlidesToShow={mobileViewSlidesToShow}
        containerStyleOverrides={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          "& .carousel-container": {
            width: "100%",
          },
          [`& .${itemClassName}`]: {
            margin: "0 auto",
            ...itemStyleOverrides,
          },
          "& .action-btn": {
            marginBottom: "1rem",
          },
        }}
      >
        {children}
      </CarouselComponentWithParentControls>
    </>
  );
};

CarousalWithLeftRightInColumn.propTypes = {
  children: PropTypes.any,
  draggable: PropTypes.bool,
  headerStyles: PropTypes.any,
  heading: PropTypes.any,
  headingStyles: PropTypes.any,
  itemClassName: PropTypes.string,
  itemStyleOverrides: PropTypes.any,
  showArrows: PropTypes.bool,
  slidesToShow: PropTypes.number,
  subHeading: PropTypes.any,
  mobileViewSlidesToShow: PropTypes.number,
  slideToShowIn1080: PropTypes.number,
};

export default CarousalWithLeftRightInColumn;
