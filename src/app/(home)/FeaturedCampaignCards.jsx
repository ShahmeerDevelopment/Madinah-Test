"use client";

/**
 * Featured Campaign Cards Component
 *
 * Renders the campaign cards grid with loading/error states.
 * Uses useResponsiveScreen for responsive layout.
 *
 * Matches original OptionsForFeaturedCampaigns behavior:
 * - isMediumScreen (<=900px): column layout (all 5 cards stacked)
 * - Desktop: row layout with 3 columns
 */

import React from "react";
import StackComponent from "@/components/atoms/StackComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import CampaignsController from "@/components/UI/Home/UI/CampaignsController";

export default function FeaturedCampaignCards({
  campaigns,
  isLoading,
  hasError,
}) {
  const { isMediumScreen, isSmallScreen } = useResponsiveScreen();

  return (
    <>
      {/* Styles moved to globals.css for TBT optimization */}
      <StackComponent
        className="featured-cards-grid"
        direction={isMediumScreen ? "column" : "row"}
        spacing="32px"
      >
        {/* Main featured campaign (large) */}
        <BoxComponent
          sx={{
            width: isMediumScreen ? "100%" : "40.81%",
          }}
        >
          <CampaignsController
            isLoading={isLoading}
            hasError={hasError}
            campaignItem={campaigns?.length > 0 ? campaigns[0] : null}
            height="486px"
            imageHeight={isSmallScreen ? "medium" : "small"}
            priority={true}
            recurringDonation={campaigns?.[0]?.recurringDonation || false}
            oneTimeDonation={campaigns?.[0]?.oneTimeDonation || false}
          />
        </BoxComponent>

        {/* Second column (2 campaigns) */}
        <StackComponent
          sx={{
            width: isMediumScreen ? "100%" : "25.85%",
          }}
          direction="column"
          spacing="24px"
        >
          <CampaignsController
            height="229px"
            isLoading={isLoading}
            hasError={hasError}
            campaignItem={campaigns?.length > 1 ? campaigns[1] : null}
            imageHeight={isSmallScreen ? "medium" : "small"}
            recurringDonation={campaigns?.[1]?.recurringDonation || false}
            oneTimeDonation={campaigns?.[1]?.oneTimeDonation || false}
          />
          <CampaignsController
            height="229px"
            isLoading={isLoading}
            hasError={hasError}
            campaignItem={campaigns?.length > 2 ? campaigns[2] : null}
            imageHeight={isSmallScreen ? "medium" : "small"}
            recurringDonation={campaigns?.[2]?.recurringDonation || false}
            oneTimeDonation={campaigns?.[2]?.oneTimeDonation || false}
          />
        </StackComponent>

        {/* Third column (2 campaigns) */}
        <StackComponent
          sx={{ width: isMediumScreen ? "100%" : "25.85%" }}
          direction="column"
          spacing="24px"
        >
          <CampaignsController
            height="229px"
            isLoading={isLoading}
            hasError={hasError}
            campaignItem={campaigns?.length > 3 ? campaigns[3] : null}
            imageHeight={isSmallScreen ? "medium" : "small"}
            recurringDonation={campaigns?.[3]?.recurringDonation || false}
            oneTimeDonation={campaigns?.[3]?.oneTimeDonation || false}
          />
          <CampaignsController
            height="229px"
            isLoading={isLoading}
            hasError={hasError}
            campaignItem={campaigns?.length > 4 ? campaigns[4] : null}
            imageHeight={isSmallScreen ? "medium" : "small"}
            recurringDonation={campaigns?.[4]?.recurringDonation || false}
            oneTimeDonation={campaigns?.[4]?.oneTimeDonation || false}
          />
        </StackComponent>
      </StackComponent>
    </>
  );
}
