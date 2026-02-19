/* eslint-disable react-hooks/rules-of-hooks */
import { useSyncExternalStore, useCallback } from "react";

// Breakpoint values matching MUI defaults
const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Server snapshot - assume desktop for SSR to avoid hydration mismatch
const getServerSnapshot = () => 1200;

// Client snapshot - get current window width
const getSnapshot = () => (typeof window !== "undefined" ? window.innerWidth : 1200);

// Single subscription for all components using this hook
let listeners = new Set();
let cachedWidth = typeof window !== "undefined" ? window.innerWidth : 1200;

const subscribe = (callback) => {
  if (typeof window === "undefined") return () => {};
  
  // Only set up one resize listener for all subscribers
  if (listeners.size === 0) {
    const handleResize = () => {
      cachedWidth = window.innerWidth;
      listeners.forEach((listener) => listener());
    };
    window.addEventListener("resize", handleResize, { passive: true });
  }
  
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && typeof window !== "undefined") {
      // Clean up when no more subscribers
    }
  };
};

const useResponsiveScreen = () => {
  // Single subscription for width - much more efficient than 5+ useMediaQuery calls
  const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Memoized breakpoint checks - computed from single width value
  const isMobile = width < BREAKPOINTS.sm;
  const isSmallScreen = width < BREAKPOINTS.sm;
  const isMediumScreen = width < BREAKPOINTS.md;
  const isUptoLargeScreen = width < BREAKPOINTS.lg;
  const isLargeScreen = width >= BREAKPOINTS.lg;

  // Dynamic checks - these return functions that evaluate against current width
  const isSmallerThan = useCallback(
    (maxWidthInPixels) => width < maxWidthInPixels,
    [width]
  );
  const isGreaterThan = useCallback(
    (minWidthInPixels) => width >= minWidthInPixels,
    [width]
  );

  return {
    isMobile,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isSmallerThan,
    isUptoLargeScreen,
    isGreaterThan,
  };
};

export default useResponsiveScreen;

