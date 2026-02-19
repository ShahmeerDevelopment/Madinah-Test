"use client";

import { useEffect } from "react";
import { useCriticalImagePreload } from "@/hooks/useCriticalImagePreload";

/**
 * Component to handle LCP image optimization
 * Should be used near the top of pages that display campaign images
 */
export const LCPImageOptimizer = ({ 
  campaignImage, 
  sizes = "100vw",
  fetchPriority = "high" 
}) => {
  const { preloadCriticalImages } = useCriticalImagePreload();

  useEffect(() => {
    if (!campaignImage) return;

    // Generate optimized image URLs for different sizes
    const optimizedUrls = [
      // High priority - likely LCP candidate
      `/_next/image?url=${encodeURIComponent(campaignImage)}&w=1200&q=75`,
      `/_next/image?url=${encodeURIComponent(campaignImage)}&w=1920&q=75`,
      `/_next/image?url=${encodeURIComponent(campaignImage)}&w=3840&q=75`,
    ];

    // Preload the most likely LCP image size first
    preloadCriticalImages([optimizedUrls[0]]);

    // Add critical resource hints
    const addResourceHints = () => {
      // Create preload link for the LCP image
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "image";
      preloadLink.href = optimizedUrls[0];
      preloadLink.setAttribute("fetchpriority", fetchPriority);
      preloadLink.setAttribute("importance", "high");
      
      // Add sizes attribute for responsive images
      if (sizes) {
        preloadLink.setAttribute("imagesizes", sizes);
      }

      // Avoid duplicate preload links
      const existingPreload = document.querySelector(
        `link[rel="preload"][href="${optimizedUrls[0]}"]`
      );
      if (!existingPreload) {
        document.head.appendChild(preloadLink);
      }

      // Preload additional sizes with lower priority
      setTimeout(() => {
        optimizedUrls.slice(1).forEach((url) => {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = url;
          link.setAttribute("fetchpriority", "low");
          
          const existing = document.querySelector(
            `link[rel="preload"][href="${url}"]`
          );
          if (!existing) {
            document.head.appendChild(link);
          }
        });
      }, 100);
    };

    // Use requestIdleCallback for non-critical work
    if (window.requestIdleCallback) {
      window.requestIdleCallback(addResourceHints, { timeout: 1000 });
    } else {
      setTimeout(addResourceHints, 50);
    }
  }, [campaignImage, preloadCriticalImages, sizes, fetchPriority]);

  return null; // This component doesn't render anything
};

/**
 * Hook for pages to optimize their LCP images
 */
export const useLCPImageOptimization = (imageUrl) => {
  const { preloadCriticalImages } = useCriticalImagePreload();

  useEffect(() => {
    if (!imageUrl) return;

    // Generate the most common Next.js image sizes
    const lcpImageUrl = `/_next/image?url=${encodeURIComponent(imageUrl)}&w=1200&q=75`;
    
    // Preload immediately as this is likely the LCP element
    preloadCriticalImages([lcpImageUrl]);

    // Add high-priority preload link
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = lcpImageUrl;
    link.setAttribute("fetchpriority", "high");
    link.setAttribute("importance", "high");

    // Check if already exists to avoid duplicates
    const existing = document.querySelector(`link[rel="preload"][href="${lcpImageUrl}"]`);
    if (!existing) {
      document.head.appendChild(link);
    }

    // Cleanup function to remove the preload link when component unmounts
    return () => {
      const preloadLink = document.querySelector(`link[rel="preload"][href="${lcpImageUrl}"]`);
      if (preloadLink) {
        preloadLink.remove();
      }
    };
  }, [imageUrl, preloadCriticalImages]);
};

export default LCPImageOptimizer;
