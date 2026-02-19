"use client";

import React, { lazy, Suspense } from "react";
import { useLazyAnimation, LARGE_ANIMATIONS } from "@/utils/dynamicAssets";

// Lazy load the Lottie component
const Lottie = lazy(() => import("lottie-react"));

const LazyHandsHeartAnimation = ({
  className,
  style,
  loop = true,
  autoplay = true,
  ...props
}) => {
  const { animationData, loading, error } = useLazyAnimation(
    LARGE_ANIMATIONS.HANDS_HOLDING_HEART,
    null,
    (err) => {
      console.error("Failed to load hands holding heart animation:", err);
    }
  );

  if (loading) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "110px",
          height: "110px",
          ...style,
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            border: "2px solid #f3f3f3",
            borderTop: "2px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error || !animationData) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "110px",
          height: "110px",
          color: "#666",
          fontSize: "24px",
          ...style,
        }}
      >
        🤲❤️
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          style={{
            width: "110px",
            height: "110px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ❤️
        </div>
      }
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        className={className}
        style={{ width: "110px", height: "110px", ...style }}
        {...props}
      />
    </Suspense>
  );
};

export default LazyHandsHeartAnimation;
