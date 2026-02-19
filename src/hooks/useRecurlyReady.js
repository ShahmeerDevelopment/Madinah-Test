import { useState, useEffect } from "react";

/**
 * Hook to check if Recurly is loaded and ready to use
 * This prevents "recurly.js is not loaded" errors
 */
export const useRecurlyReady = () => {
  const [isRecurlyReady, setIsRecurlyReady] = useState(false);

  useEffect(() => {
    // Check if Recurly is already available
    const checkRecurly = () => {
      if (typeof window !== "undefined" && window.recurly) {
        setIsRecurlyReady(true);
        return true;
      }
      return false;
    };

    // Initial check
    if (checkRecurly()) {
      return;
    }

    // Listen for the recurlyReady event
    const handleRecurlyReady = () => {
      setIsRecurlyReady(true);
    };

    // Set up event listener
    if (typeof window !== "undefined") {
      window.addEventListener("recurlyReady", handleRecurlyReady);
    }

    // Polling fallback in case the event doesn't fire
    const pollInterval = setInterval(() => {
      if (checkRecurly()) {
        clearInterval(pollInterval);
      }
    }, 100); // Check every 100ms

    // Cleanup function
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("recurlyReady", handleRecurlyReady);
      }
      clearInterval(pollInterval);
    };
  }, []);

  return isRecurlyReady;
};
