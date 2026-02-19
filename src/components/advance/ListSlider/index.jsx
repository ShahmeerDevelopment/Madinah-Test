/* eslint-disable indent */
"use client";


import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import StackComponent from "../../atoms/StackComponent";

import BackIcon from "../../../assets/icons/BackIcon";
import {
  CarouselItemWitImgTitleDescCard,
  CarouselItemWithImgTitleDescription,
  CarouselItemWithImageDescriptionInsideCard,
  CarouselItemWithOnlyImage,
  TestimonialCarouselItem,
} from "../CarouselItemTypes/";
import { voiceOfMadinahData as data } from "@/../public/assets/images/voice_of_madinah/data";
import OutlinedIconButton from "../OutlinedIconButton";

const DEFAULT_SPACING_BETWEEN_ITEMS = "58.92px";

const CarouselController = ({
  type,
  clickAction = () => { },
  ...otherProps
}) => {
  switch (type) {
    case "image-title-desc":
      return (
        <CarouselItemWithImgTitleDescription
          clickAction={clickAction}
          {...otherProps}
        />
      );
    case "image-title-desc-card":
      return (
        <CarouselItemWitImgTitleDescCard
          clickAction={clickAction}
          {...otherProps}
        />
      );
    case "testimonial":
      return (
        <TestimonialCarouselItem clickAction={clickAction} {...otherProps} />
      );
    case "image-title-desc-insidecard":
      return (
        <CarouselItemWithImageDescriptionInsideCard
          clickAction={clickAction}
          {...otherProps}
        />
      );
    case "only-image":
      return (
        <CarouselItemWithOnlyImage clickAction={clickAction} {...otherProps} />
      );
    default:
      return <></>;
  }
};

CarouselController.propTypes = {
  clickAction: PropTypes.func,
  type: PropTypes.any,
};

const ListSlider = ({
  arr = data,
  type,
  itemSpacing = DEFAULT_SPACING_BETWEEN_ITEMS,
  clickAction = () => { },
}) => {
  const btnStyles = {
    overflow: "hidden",
    zIndex: 2,
    "&.Mui-disabled": {
      background: "#ffffff !important",
    },
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const containerRef = useRef(null);
  useEffect(() => {
    function handleResize() {
      const width = containerRef.current.clientWidth;
      setContainerWidth(width);
    }
    if (containerRef.current) {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [containerRef]);

  const lengthOfEachImagePx = parseFloat(imageWidth);
  const visibleItems = containerWidth / lengthOfEachImagePx;
  const numberOfElementsInTheEndOfArray = visibleItems;
  const maxIndex = arr.length - numberOfElementsInTheEndOfArray;
  const imageRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageWidth(imageRef.current.clientWidth + parseFloat(itemSpacing));
      }
    };

    if (imageRef.current) {
      handleResize();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <StackComponent alignItems="center" sx={{ overflow: "hidden" }} spacing={2}>
      <OutlinedIconButton
        onClick={(e) => {
          e.preventDefault();
          if (selectedIndex !== 0) {
            setSelectedIndex((prevState) => prevState - 1);
          }
        }}
        disabled={selectedIndex === 0}
        sx={btnStyles}
      >
        <BackIcon isDisabled={selectedIndex === 0} />
      </OutlinedIconButton>

      <div
        ref={containerRef}
        style={{
          // maxWidth: 'calc(100% - (2 * 81px))',
          overflow: "hidden",
        }}
      >
        <StackComponent
          sx={{
            width: "100%",
            transform: `translateX(-${parseFloat(imageWidth) * selectedIndex
              }px)`,
            transition: "all 0.4s",
          }}
          spacing={itemSpacing}
        >
          {arr.map((eachUser) => {
            return (
              <div ref={imageRef} key={eachUser.id}>
                <CarouselController
                  type={type}
                  clickAction={clickAction}
                  {...eachUser}
                />
              </div>
            );
          })}
        </StackComponent>
      </div>

      <OutlinedIconButton
        onClick={(e) => {
          e.preventDefault();
          if (selectedIndex < maxIndex) {
            setSelectedIndex((prevState) => prevState + 1);
          }
        }}
        disabled={selectedIndex >= maxIndex}
        sx={btnStyles}
      >
        <BackIcon
          isDisabled={selectedIndex >= maxIndex}
          style={{ transform: "rotateY(180deg)" }}
        />
      </OutlinedIconButton>
    </StackComponent>
  );
};

ListSlider.propTypes = {
  arr: PropTypes.array.isRequired,
  clickAction: PropTypes.func,
  itemSpacing: PropTypes.any,
  type: PropTypes.string.isRequired,
};

export default ListSlider;
