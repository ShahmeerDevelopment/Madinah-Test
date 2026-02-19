"use client";

import React from "react";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import ArrowsLeftAndRight from "@/components/UI/Home/UI/ArrowsLeftAndRight";

export default function FeaturedCampaignsControls({
  currentPage,
  campaignsStillRemaining,
  loadingfeaturedCampaigns,
  increasePage,
  decreasePage,
}) {
  const { isSmallScreen } = useResponsiveScreen();

  if (isSmallScreen) return null;

  return (
    <ArrowsLeftAndRight
      disabledLeft={currentPage === 0}
      disabledRight={!campaignsStillRemaining || loadingfeaturedCampaigns}
      rightAction={increasePage}
      leftAction={decreasePage}
    />
  );
}
