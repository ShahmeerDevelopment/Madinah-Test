import dynamic from "next/dynamic";
import React from "react";

/**
 * Enhanced dynamic import utility for better code splitting
 * @param {Function} importFunc - The import function
 * @param {Object} options - Additional options
 * @returns {React.ComponentType} Dynamically loaded component
 */
export const lazyLoad = (importFunc, options = {}) => {
  const LazyComponent = dynamic(importFunc, {
    loading: () => options.fallback || <div>Loading...</div>,
    ssr: options.ssr !== undefined ? options.ssr : true,
    ...options,
  });

  return LazyComponent;
};

/**
 * Preload a component for faster initial load when needed
 * @param {Function} importFunc - The import function
 */
export const preloadComponent = (importFunc) => {
  importFunc();
};
