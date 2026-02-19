import { useState, useEffect } from "react";
import { fetchLottieAnimation, getAnimationPath } from "@/utils/assets";

/**
 * Custom hook to load Lottie animations from the public folder
 * This enables CDN caching and reduces initial bundle size
 *
 * @param {string} animationName - The name of the animation (without .json extension)
 * @returns {object} - { animationData, isLoading, error }
 */
export const useLottieAnimation = (animationName) => {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      if (!animationName) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchLottieAnimation(animationName);
        if (isMounted) {
          setAnimationData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
          console.error(`Failed to load Lottie animation: ${animationName}`, err);
        }
      }
    };

    loadAnimation();

    return () => {
      isMounted = false;
    };
  }, [animationName]);

  return { animationData, isLoading, error };
};

/**
 * Preload a Lottie animation for faster display
 * Call this early in the component lifecycle for critical animations
 *
 * @param {string} animationName - The name of the animation (without .json extension)
 */
export const preloadLottieAnimation = (animationName) => {
  const path = getAnimationPath(animationName);
  // Use link preload for browser-level caching
  if (typeof window !== "undefined") {
    const existingLink = document.querySelector(`link[href="${path}"]`);
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = path;
      link.as = "fetch";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  }
};

export default useLottieAnimation;
