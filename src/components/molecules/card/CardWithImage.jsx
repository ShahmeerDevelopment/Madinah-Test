"use client";

import React from "react";
import { ASSET_PATHS } from "@/utils/assets";
const blog1 = ASSET_PATHS.blog.blog1;
import { ImageCardWrapper } from "./Card.style";
import PropTypes from "prop-types";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
const placeHolderImage = ASSET_PATHS.images.imagePlaceholder;
import Image from "next/image";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const CardWithImage = ({
  heading = "Using email templates to fundraiser",
  title = "10 min read",
  image = blog1,
  onClick,
}) => {
  return (
    <ImageCardWrapper
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? {
          transform: "translateY(-2px)",
          transition: "transform 0.2s ease-in-out",
        } : {},
      }}
    >
      <BoxComponent
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: "32px",
          mb: 2,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={!image || image === "" ? placeHolderImage : image}
            alt="logo"
            width={263.84}
            height={210.19}
            style={{
              borderRadius: "32px",
              objectFit: "cover",
            }}
            unoptimized={!(!image || image === "")}
          />
        </div>
      </BoxComponent>

      <LimitedParagraph
        align="left"
        fontSize={"22px"}
        line={2}
        fontWeight={500}
        sx={{ lineHeight: "28px", mb: 1 }}
      >
        {heading}
      </LimitedParagraph>
      <LimitedParagraph
        align="left"
        fontSize={"18px"}
        fontWeight={500}
        sx={{
          lineHeight: "22px",
          color: "#A1A1A8",
          mb: 1,
        }}
      >
        {title}
      </LimitedParagraph>
    </ImageCardWrapper>
  );
};

CardWithImage.propTypes = {
  heading: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.string,
  onClick: PropTypes.func,
};

export default CardWithImage;
