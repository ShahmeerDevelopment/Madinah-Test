"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NextImage from "next/image";

/**
 * SafeImage - A wrapper around Next.js Image component that handles image loading errors
 * by preventing repeated 404 requests and falling back to a placeholder image.
 * 
 * @param {string} src - The source URL of the image
 * @param {string} fallbackSrc - The fallback image URL if the main image fails to load
 * @param {string} alt - Alt text for the image
 * @param {object} props - Other props to pass to the Next.js Image component
 */
const SafeImage = ({ src, fallbackSrc, alt = "Image", ...props }) => {
  // Helper function to check if src is a valid image source
  const isValidImageSrc = (source) => {
    if (!source) return false;
    // Check if it's an imported image object (has src property)
    if (typeof source === "object" && source.src) return true;
    // Check if it's a valid URL or path string
    if (typeof source === "string") {
      // Check if it starts with http(s), /, or . (relative paths)
      return source.startsWith("http") || source.startsWith("/") || source.startsWith(".");
    }
    return false;
  };

  // Use fallback immediately if src is invalid (like plain text)
  const initialSrc = isValidImageSrc(src) ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(!isValidImageSrc(src));

  // Reset error state when src changes
  useEffect(() => {
    const validSrc = isValidImageSrc(src) ? src : fallbackSrc;
    setImgSrc(validSrc);
    setHasError(!isValidImageSrc(src));
  }, [src, fallbackSrc]);

  const handleImageError = () => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <NextImage
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleImageError}
    />
  );
};

SafeImage.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  fallbackSrc: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  alt: PropTypes.string,
};

export default SafeImage;
