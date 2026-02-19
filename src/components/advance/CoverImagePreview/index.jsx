"use client";

import PropTypes from "prop-types";
import React from "react";
import { ASSET_PATHS } from "@/utils/assets";
import StackComponent from "@/components/atoms/StackComponent";
import VideoPlayerComponent from "@/components/atoms/VideoPlayerComponent";
import Image from "@/components/atoms/imageComponent/Image";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const CoverImagePreview = ({
  imageSrc,
  containerStyleOverrides,
  style,
  height = "380px",
}) => {
  const { isSmallScreen } = useResponsiveScreen();
  const videoRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(c\/)?[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+|vimeo\.com\/\d+)/;

  const isVimeo = /^https?:\/\/(www\.)?vimeo\.com\/\d+/.test(imageSrc);

  return (
    <StackComponent
      justifyContent="flex-start"
      sx={{
        width: "100%",
        // earlier height was 214px
        maxHeight: { xs: "auto", sm: "450px" },
        borderRadius: "12px",
        ...containerStyleOverrides,
      }}
    >
      {imageSrc?.match(videoRegex) ? (
        <VideoPlayerComponent
          url={imageSrc}
          style={{
            borderRadius: "12px",
            overflow: "hidden",
          }}
          width="100%"
          height={isSmallScreen ? "200px" : isVimeo ? height : "380px"}
        />
      ) : (
        <Image
          width="100%"
          height="auto"
          objectFit="cover"
          borderRadius="12px"
          alt="campaign-cover-photo"
          source={!imageSrc || imageSrc === "" ? ASSET_PATHS.images.imagePlaceholder : imageSrc}
          effect="blur"
          style={style}
        />
      )}
    </StackComponent>
  );
};

CoverImagePreview.propTypes = {
  containerStyleOverrides: PropTypes.any,
  imageSrc: PropTypes.any.isRequired,
  style: PropTypes.any,
  height: PropTypes.string,
};

export default CoverImagePreview;
