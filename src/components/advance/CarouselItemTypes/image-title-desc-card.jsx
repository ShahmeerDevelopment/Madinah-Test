"use client";

import PropTypes from "prop-types";
import React from "react";

import { ASSET_PATHS } from "@/utils/assets";
const placeHolderImage = ASSET_PATHS.images.imagePlaceholder;
import useNavigateToCampaign from "@/hooks/useNavigateToCampaign";
import StackComponent from "@/components/atoms/StackComponent";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import Image from "@/components/atoms/imageComponent/Image";
import DonationProgressBar from "@/components/advance/DonationProgressBar";
import { getCookie } from "cookies-next";
import { handlePosthog } from "@/api/post-api-services";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";

// Next
const CarouselItemWitImgTitleDescCard = ({
  title,
  image,
  subTitle,
  raisedAmount,
  totalGoal,
  raisedCurrency,
  fromHomepage = false,
  ...otherProps
}) => {
  const viewCampaign = useNavigateToCampaign();
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  return (
    <StackComponent
      className="card-item"
      direction="column"
      spacing={0}
      onClick={() => {
        if (parsedConsent?.analytics || !consentCookie) {
          const userId = getCookie("distinctId");
          const payload = {
            distinctId: userId,
            event: "Campaign Clicked From Home",
            properties: {
              $current_url: `https://www.madinah.com/${otherProps.urlRedirect}`,
              // Enhanced properties will be automatically added by handlePosthog function
            },
          };
          enhancedHandlePosthog(
            handlePosthog,
            payload,
            title || "Campaign Page",
          );
        }
        viewCampaign(otherProps.urlRedirect);
      }}
      sx={{
        // boxShadow: '0px 0px 100px 0px #0000000F',
        background: "#ffffff",
        borderRadius: "16px",
        width: "320px",
        cursor: "pointer",
        padding: "16px !important",
      }}
    >
      <Image
        source={!image || image === "" ? placeHolderImage : image}
        alt="campaign-cover"
        width="100%"
        height="154px"
        objectFit="cover"
        sizes="320px"
        containerStyles={{
          borderRadius: "16px",
          overflow: "hidden",
        }}
      />
      <LimitedParagraph
        line={1}
        sx={{
          mt: "16px",
          color: "#090909",
          fontWeight: 500,
          fontSize: "18px",
          lineHeight: "22px",
          letterSpacing: "-0.41px",
        }}
      >
        {title}
      </LimitedParagraph>
      <LimitedParagraph
        line={1}
        sx={{
          color: "#A1A1A8",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "20px",
          letterSpacing: "-0.41px",
        }}
      >
        {subTitle === "" || subTitle === undefined || subTitle === null ? (
          <span style={{ color: "#ffffff" }}>-</span>
        ) : (
          subTitle
        )}
      </LimitedParagraph>

      {/* Progress Bar Section */}
      {!fromHomepage &&
        raisedAmount !== undefined &&
        totalGoal !== undefined && (
          <DonationProgressBar
            minVal={0}
            maxVal={totalGoal}
            defaultValue={raisedAmount}
            small
            currency={raisedCurrency}
            withoutResponsiveness
            isStatic={false}
          />
        )}
    </StackComponent>
  );
};

CarouselItemWitImgTitleDescCard.propTypes = {
  image: PropTypes.any,
  subTitle: PropTypes.any,
  title: PropTypes.any,
  raisedAmount: PropTypes.number,
  totalGoal: PropTypes.number,
  raisedCurrency: PropTypes.string,
};

export default CarouselItemWitImgTitleDescCard;
