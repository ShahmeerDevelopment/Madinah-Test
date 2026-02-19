"use client";

import React from "react";

import Section from "@/components/UI/Home/UI/Section";
import ArrowsLeftAndRight from "@/components/UI/Home/UI/ArrowsLeftAndRight";
import OptionsForFeaturedCampaigns from "@/components/UI/Home/UI/OptionsForFeaturedCampaigns";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import useFeaturedCampaignsFetch from "@/hooks/useFeaturedCampaignsFetch";

export default function FeaturedCampaignsSection({
  mutatedCampaignsArr,
  loadingfeaturedCampaigns,
  hasErrorfeaturedCampaigns,
  campaignsStillRemaining,
  currentPage,
}) {
  const { isSmallScreen } = useResponsiveScreen();

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
    <Section
      heading="Featured Campaigns"
      sectionRightActions={
        isSmallScreen ? null : (
          <ArrowsLeftAndRight
            disabledLeft={page === 0}
            disabledRight={!stillRemaining || isLoading}
            rightAction={increasePage}
            leftAction={decreasePage}
          />
        )
      }
      direction="column"
      spacing="32px"
    >
      <OptionsForFeaturedCampaigns
        hasErrorfeaturedCampaigns={hasError}
        loadingfeaturedCampaigns={isLoading}
        campaignsArr={campaigns}
      />
    </Section>
  );
}
