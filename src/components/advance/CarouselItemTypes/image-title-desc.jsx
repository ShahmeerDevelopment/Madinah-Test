"use client";


import PropTypes from "prop-types";
import React from "react";

import { ASSET_PATHS } from "@/utils/assets";
import StackComponent from "@/components/atoms/StackComponent";

import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import Image from "next/image";

// Next
const CarouselItemWithImgTitleDescription = ({
  description,
  image,
  name,
  id,
  clickAction = () => { },
}) => {
  return (
    <StackComponent
      direction="column"
      alignItems="center"
      onClick={() => {
        clickAction(id, name);
      }}
      sx={{
        minWidth: "90px",
        borderRadius: "24px",
        backgroundColor: "#ffffff",
      }}
      spacing={0}
    >
      <div
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "12px",
          position: "relative",
          // width: "88.89px", // Adjusted for Next.js Image
          // height: "90px",
        }}
      >
        <Image
          src={image || ASSET_PATHS.images.imagePlaceholder}
          alt="user-image"
          width={88.89} // width and height as numeric values
          height={90}
        // objectFit="cover" // Adjusts the size of the image to fit the container
        />
      </div>
      <LimitedParagraph
        sx={{
          color: "rgba(9, 9, 9, 1)",
          fontSize: "18px",
          lineHeight: "22px",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        {name}
      </LimitedParagraph>
      <LimitedParagraph
        sx={{
          color: "rgba(96, 96, 98, 1)",
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 400,
          letterSpacing: "-0.41px",
          textAlign: "center",
        }}
        line={2}
      >
        {description}
      </LimitedParagraph>
    </StackComponent>
  );
};

CarouselItemWithImgTitleDescription.propTypes = {
  clickAction: PropTypes.func,
  description: PropTypes.any,
  id: PropTypes.any,
  image: PropTypes.any,
  name: PropTypes.any,
};

export default CarouselItemWithImgTitleDescription;
