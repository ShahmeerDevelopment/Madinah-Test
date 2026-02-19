"use client";

import React, { memo, useState, useEffect } from "react";
import NextImage from "next/image";
import VideoPlayerComponent from "@/components/atoms/VideoPlayerComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { styles } from "../ViewCampaignTemplate.style";
import { PLACEHOLDER_IMAGE } from "../defaultProps";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const CampaignMedia = memo(({ thumbnailImage }) => {
  const { isSmallScreen } = useResponsiveScreen();
  const [imgSrc, setImgSrc] = useState(thumbnailImage);
  const [hasError, setHasError] = useState(false);

  // Reset error state when thumbnailImage changes
  useEffect(() => {
    setImgSrc(thumbnailImage);
    setHasError(false);
  }, [thumbnailImage]);

  if (!thumbnailImage) return null;

  const videoRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(c\/)?[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+|vimeo\.com\/\d+)/;
  const isVimeo = /^https?:\/\/(www\.)?vimeo\.com\/\d+/.test(thumbnailImage);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  };

  return (
    <BoxComponent sx={styles.coverImg}>
      {thumbnailImage?.match(videoRegex) ? (
        <VideoPlayerComponent
          url={thumbnailImage}
          style={{
            borderRadius: "12px",
            overflow: "hidden",
          }}
          width="100%"
          height={isSmallScreen ? "200px" : isVimeo ? "380px" : "380px"}
        />
      ) : (
        <NextImage
          src={imgSrc}
          alt="campaign-cover-photo"
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "450px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
          onError={handleImageError}
          priority={true} // Add priority for above-the-fold content
        />
      )}
    </BoxComponent>
  );
});

CampaignMedia.displayName = "CampaignMedia";

export default CampaignMedia;
