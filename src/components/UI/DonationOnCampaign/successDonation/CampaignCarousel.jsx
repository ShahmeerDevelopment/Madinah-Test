"use client";

import React, { startTransition, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import CampaignCard from "@/components/molecules/campaignCard/CampaignCard";
import { CarouselWrapper } from "@/components/UI/Dashboard/Dashboard.style";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import CarousalWithLeftRightInColumn from "@/components/advance/CarousalWithLeftRightInColumn";
import {
  buildSimpleTypography,
  getUTMParams,
  getVideoThumbnail,
} from "@/utils/helpers";
import { getCookie } from "cookies-next";
import { handlePosthog } from "@/api/post-api-services";
// import posthog from "posthog-js";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";

const CampaignCarousel = ({ getAllCampaigns, isWidgetMode = false }) => {
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const router = useRouter();
  const { isSmallScreen } = useResponsiveScreen();

  // Ensure getAllCampaigns is an array
  const campaignsArray = Array.isArray(getAllCampaigns) ? getAllCampaigns : [];

  // State to store the image URLs for campaigns
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (!campaignsArray.length) return;

    const fetchImageUrls = async () => {
      const updatedUrls = await Promise.all(
        campaignsArray.map(async (item) => {
          let urlImage = item.coverImageUrl;
          if (
            !urlImage &&
            item.videoLinks &&
            Array.isArray(item.videoLinks) &&
            item.videoLinks.length > 0
          ) {
            const thumbnail = await getVideoThumbnail(item.videoLinks[0].url);
            return thumbnail;
          }
          return urlImage;
        }),
      );
      setImageUrls(updatedUrls);
    };

    fetchImageUrls();
  }, [campaignsArray]);

  const navigateToCampaign = (randomToken, title) => {
    const userId = getCookie("distinctId");
    const utmParams = getUTMParams(window.location.href);
    const payload = {
      distinctId: userId,
      event: "Clicked on Related Campaign from Thank You Page",
      properties: {
        $current_url: window?.location?.href,
        // ...posthog?.persistence?.props,
        ...utmParams,
      },
    };
    if (parsedConsent?.analytics || !consentCookie) {
      enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");
    }
    const url = `/${randomToken}?src=internal_website`;
    if (isWidgetMode) {
      window.open(url, "_blank");
    } else {
      startTransition(() => {
        router.push(url);
      });
    }
  };

  const campaignsList = campaignsArray.map((item, index) => {
    const urlImage = imageUrls[index]; // Get the resolved image URL
    return (
      <div
        key={index}
        style={{
          marginRight: "4px",
          maxWidth: "100%",
          overflow: "hidden",
          ...(isSmallScreen && { marginBottom: "24px" }),
        }}
        className="campaign-item"
        onClick={() => navigateToCampaign(item.randomToken, item.title)}
      >
        <CampaignCard
          image={urlImage}
          title={item.title}
          description={item.campaignerId?.firstName}
          subTitle={item.subTitle}
          recurringDonation={item.isRecurringDonation}
          currencySymbol={item.currencySymbol}
          oneTimeDonation={item.isOneTimeDonation}
          collectedAmount={item.collectedAmount}
          targetAmount={item.targetAmount}
          fromSuccessDonation={true}
        />
      </div>
    );
  });

  // If no campaigns are available, don't render anything
  if (!campaignsArray.length) {
    return null;
  }

  return (
    <CarouselWrapper>
      {isSmallScreen ? (
        <StackComponent direction="column" spacing="16px">
          <TypographyComp
            sx={{
              ...buildSimpleTypography(500, 22, 28),
              color: "rgba(96, 96, 98, 1)",
            }}
          >
            {"Need more Ajr?"}
          </TypographyComp>
          <StackComponent direction="column" spacing="0px">
            {campaignsList.slice(0, 4)}
          </StackComponent>
        </StackComponent>
      ) : (
        <CarousalWithLeftRightInColumn
          mobileViewSlidesToShow={2}
          itemClassName="campaign-item"
          itemStyleOverrides={{
            maxWidth: "325px",
          }}
          heading={"Need more Ajr?"}
          slidesToShow={4}
          slideToShowIn1080={3}
          headingStyles={{
            ...buildSimpleTypography(500, 22, 28),
            color: "rgba(96, 96, 98, 1)",
          }}
          headerStyles={{
            marginBottom: "24px !important",
          }}
        >
          {campaignsList}
        </CarousalWithLeftRightInColumn>
      )}
    </CarouselWrapper>
  );
};
CampaignCarousel.propTypes = {
  getAllCampaigns: PropTypes.any,
};
export default CampaignCarousel;
