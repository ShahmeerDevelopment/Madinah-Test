import { useEffect, useCallback } from "react";

/**
 * Hook for preloading critical images and optimizing LCP
 */
export const useCriticalImagePreload = () => {
  // Preload critical images based on campaign content
  const preloadCriticalImages = useCallback((imageUrls) => {
    if (typeof window === "undefined" || !Array.isArray(imageUrls)) return;

    imageUrls.forEach((url, index) => {
      if (!url || typeof url !== "string") return;

      // Create link element for preloading
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;

      // Set high priority for first image (likely LCP candidate)
      if (index === 0) {
        link.setAttribute("importance", "high");
        link.setAttribute("fetchpriority", "high");
      }

      // Add to head
      document.head.appendChild(link);

      // Preload the image using JavaScript for better browser support
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Preload images when component mounts
  useEffect(() => {
    // Add resource hints for common external domains
    const domains = [
      "https://i.ibb.co",
      "https://madinah.s3.us-east-2.amazonaws.com",
      "https://madinah.s3.amazonaws.com",
    ];

    domains.forEach((domain) => {
      // DNS prefetch
      const dnsLink = document.createElement("link");
      dnsLink.rel = "dns-prefetch";
      dnsLink.href = domain;
      document.head.appendChild(dnsLink);

      // Preconnect
      const preconnectLink = document.createElement("link");
      preconnectLink.rel = "preconnect";
      preconnectLink.href = domain;
      document.head.appendChild(preconnectLink);
    });
  }, []);

  return { preloadCriticalImages };
};

/**
 * Extract images from HTML content and identify the first/largest as LCP candidate
 */
export const extractImagesFromContent = (htmlContent) => {
  if (typeof window === "undefined" || !htmlContent) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const images = doc.querySelectorAll("img");

  const imageUrls = Array.from(images)
    .map((img) => img.src || img.getAttribute("src"))
    .filter(Boolean);

  return imageUrls;
};

/**
 * Hook specifically for campaign content images
 */
export const useCampaignImageOptimization = (campaignContent) => {
  const { preloadCriticalImages } = useCriticalImagePreload();

  useEffect(() => {
    if (!campaignContent) return;

    // Extract images from campaign content
    const imageUrls = extractImagesFromContent(campaignContent);

    if (imageUrls.length > 0) {
      // Preload the first image (likely LCP candidate) immediately
      preloadCriticalImages([imageUrls[0]]);

      // Preload remaining images with delay
      setTimeout(() => {
        if (imageUrls.length > 1) {
          preloadCriticalImages(imageUrls.slice(1, 3)); // Only preload first 3 images
        }
      }, 100);
    }
  }, [campaignContent, preloadCriticalImages]);

  return { extractImagesFromContent };
};
