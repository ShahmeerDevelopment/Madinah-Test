import { useEffect, useState } from "react";

/**
 * Hook to dynamically load Recurly CSS only when needed (on payment pages)
 * This prevents render-blocking CSS on non-payment pages like homepage
 */
export const useRecurlyCss = () => {
  const [isCssLoaded, setIsCssLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    const existingLink = document.querySelector(
      'link[href*="js.recurly.com/v4/recurly.css"]'
    );
    if (existingLink) {
      setIsCssLoaded(true);
      return;
    }

    // Create and append the link element
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://js.recurly.com/v4/recurly.css";

    link.onload = () => {
      setIsCssLoaded(true);
    };

    link.onerror = () => {
      console.warn("Failed to load Recurly CSS");
      setIsCssLoaded(true); // Set to true anyway to not block rendering
    };

    document.head.appendChild(link);

    // Cleanup is not needed as CSS should persist
  }, []);

  return isCssLoaded;
};

export default useRecurlyCss;
