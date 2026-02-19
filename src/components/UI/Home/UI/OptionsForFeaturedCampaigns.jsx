"use client";

import PropTypes from "prop-types";
import React from "react";
import StackComponent from "../../../../components/atoms/StackComponent";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";

import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";

import CampaignsController from "./CampaignsController";
import ExternalLink from "./ExternalLink";

const OptionsForFeaturedCampaigns = ({
  loadingfeaturedCampaigns,
  hasErrorfeaturedCampaigns,
  campaignsArr,
}) => {
  const { isMediumScreen, isSmallScreen } = useResponsiveScreen();
  // mutatedCampaignsArr && mutatedCampaignsArr.length > 0

  return (
    <>
      <StackComponent
        direction={isMediumScreen ? "column" : "row"}
        spacing="32px"
      >
        <BoxComponent
          sx={{
            width: isMediumScreen ? "100%" : "40.81%",
          }}
        >
          <CampaignsController
            isLoading={loadingfeaturedCampaigns}
            hasError={hasErrorfeaturedCampaigns}
            campaignItem={campaignsArr?.length > 0 ? campaignsArr[0] : []}
            height="486px"
            imageHeight={isSmallScreen ? "medium" : "small"}
            priority={true} // LCP optimization - first visible campaign
            recurringDonation={
              campaignsArr?.length > 0 ? campaignsArr[0]?.recurringDonation : ""
            }
            oneTimeDonation={
              campaignsArr?.length > 0 ? campaignsArr[0]?.oneTimeDonation : ""
            }
          />
        </BoxComponent>
        <StackComponent
          sx={{
            width: isMediumScreen ? "100%" : "25.85%",
          }}
          direction="column"
          spacing="24px"
        >
          <CampaignsController
            height="229px"
            isLoading={loadingfeaturedCampaigns}
            hasError={hasErrorfeaturedCampaigns}
            // currencySymbol
            campaignItem={campaignsArr?.length > 0 ? campaignsArr[1] : []}
            imageHeight={isSmallScreen ? "medium" : "small"}
            recurringDonation={
              campaignsArr?.length > 0 ? campaignsArr[1]?.recurringDonation : ""
            }
            oneTimeDonation={
              campaignsArr?.length > 0 ? campaignsArr[1]?.oneTimeDonation : ""
            }
          />
          <CampaignsController
            height="229px"
            isLoading={loadingfeaturedCampaigns}
            hasError={hasErrorfeaturedCampaigns}
            campaignItem={campaignsArr?.length > 0 ? campaignsArr[2] : []}
            imageHeight={isSmallScreen ? "medium" : "small"}
            recurringDonation={
              campaignsArr?.length > 0 ? campaignsArr[2]?.recurringDonation : ""
            }
            oneTimeDonation={
              campaignsArr?.length > 0 ? campaignsArr[2]?.oneTimeDonation : ""
            }
          />
        </StackComponent>
        <StackComponent
          sx={{ width: isMediumScreen ? "100%" : "25.85%" }}
          direction="column"
          spacing="24px"
        >
          <CampaignsController
            height="229px"
            isLoading={loadingfeaturedCampaigns}
            hasError={hasErrorfeaturedCampaigns}
            campaignItem={campaignsArr?.length > 0 ? campaignsArr[3] : []}
            imageHeight={isSmallScreen ? "medium" : "small"}
            recurringDonation={
              campaignsArr?.length > 0 ? campaignsArr[3]?.recurringDonation : ""
            }
            oneTimeDonation={
              campaignsArr?.length > 0 ? campaignsArr[3]?.oneTimeDonation : ""
            }
          />
          <CampaignsController
            height="229px"
            isLoading={loadingfeaturedCampaigns}
            hasError={hasErrorfeaturedCampaigns}
            campaignItem={campaignsArr?.length > 0 ? campaignsArr[4] : []}
            imageHeight={isSmallScreen ? "medium" : "small"}
            recurringDonation={
              campaignsArr?.length > 0 ? campaignsArr[4]?.recurringDonation : ""
            }
            oneTimeDonation={
              campaignsArr?.length > 0 ? campaignsArr[4]?.oneTimeDonation : ""
            }
          />
        </StackComponent>
      </StackComponent>
      <StackComponent justifyContent="center">
        <ExternalLink to="/discover" unstable_viewTransition>
          Discover Fundraisers
        </ExternalLink>
      </StackComponent>
    </>
  );
};

OptionsForFeaturedCampaigns.propTypes = {
  campaignsArr: PropTypes.any,
  featuredCampaigns: PropTypes.any,
  hasErrorfeaturedCampaigns: PropTypes.any,
  loadingfeaturedCampaigns: PropTypes.any,
};

export default OptionsForFeaturedCampaigns;
