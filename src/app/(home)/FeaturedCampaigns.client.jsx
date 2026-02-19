"use client";

import React from "react";

import useFeaturedCampaignsFetch from "@/hooks/useFeaturedCampaignsFetch";
import OptionsForFeaturedCampaigns from "@/components/UI/Home/UI/OptionsForFeaturedCampaigns";
import FeaturedCampaignsControls from "./FeaturedCampaignsControls.client";

export default function FeaturedCampaigns({
  mutatedCampaignsArr,
  loadingfeaturedCampaigns,
  hasErrorfeaturedCampaigns,
  campaignsStillRemaining,
  currentPage,
  controlsSlot,
}) {
  const {
    featuredCampaigns: campaigns,
    loadingfeaturedCampaigns: isLoading,
    hasErrorfeaturedCampaigns: hasError,
    increasePage,
    decreasePage,
    campaignsStillRemaining: stillRemaining,
    currentPage: page,
  } = useFeaturedCampaignsFetch({
    mutatedCampaignsArr,
    loadingfeaturedCampaigns,
    hasErrorfeaturedCampaigns,
    campaignsStillRemaining,
    currentPage,
  });

  return (
    <>
      {controlsSlot ? (
        controlsSlot({
          currentPage: page,
          campaignsStillRemaining: stillRemaining,
          loadingfeaturedCampaigns: isLoading,
          increasePage,
          decreasePage,
        })
      ) : (
        <FeaturedCampaignsControls
          currentPage={page}
          campaignsStillRemaining={stillRemaining}
          loadingfeaturedCampaigns={isLoading}
          increasePage={increasePage}
          decreasePage={decreasePage}
        />
      )}

      <OptionsForFeaturedCampaigns
        hasErrorfeaturedCampaigns={hasError}
        loadingfeaturedCampaigns={isLoading}
        campaignsArr={campaigns}
      />
    </>
  );
}
