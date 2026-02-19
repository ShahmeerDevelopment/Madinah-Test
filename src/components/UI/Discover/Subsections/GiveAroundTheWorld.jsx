/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React from "react";
import { CountryCard } from "@/components/advance/CarouselItemTypes";
import StackComponent from "@/components/atoms/StackComponent";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import useTransitionNavigate from "@/hooks/useTransitionNavigate";
import { createSearchParams } from "@/utils/helpers";
import { useSelector } from "react-redux";
import SectionHeading from "../UI/SectionHeading";
import SectionSubheading from "../UI/SectionSubheading";
// import CarouselComponentWithParentControls from "@/components/molecules/CarouselComponentWithParentControls";
// import LeftRightArrows from "../UI/LeftRightArrows";
import CarousalWithLeftRightInColumn from "@/components/advance/CarousalWithLeftRightInColumn";
import MobileCarousel from "@/components/molecules/carousel/MobileCarousel";

const GiveAroundTheWorld = () => {
  // const sliderRef = useRef();
  const navigate = useTransitionNavigate();
  const { isSmallScreen } = useResponsiveScreen();

  const countries = useSelector((state) => state.meta.countries);

  // const goToNext = () => sliderRef.current.slickNext();

  // const goToPrev = () => sliderRef.current.slickPrev();
  if (!countries) {
    return <div>Loading...</div>; // Or a spinner component
  }

  const countriesList = countries?.map((eachCountry, index) => {
    return (
      <CountryCard
        key={index}
        countryName={eachCountry?.name}
        image={eachCountry?.imageUrl}
        {...eachCountry}
        id={eachCountry?._id}
        clickAction={(e) => {
          const path = createSearchParams(
            {
              countryId: e.id,
            },
            "/category",
          );
          navigate(path);
        }}
      />
    );
  });

  if (!countriesList || countriesList.length === 0) {
    return null; // Or a loading indicator, or placeholder content
  }
  return (
    <>
      {isSmallScreen ? (
        <StackComponent direction="column">
          <StackComponent sx={{ flexGrow: 1 }} direction="column" spacing="4px">
            <SectionHeading style={{ mb: "4px !important" }}>
              Give around the world
            </SectionHeading>
            <SectionSubheading style={{ mb: "24px !important" }}>
              Make an impact worldwide
            </SectionSubheading>
          </StackComponent>
        
          <MobileCarousel slideWidth={185} spaceBetween={9}>
            {countriesList}
          </MobileCarousel>
        </StackComponent>
      ) : (
        <CarousalWithLeftRightInColumn
          heading="Give around the world"
          subHeading="Make an impact worldwide"
          slidesToShow={5}
          draggable={false}
        >
          {countriesList}
        </CarousalWithLeftRightInColumn>
      )}
    </>
  );
};

export default GiveAroundTheWorld;
