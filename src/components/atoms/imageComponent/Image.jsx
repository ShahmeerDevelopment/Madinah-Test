"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NextImage from "next/image";
import BoxComponent from "../boxComponent/BoxComponent";
import { ASSET_PATHS } from "@/utils/assets";
const placeholderImage = ASSET_PATHS.images.placeholder;

const url =
  "https://media.4-paws.org/5/b/4/b/5b4b5a91dd9443fa1785ee7fca66850e06dcc7f9/VIER%20PFOTEN_2019-12-13_209-2890x2000-1920x1329.jpg";
const Image = ({
  width = "100px",
  height = "100px",
  objectFit = "contain",
  alt,
  source = url,
  borderRadius,
  containerStyles,
  style,
  priority = false,
  sizes = "(max-width: 600px) 360px, 320px",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(source);
  const [hasError, setHasError] = useState(false);

  // Reset error state when source changes
  useEffect(() => {
    setImgSrc(source);
    setHasError(false);
  }, [source]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(placeholderImage);
    }
  };

  return (
    <BoxComponent
      sx={{
        width,
        height,
        minHeight: height === "auto" ? "400px" : height,
        position: "relative",
        "& *": {
          display: "flex !important",
          justifyContent: "center !important",
          alignItems: "center !important",
        },
        borderRadius: "12px",
        ...containerStyles,
      }}
      {...props}
    >
      <NextImage
        {...props}
        style={{ objectFit, borderRadius, ...style }}
        alt={alt}
        fill
        src={imgSrc}
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? undefined : "lazy"}
        onError={handleError}
      />
    </BoxComponent>
  );
};

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  containerStyles: PropTypes.any,
  height: PropTypes.string,
  objectFit: PropTypes.oneOf([
    "cover",
    "contain",
    "fill",
    "none",
    "scale-down",
  ]),
  source: PropTypes.any,
  width: PropTypes.string,
  borderRadius: PropTypes.string,
  style: PropTypes.any,
  priority: PropTypes.bool,
  sizes: PropTypes.string,
};

export default Image;
