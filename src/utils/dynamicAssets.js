// Dynamic asset loading utilities for large files
// This prevents large assets from being bundled, improving LCP
import { useState, useEffect, useRef } from "react";
import { ASSET_PATHS } from "./assets";

// =============================================================================
// ANIMATION CACHE: Prevents multiple fetches for the same animation
// =============================================================================
const animationCache = new Map();

/**
 * Dynamically loads large animation JSON files from public folder
 * Uses in-memory cache to prevent duplicate fetches
 * @param {string} animationName - Name of the animation file (without .json)
 * @returns {Promise<Object>} Animation data
 */
export const loadLargeAnimation = async (animationName) => {
  // Return cached data if available
  if (animationCache.has(animationName)) {
    const cached = animationCache.get(animationName);
    // If it's a promise, return it (request in flight)
    if (cached instanceof Promise) {
      return cached;
    }
    return Promise.resolve(cached);
  }

  // Create fetch promise and cache immediately to dedupe concurrent requests
  const fetchPromise = (async () => {
    try {
      const response = await fetch(`/assets/animations/${animationName}.json`);
      if (!response.ok) {
        animationCache.delete(animationName);
        throw new Error(`Failed to load animation: ${animationName}`);
      }
      const data = await response.json();
      // Replace promise with actual data
      animationCache.set(animationName, data);
      return data;
    } catch (error) {
      animationCache.delete(animationName);
      console.warn(`Failed to load animation: ${animationName}`, error);
      return null;
    }
  })();

  animationCache.set(animationName, fetchPromise);
  return fetchPromise;
};

/**
 * Get SVG path from public folder (CDN-optimized)
 * @param {string} svgName - Name of the SVG file (without .svg)
 * @returns {string} SVG URL path
 */
export const getSvgPath = (svgName) => {
  // Map common SVG names to their public paths
  const svgPathMap = {
    instagram: ASSET_PATHS.social.instagram,
    whatsapp: ASSET_PATHS.social.whatsapp,
    telegram: ASSET_PATHS.social.telegram,
    youtube: ASSET_PATHS.social.youtube,
    twitter: ASSET_PATHS.social.twitter,
    facebook: ASSET_PATHS.social.facebook,
    slack: ASSET_PATHS.social.slack,
    tiktok: ASSET_PATHS.social.tiktok,
    nextDoor: ASSET_PATHS.social.nextDoor,
  };
  return svgPathMap[svgName] || `/assets/svg/${svgName}.svg`;
};

/**
 * Dynamically loads large SVG files as URLs (legacy support)
 * @param {string} svgName - Name of the SVG file (without .svg)
 * @returns {Promise<string>} SVG URL
 * @deprecated Use getSvgPath() instead for CDN-optimized delivery
 */
export const loadLargeSvg = async (svgName) => {
  // Return the public path directly - no need to import
  return getSvgPath(svgName);
};

/**
 * Preloads critical large assets after initial page load
 * Uses link prefetch for browser-level caching
 */
export const preloadCriticalAssets = () => {
  if (typeof window !== "undefined") {
    // Preload on idle
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        // Prefetch commonly used social icons
        const criticalSvgs = ["instagram", "whatsapp", "telegram"];
        criticalSvgs.forEach((svgName) => {
          const path = getSvgPath(svgName);
          const existingLink = document.querySelector(`link[href="${path}"]`);
          if (!existingLink) {
            const link = document.createElement("link");
            link.rel = "prefetch";
            link.href = path;
            link.as = "image";
            document.head.appendChild(link);
          }
        });
      });
    }
  }
};

/**
 * Lazy load animations with loading states
 * @param {string} animationName
 * @param {Function} onLoad
 * @param {Function} onError
 */
export const useLazyAnimation = (animationName, onLoad, onError) => {
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Use refs to store callbacks to avoid re-triggering effect
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (!animationName || hasFetched.current) return;

    hasFetched.current = true;
    setLoading(true);
    setError(null);

    loadLargeAnimation(animationName)
      .then((data) => {
        setAnimationData(data);
        if (onLoadRef.current) onLoadRef.current(data);
      })
      .catch((err) => {
        setError(err);
        if (onErrorRef.current) onErrorRef.current(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [animationName]);

  return { animationData, loading, error };
};

// Animation presets for common large files
export const LARGE_ANIMATIONS = {
  HEARTFALL: "Heartfall",
  MAP_COUNTRIES: "map_countries",
  NOT_FOUND: "404(1)",
  HANDS_HOLDING_HEART: "hands_holding_heart",
};

// SVG presets for common large files
export const LARGE_SVGS = {
  BLOG3: "blog3",
  INSTAGRAM: "instagram",
  WHATSAPP: "whatsapp",
  TELEGRAM: "telegram",
  YOUTUBE: "youtube",
  TWITTER: "twitter",
  FACEBOOK: "facebook",
};
