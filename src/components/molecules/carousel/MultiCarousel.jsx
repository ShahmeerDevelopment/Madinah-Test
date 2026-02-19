"use client";

import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PropTypes from "prop-types";
// import useResponsiveScreen from "@/hooks/useResponsiveScreen";

import styles from "./style.module.css";

const MultiCarousel = ({ children }) => {
  //   const { isGreaterThan } = useResponsiveScreen(370);
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 40,
    },
    tablet: {
      breakpoint: { max: 1024, min: 500 },
      items: 3,
      partialVisibilityGutter: 10,
    },
    mobile: {
      breakpoint: { max: 480, min: 300 },
      items: 2,
      partialVisibilityGutter: 20,
    },
  };
  return (
    <>
      <Carousel
        responsive={responsive}
        additionalTransfrom={0}
        arrows={false}
        centerMode={false}
        // className=""
        containerClass={styles.container}
        // dotListClass=""
        // draggable
        // focusOnSelect={false}
        infinite={false}
        itemClass={styles.carouselItem}
        // minimumTouchDrag={80}
        partialVisible
        // rewind={false}
        // rewindWithAnimation={false}
        // rtl={false}
        // shouldResetAutoplay
        // showDots={false}
        // sliderClass=""
        // slidesToSlide={1}
        // swipeable
        preventDefaultTouchmoveEvent={true}
      >
        {children}
      </Carousel>
    </>
  );
};

MultiCarousel.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MultiCarousel;
