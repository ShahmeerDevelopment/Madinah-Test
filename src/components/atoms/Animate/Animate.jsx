/* eslint-disable indent */
"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// =============================================================================
// OPTIMIZATION: Cache the Lottie module to prevent re-importing on every mount
// =============================================================================
let cachedLottie = null;
let lottieLoadPromise = null;

const loadLottie = () => {
  if (cachedLottie) {
    return Promise.resolve(cachedLottie);
  }
  if (lottieLoadPromise) {
    return lottieLoadPromise;
  }
  lottieLoadPromise = import("lottie-react").then((LottieReact) => {
    cachedLottie = LottieReact.default;
    return cachedLottie;
  });
  return lottieLoadPromise;
};

const Animate = ({ animationData, loop = true, ...otherProps }) => {
  // Always start with null to avoid SSR/hydration issues
  const [Lottie, setLottie] = useState(null);

  useEffect(() => {
    // Load from cache or fetch on client-side only
    loadLottie().then((LottieComponent) => {
      setLottie(() => LottieComponent);
    });
  }, []);

  const isValidAnimation =
    animationData &&
    typeof animationData === "object" &&
    (animationData.layers || animationData.assets || animationData.ip);


  // Return null or a placeholder during SSR
  if (!Lottie || !isValidAnimation) {
    return <div style={{ width: "100%", height: "100%" }} />;
  }

  return <Lottie {...otherProps} animationData={animationData} loop={loop} />;
};

Animate.propTypes = {
  animationData: PropTypes.any,
  loop: PropTypes.bool,
};

export default Animate;
