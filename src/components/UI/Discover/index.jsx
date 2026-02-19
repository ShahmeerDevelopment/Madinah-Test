"use client";

import StackComponent from "@/components/atoms/StackComponent";
import React, { useEffect } from "react";
import WhiteFlexBackgroundLayout from "./UI/WhiteBackgroundLayout";
import Explore from "./Subsections/Explore";
import GiveAroundTheWorld from "./Subsections/GiveAroundTheWorld";
import DonateToFavoriteCharity from "./Subsections/DonateToFavoriteCharity";
import FeaturedCampaigns from "./Subsections/FeaturedCampaigns";
import HelpRebuild from "./Subsections/HelpRebuild";
import PickACampaign from "./Subsections/PickACampaign";
import TrendingCampaigns from "./Subsections/TrendingCampaigns";
import { getAllVisits } from "@/api/get-api-services";
import { useSelector } from "react-redux";

const Discover = () => {
  const utmParameters = useSelector((state) => state.utmParameters);
  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral,
    );
  }, []);
  return (
    <StackComponent
      spacing="24px"
      sx={{ width: "100%", mt: "24px" }}
      direction="column"
    >
      <WhiteFlexBackgroundLayout spacing="16px">
        <Explore />
      </WhiteFlexBackgroundLayout>
      <WhiteFlexBackgroundLayout spacing="24px">
        <GiveAroundTheWorld />
      </WhiteFlexBackgroundLayout>
      <WhiteFlexBackgroundLayout spacing="24px">
        <DonateToFavoriteCharity />
      </WhiteFlexBackgroundLayout>
      <WhiteFlexBackgroundLayout spacing="24px">
        <FeaturedCampaigns />
      </WhiteFlexBackgroundLayout>
      <HelpRebuild />
      <WhiteFlexBackgroundLayout spacing="24px">
        <PickACampaign />
      </WhiteFlexBackgroundLayout>
      <WhiteFlexBackgroundLayout spacing="24px">
        <TrendingCampaigns />
      </WhiteFlexBackgroundLayout>
    </StackComponent>
  );
};

export default Discover;
