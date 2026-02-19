"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Component to load non-critical third-party scripts after initial page load
 * All scripts are loaded programmatically after LCP is complete
 * This prevents Lighthouse score variability
 */
const DeferredScripts = () => {
  const loadedRef = useRef(false);
  const [recurlyLoaded, setRecurlyLoaded] = useState(false);

  useEffect(() => {
    // Check if Recurly is already loaded
    if (typeof window !== "undefined" && window.recurly) {
      setRecurlyLoaded(true);
    }

    // Listen for Recurly ready event
    const handleRecurlyReady = () => {
      setRecurlyLoaded(true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("recurlyReady", handleRecurlyReady);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("recurlyReady", handleRecurlyReady);
      }
    };
  }, []);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    // Load non-critical scripts after 5 seconds delay
    // const loadDeferredScripts = () => {
    //   // 1. Microsoft Clarity - analytics (very low priority)
    //   if (!window.__clarityLoaded) {
    //     window.__clarityLoaded = true;
    //     const clarityScript = document.createElement("script");
    //     clarityScript.async = true;
    //     clarityScript.src = "https://www.clarity.ms/tag/oyidhhaf5i";
    //     document.head.appendChild(clarityScript);
    //   }

    // 2. GrowthBook visual editor - only in development/testing
    // if (
    //   !window.__gbEditorLoaded &&
    //   window.GROWTHBOOK_CONFIG?.enableVisualEditor
    // ) {
    //   window.__gbEditorLoaded = true;
    //   const gbScript = document.createElement("script");
    //   gbScript.async = true;
    //   gbScript.src = "https://cdn.growthbook.io/js/visual-editor-v2.js";
    //   document.head.appendChild(gbScript);
    // }
    // };

    // Delay script loading significantly to avoid affecting Lighthouse
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(loadDeferredScripts, { timeout: 10000 });
      } else {
        loadDeferredScripts();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // No Script tags rendered - all loaded programmatically
  return null;
};

export default DeferredScripts;
