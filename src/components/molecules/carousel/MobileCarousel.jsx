"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import PropTypes from "prop-types";
import styles from "./style.module.css";

import { FreeMode } from "swiper/modules";

const MobileCarousel = ({
  children,
  slideWidth = 180,
  spaceBetween = 0,
  ...rest
}) => {
  const swiperRef = useRef(null);

  const handleReachEnd = () => {
    const swiperInstance = swiperRef.current?.swiper || swiperRef.current;
    if (!swiperInstance) return;

    const wrapper = swiperInstance.wrapperEl;
    if (!wrapper) return;

    // Get the position of the last slide
    const lastSlide = wrapper.querySelector(".swiper-slide:last-child");
    if (!lastSlide) return;

    const lastSlideRect = lastSlide.getBoundingClientRect();

    // Get the position of the container
    const containerRect = wrapper.parentNode.getBoundingClientRect();

    // Check if the last slide is clipped
    if (lastSlideRect.right > containerRect.right) {
      // Scroll to make the last item fully visible
      swiperInstance.slideTo(swiperInstance.slides.length - 2);
    }

    // If there's empty space on the right, adjust the last slide position to fill the gap
    if (lastSlideRect.right < containerRect.right) {
      const offset = containerRect.right - lastSlideRect.right;
      swiperInstance.setTranslate(swiperInstance.translate - offset);
    }
  };
  return (
    <div>
      <Swiper
        ref={swiperRef}
        slidesPerView={"auto"}
        spaceBetween={spaceBetween}
        freeMode={true}
        centeredSlides={false}
        slideToClickedSlide={true}
        modules={[FreeMode]}
        className="mySwiper"
        onReachEnd={handleReachEnd}
        {...rest}
      >
        {React.Children.map(children, (child) => (
          <SwiperSlide
            className={`${styles.carouselSlide} carousel-slide`}
            style={{ "--slide-width": `${slideWidth}px` }}
          >
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

MobileCarousel.propTypes = {
  children: PropTypes.node.isRequired,
  slideWidth: PropTypes.number,
  spaceBetween: PropTypes.number,
};

export default MobileCarousel;
