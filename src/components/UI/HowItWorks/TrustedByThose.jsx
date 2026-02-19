"use client";

import React from "react";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import ReuseAbleSlider from "@/components/molecules/carousel/ReuseAbleSlider";
import { voiceOfMadinahData as data } from "@/../public/assets/images/voice_of_madinah/data";
import { CarouselItemWithImgTitleDescription } from "@/components/advance/CarouselItemTypes";
import MobileCarousel from "@/components/molecules/carousel/MobileCarousel";

// Next
const TrustedByThose = () => {
  const { isSmallScreen } = useResponsiveScreen();

  return (
    <>
      {isSmallScreen ? (
        <>
          <MobileCarousel slideWidth={90} spaceBetween={16}>
            {data.map((eachItem) => (
              <CarouselItemWithImgTitleDescription
                key={eachItem.id}
                description={eachItem.description}
                name={eachItem.name}
                image={eachItem.image}
              />
            ))}
          </MobileCarousel>
        </>
      ) : (
        <>
          <ReuseAbleSlider
            slidesToShowFullView={6}
            slidesToShowAt800px={4}
            slidesToShowAt600px={3}
            slidesToShowAt480px={3}
            totalArrayLength={data.length}
            isVoice
          >
            {data.map((eachTestimonial, index) => (
              <div key={index}>
                <CarouselItemWithImgTitleDescription {...eachTestimonial} />
              </div>
            ))}
          </ReuseAbleSlider>
        </>
      )}
    </>
  );
};

export default TrustedByThose;
