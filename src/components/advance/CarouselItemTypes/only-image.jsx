"use client";


import PropTypes from "prop-types";
import React from "react";
import { ASSET_PATHS } from "@/utils/assets";
const placeHolderImage = ASSET_PATHS.images.imagePlaceholder;
import Image from "@/components/atoms/imageComponent/Image";

// Next
const CarouselItemWithOnlyImage = ({
  id,
  image,
  clickAction = () => {},
  ...otherProps
}) => {
  return (
    <Image
      onClick={() => {
        clickAction({ id, ...otherProps });
      }}
      source={!image || image === "" ? placeHolderImage : image}
      alt="campaign-cover"
      width="80px"
      height="58px"
      sizes="80px"
      containerStyles={{
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
      }}
    />
  );
};

CarouselItemWithOnlyImage.propTypes = {
  clickAction: PropTypes.func,
  id: PropTypes.any,
  image: PropTypes.any,
  subTitle: PropTypes.any,
  title: PropTypes.any,
};

export default CarouselItemWithOnlyImage;
