"use client";

import React, { Suspense, useState, useCallback, useTransition } from "react";
import dynamic from "next/dynamic";
import StackComponent from "@/components/atoms/StackComponent";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import ArrowsLeftAndRight from "@/components/UI/Home/UI/ArrowsLeftAndRight";
import ExternalLink from "@/components/UI/Home/UI/ExternalLink";

// Dynamic import with skeleton fallback
const FeaturedCampaignCards = dynamic(
  () => import("./FeaturedCampaignCards"),
  { 
    loading: () => <FeaturedCampaignsCardsSkeleton />,
    ssr: true // Keep SSR for SEO/LCP
  }
);

// Copied skeleton from server component for client fallback
function FeaturedCampaignsCardsSkeleton() {
  return (
    <div className="skeleton-grid" style={{ display: "flex", gap: "32px", width: "100%" }}>
      <div className="skeleton-col-1" style={{ width: "40.81%", flexShrink: 0 }}>
        <div className="skeleton-card" style={{ height: "486px", borderRadius: "24px" }} />
      </div>
      <div className="skeleton-col-2" style={{ width: "25.85%", display: "flex", flexDirection: "column", gap: "24px", flexShrink: 0 }}>
        <div className="skeleton-card" style={{ height: "229px", borderRadius: "24px" }} />
        <div className="skeleton-card" style={{ height: "229px", borderRadius: "24px" }} />
      </div>
      <div className="skeleton-col-3" style={{ width: "25.85%", display: "flex", flexDirection: "column", gap: "24px", flexShrink: 0 }}>
        <div className="skeleton-card" style={{ height: "229px", borderRadius: "24px" }} />
        <div className="skeleton-card" style={{ height: "229px", borderRadius: "24px" }} />
      </div>
    </div>
  );
}

export default function FeaturedCampaignsClient({
  initialCampaigns,
  initialHasMore,
  cfCountry,
}) {
  const { isSmallScreen } = useResponsiveScreen();
  const [isPending, startTransition] = useTransition();

  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Store cfCountry in localStorage for HomeInit and other components
  React.useEffect(() => {
    if (cfCountry && typeof window !== "undefined") {
      localStorage.setItem("cfCountry", cfCountry);
    }
  }, [cfCountry]);

  // Rest of component logic...
  const fetchPage = useCallback(
    async (page) => {
      setIsLoading(true);
      setHasError(false);

      try {
        // Use the API route for client-side pagination
        const response = await fetch(
          `/api/featured-campaigns?page=${page}&cfCountry=${cfCountry}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        startTransition(() => {
          setCampaigns(data.campaigns);
          setHasMore(data.hasMore);
          setCurrentPage(page);
        });
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [cfCountry]
  );

  const increasePage = useCallback(() => {
    if (hasMore && !isLoading) {
      fetchPage(currentPage + 1);
    }
  }, [hasMore, isLoading, currentPage, fetchPage]);

  const decreasePage = useCallback(() => {
    if (currentPage > 0 && !isLoading) {
      fetchPage(currentPage - 1);
    }
  }, [currentPage, isLoading, fetchPage]);

  return (
    <>
      {/* Pagination Controls - Client Interactive (Desktop only) */}
      {!isSmallScreen && (
        <StackComponent
          sx={{
            position: "absolute",
            top: "32px",
            right: "32px",
          }}
        >
          <ArrowsLeftAndRight
            disabledLeft={currentPage === 0}
            disabledRight={!hasMore || isLoading || isPending}
            rightAction={increasePage}
            leftAction={decreasePage}
          />
        </StackComponent>
      )}

      {/* Campaign Cards */}
      <FeaturedCampaignCards
        campaigns={campaigns}
        isLoading={isLoading || isPending}
        hasError={hasError}
      />

      {/* Discover Link */}
      <StackComponent justifyContent="center">
        <ExternalLink to="/discover">Discover Fundraisers</ExternalLink>
      </StackComponent>
    </>
  );
}
