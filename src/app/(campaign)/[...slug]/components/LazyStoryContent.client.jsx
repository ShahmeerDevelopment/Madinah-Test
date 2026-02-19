"use client";

/**
 * LazyStoryContent - Client Component for lazy loading story content
 *
 * LCP Optimization:
 * - Defers story rendering until after the cover image (LCP) has loaded
 * - Uses Intersection Observer to only render when in/near viewport
 * - Prevents story images from competing with cover image for LCP
 *
 * This ensures the cover image is the LCP element, not story images.
 */

import { useState, useEffect, useRef } from "react";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

// Skeleton for story content
const StorySkeleton = () => (
  <BoxComponent
    sx={{
      minHeight: "200px",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
      padding: "16px",
    }}
  >
    <BoxComponent
      sx={{
        height: "16px",
        backgroundColor: "#e0e0e0",
        borderRadius: "4px",
        marginBottom: "12px",
        width: "100%",
      }}
    />
    <BoxComponent
      sx={{
        height: "16px",
        backgroundColor: "#e0e0e0",
        borderRadius: "4px",
        marginBottom: "12px",
        width: "90%",
      }}
    />
    <BoxComponent
      sx={{
        height: "16px",
        backgroundColor: "#e0e0e0",
        borderRadius: "4px",
        marginBottom: "12px",
        width: "95%",
      }}
    />
    <BoxComponent
      sx={{
        height: "16px",
        backgroundColor: "#e0e0e0",
        borderRadius: "4px",
        width: "80%",
      }}
    />
  </BoxComponent>
);

const storyStyles = {
  "& p": {
    marginBottom: "16px",
  },
  "& img": {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
    // CLS Prevention: Reserve space with aspect-ratio fallback
    aspectRatio: "16/9",
    objectFit: "cover",
    backgroundColor: "#f0f0f0",
  },
  // CLS Prevention: Ensure iframes (videos) have aspect ratio
  "& iframe": {
    maxWidth: "100%",
    aspectRatio: "16/9",
    height: "auto",
    borderRadius: "8px",
  },
};

export default function LazyStoryContent({ story, processedStory }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Defer rendering until after LCP (cover image) has had time to load
  // This prevents story images from competing with the cover image
  useEffect(() => {
    // Use requestIdleCallback to defer until browser is idle
    // This ensures cover image (LCP) loads first
    const timeoutId = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(
          () => {
            setShouldRender(true);
          },
          { timeout: 500 }
        );
      } else {
        setShouldRender(true);
      }
    }, 100); // Small delay to ensure cover image starts loading first

    return () => clearTimeout(timeoutId);
  }, []);

  // Intersection Observer for viewport-based rendering
  useEffect(() => {
    if (!shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start rendering 100px before entering viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldRender]);

  if (!story) return null;

  return (
    <BoxComponent ref={containerRef} sx={storyStyles}>
      {!shouldRender || !isVisible ? (
        <StorySkeleton />
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: processedStory }}
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            color: "#333",
          }}
        />
      )}
    </BoxComponent>
  );
}
