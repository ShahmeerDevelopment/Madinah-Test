"use client";

import React, { useState, useRef, useEffect } from "react";
import NextImage from "next/image";

const OptimizedImage = ({
  src,
  alt = "",
  className = "",
  style = {},
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);

  // Extract dimensions from style or use defaults
  useEffect(() => {
    if (style.width && style.height) {
      setDimensions({
        width: parseInt(style.width) || 600,
        height: parseInt(style.height) || 400,
      });
    } else {
      // Default dimensions for content images
      setDimensions({ width: 600, height: 400 });
    }
  }, [style.width, style.height]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Check if it's an external image that needs special handling
  const isExternalImage =
    src?.startsWith("http") && !src.includes(window?.location?.hostname);

  if (hasError) {
    return (
      <div
        className={`${className} image-placeholder`}
        style={{
          ...style,
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          color: "#666",
        }}
      >
        Image could not be loaded
      </div>
    );
  }

  // For external images, we need to use a proxy or optimization service
  // For now, we'll use the img tag with optimization attributes
  if (isExternalImage) {
    return (
      <div style={{ position: "relative" }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
            }}
          >
            Loading...
          </div>
        )}
        {/* Using NextImage with external image configuration */}
        <NextImage
          ref={imgRef}
          src={src}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className={className}
          style={{
            ...style,
            display: isLoading ? "none" : "block",
            maxWidth: "100%",
            height: "auto",
          }}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          sizes={sizes}
          {...props}
        />
      </div>
    );
  }

  // For internal images, use Next.js Image component
  return (
    <div style={{ position: "relative", ...style }}>
      <NextImage
        src={src}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        className={className}
        priority={priority}
        sizes={sizes}
        style={{
          maxWidth: "100%",
          height: "auto",
          ...style,
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />{" "}
    </div>
  );
};

export default OptimizedImage;
