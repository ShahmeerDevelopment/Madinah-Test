"use client";

import React from "react";
import { voiceOfMadinahData as data } from "@/../public/assets/images/voice_of_madinah/data";
import styles from "./style.module.css";
import LazyReuseAbleSlider from "@/components/molecules/carousel/LazyReuseAbleSlider";
import { CarouselItemWithImgTitleDescription } from "@/components/advance/CarouselItemTypes";
import MobileCarousel from "@/components/molecules/carousel/MobileCarousel";

const VoiceOfMadinah = () => {
  // Using CSS-based responsive instead of useResponsiveScreen hook
  // This avoids hydration mismatches and reduces client-side JS
  return (
    <>
      {/* Mobile view - hidden on desktop via CSS */}
      <div className={styles.mobileOnly}>
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
      </div>

      {/* Desktop view - hidden on mobile via CSS */}
      <div className={styles.desktopOnly}>
        <div className={styles.carouselContainer}>
          <LazyReuseAbleSlider
            slidesToShowFullView={6}
            slidesToShowAt800px={4}
            slidesToShowAt600px={3}
            slidesToShowAt480px={3}
            isLeftPadding={false}
            totalArrayLength={data.length}
            isDragAble={false}
            isVoice
          >
            {data.map((eachTestimonial, index) => (
              <div key={index} className={styles.carouselItem}>
                <CarouselItemWithImgTitleDescription {...eachTestimonial} />
              </div>
            ))}
          </LazyReuseAbleSlider>
        </div>
      </div>
    </>
  );
};

export default VoiceOfMadinah;
