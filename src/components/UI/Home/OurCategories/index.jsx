"use client";

import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { CarouselItemWithImageDescriptionInsideCard } from "@/components/advance/CarouselItemTypes";
// import DraggableSlider from "@/components/advance/DraggableSlider";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import MobileCarousel from "@/components/molecules/carousel/MobileCarousel";
// import MultiCarousel from "@/components/molecules/carousel/MultiCarousel";
import ReuseAbleSlider from "@/components/molecules/carousel/ReuseAbleSlider";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const OurCategories = ({ categories }) => {
  const router = useRouter();
  const { isSmallScreen } = useResponsiveScreen();

  const actionHandler = (e) => {
    router.push(`/category?category=${e.id}`);
  };
  return (
    <>
      {categories && categories.length > 0 ? (
        <>
          {isSmallScreen ? (
            <>
              
              <MobileCarousel>
                {categories.map((category) => (
                  <CarouselItemWithImageDescriptionInsideCard
                    key={category._id}
                    title={category.name}
                    image={category.imageUrl}
                    subTitle={category.description}
                    clickAction={() => actionHandler({ id: category._id })}
                  />
                ))}
              </MobileCarousel>
            </>
          ) : (
            <>
              <ReuseAbleSlider
                isDragAble={false}
                slidesToShowFullView={5}
                slidesToShowAt800px={3}
                slidesToShowAt600px={2}
                slidesToShowAt480px={2}
                totalArrayLength={categories.length}
              >
                {categories.map((item) => (
                  <BoxComponent key={item._id}>
                    <CarouselItemWithImageDescriptionInsideCard
                      title={item.name}
                      image={item.imageUrl}
                      subTitle={item.description}
                      clickAction={actionHandler}
                      id={item._id}
                      {...item}
                    />
                  </BoxComponent>
                ))}
              </ReuseAbleSlider>
            </>
          )}
        
        </>
      ) : null}
    </>
  );
};

OurCategories.propTypes = {
  categories: PropTypes.any,
};

export default OurCategories;
