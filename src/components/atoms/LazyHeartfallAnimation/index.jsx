"use client";

import React, { lazy, Suspense } from "react";
import { useLazyAnimation, LARGE_ANIMATIONS } from "@/utils/dynamicAssets";

// Lazy load the Lottie component
const Lottie = lazy(() => import("lottie-react"));

const LazyHeartfallAnimation = ({
  className,
  style,
  height,
  width,
  loop = true,
  autoplay = true,
  onComplete,
  ...props
}) => {
  const { animationData, loading, error } = useLazyAnimation(
    LARGE_ANIMATIONS.HEARTFALL,
    null,
    (err) => {
      console.error("Failed to load Heartfall animation:", err);
    }
  );

  if (loading) {
    // Return null during loading for background animation (no spinner needed)
    return null;
  }

  if (error || !animationData) {
    // Return null instead of error UI for background animation
    return null;
  }

  const animationStyle = {
    height: height || "100%",
    width: width || "100%",
    ...style,
  };

  return (
    <Suspense fallback={null}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        onComplete={onComplete}
        className={className}
        style={animationStyle}
        {...props}
      />
    </Suspense>
  );
};

export default LazyHeartfallAnimation;
