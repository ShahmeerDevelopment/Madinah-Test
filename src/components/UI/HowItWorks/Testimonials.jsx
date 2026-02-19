"use client";

import { testimonials_arr } from "@/../public/assets/images/testimonials/default_testimonials";
import { TestimonialCarouselItem } from "@/components/advance/CarouselItemTypes";
import StackComponent from "@/components/atoms/StackComponent";
import ReuseAbleSlider from "@/components/molecules/carousel/ReuseAbleSlider";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import React from "react";

const Testimonials = () => {
  const { isSmallScreen } = useResponsiveScreen();

  return (
    <>
      {isSmallScreen ? (
        <StackComponent direction="column" spacing="24px">
          {testimonials_arr.splice(0, 3).map((eachTestimonial, index) => (
            <TestimonialCarouselItem {...eachTestimonial} key={index} />
          ))}
        </StackComponent>
      ) : (
        <>
          <ReuseAbleSlider
            slidesToShowFullView={3}
            slidesToShowAt800px={2}
            slidesToShowAt600px={2}
            slidesToShowAt480px={1}
            totalArrayLength={testimonials_arr.length}
          >
            {testimonials_arr.map((eachTestimonial, index) => (
              <div key={index}>
                <TestimonialCarouselItem {...eachTestimonial} key={index} />
              </div>
            ))}
          </ReuseAbleSlider>
        </>
      )}
    </>
  );
};

export default Testimonials;
