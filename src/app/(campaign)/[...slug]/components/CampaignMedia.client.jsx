"use client";

/**
 * CampaignMedia - Client Component for campaign cover image/video
 * Needs to be a client component to handle image errors and video player
 *
 * LCP Optimization Strategy:
 * - Uses thumbnail image for faster initial load (smaller file size)
 * - priority={true} + fetchPriority="high" + loading="eager" for LCP
 * - Minimal state to avoid hydration delays
 * - Optimized sizes attribute for mobile-first loading
 *
 * CLS Prevention Strategy:
 * - Uses fixed aspect ratio container to reserve space
 * - Shows skeleton while image loads
 * - Smooth transition from skeleton to actual image
 */

import { useEffect, useMemo, useState, Suspense, lazy, useCallback } from "react";
import NextImage from "next/image";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { ASSET_PATHS } from "@/utils/assets";

const PLACEHOLDER_IMAGE =
  ASSET_PATHS.images?.placeholder || "/assets/images/placeholder_image.jpg";

// Lazy load video player
const VideoPlayerComponent = lazy(
  () => import("@/components/atoms/VideoPlayerComponent")
);

// Skeleton animation styles matching CampaignSkeletons.jsx
const skeletonPulse = {
  animation: "pulse 1.5s ease-in-out infinite",
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.4 },
    "100%": { opacity: 1 },
  },
};

const MediaSkeleton = ({ height = "380px", isSmallScreen = false }) => (
  <BoxComponent
    sx={{
      width: "100%",
      height: isSmallScreen ? "200px" : height,
      backgroundColor: "#e0e0e0",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...skeletonPulse,
      // Maintain aspect ratio for CLS prevention
      aspectRatio: "16/9",
      minHeight: isSmallScreen ? "180px" : "300px",
      maxHeight: "450px",
    }}
  >
    <span style={{ color: "#999", fontSize: "14px" }}>Loading media...</span>
  </BoxComponent>
);

const styles = {
  coverImg: {
    marginBottom: "16px !important",
    // Reserve space with aspect ratio to prevent CLS
    position: "relative",
    width: "100%",
    minHeight: { xs: "180px", sm: "300px", md: "380px" },
    maxHeight: "450px",
  },
  // Container with fixed aspect ratio for CLS prevention
  mediaContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: "12px",
    overflow: "hidden",
  },
};

// Helper to check if URL is valid - moved outside component to avoid re-creation
const getValidUrl = (url) => url && typeof url === "string" && url.trim() !== "";

// Video URL detection regex - moved outside to avoid re-creation on each render
const VIDEO_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(c\/)?[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+|vimeo\.com\/\d+)/;

export default function CampaignMedia({
  coverMedia,
  coverImageUrl,
  thumbnailCoverImageUrl,
}) {
  // Determine the best image source - prefer coverImageUrl, then coverMedia
  const lcpImageSrc = getValidUrl(coverImageUrl)
    ? coverImageUrl
    : getValidUrl(coverMedia)
      ? coverMedia
      : null;

  // Check if video early to avoid unnecessary state for images (most campaigns)
  const isVideo = lcpImageSrc ? VIDEO_REGEX.test(lcpImageSrc) : false;

  // Only use error state - minimize state for faster hydration
  const [hasError, setHasError] = useState(false);
  // Video player loading state - only matters for videos
  const [shouldLoadVideoPlayer, setShouldLoadVideoPlayer] = useState(false);

  // Return null only if no valid image source exists
  if (!lcpImageSrc) {
    return null;
  }

  // Use fallback only on error, otherwise use the determined source
  const displaySrc = hasError ? PLACEHOLDER_IMAGE : lcpImageSrc;

  // Memoized error handler to prevent re-creation
  const handleImageError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
    }
  }, [hasError]);

  useEffect(() => {
    if (!isVideo) return;

    // Defer heavy video player JS to reduce TBT and protect LCP.
    // Show a poster image first; load the player when the browser is idle.
    const timeoutId = setTimeout(() => {
      if (typeof window === "undefined") return;

      if ("requestIdleCallback" in window) {
        const idleId = window.requestIdleCallback(
          () => setShouldLoadVideoPlayer(true),
          { timeout: 1500 }
        );
        return () => window.cancelIdleCallback?.(idleId);
      }

      setShouldLoadVideoPlayer(true);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [isVideo]);

  const posterSrc = useMemo(() => {
    if (getValidUrl(thumbnailCoverImageUrl)) return thumbnailCoverImageUrl;
    if (getValidUrl(coverImageUrl)) return coverImageUrl;

    // YouTube: derive a thumbnail so we still get a fast LCP image.
    const url = getValidUrl(coverMedia) ? coverMedia : null;
    if (!url) return PLACEHOLDER_IMAGE;

    const isYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
    if (!isYouTube) return PLACEHOLDER_IMAGE;

    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");
      let videoId = "";

      if (host === "youtu.be") {
        videoId = parsed.pathname.replace("/", "");
      } else {
        videoId = parsed.searchParams.get("v") || "";
        if (!videoId && parsed.pathname.startsWith("/embed/")) {
          videoId = parsed.pathname.split("/embed/")[1] || "";
        }
      }

      if (!videoId) return PLACEHOLDER_IMAGE;
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch {
      return PLACEHOLDER_IMAGE;
    }
  }, [thumbnailCoverImageUrl, coverImageUrl, coverMedia]);

  return (
    <BoxComponent sx={styles.coverImg}>
      {isVideo ? (
        <BoxComponent sx={styles.mediaContainer}>
          <NextImage
            src={posterSrc}
            alt="campaign-cover-video-poster"
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 66vw, 740px"
            style={{
              borderRadius: "12px",
              objectFit: "cover",
            }}
            onError={handleImageError}
            priority={true}
            fetchPriority="high"
            loading="eager"
          />

          {shouldLoadVideoPlayer && (
            <BoxComponent sx={{ position: "absolute", inset: 0 }}>
              <Suspense fallback={null}>
                <VideoPlayerComponent
                  url={lcpImageSrc}
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                  width="100%"
                  height="100%"
                />
              </Suspense>
            </BoxComponent>
          )}
        </BoxComponent>
      ) : (
        <BoxComponent sx={styles.mediaContainer}>
          <NextImage
            src={displaySrc}
            alt="campaign-cover-photo"
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 66vw, 840px"
            style={{
              borderRadius: "12px",
              objectFit: "cover",
            }}
            onError={handleImageError}
            priority={true}
            fetchPriority="high"
            loading="eager"
          />
        </BoxComponent>
      )}
    </BoxComponent>
  );
}
