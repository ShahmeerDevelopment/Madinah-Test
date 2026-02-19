"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import DonationProgressBar from "@/components/advance/DonationProgressBar";
import StackComponent from "@/components/atoms/StackComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import Image from "@/components/atoms/imageComponent/Image";
import NextImage from "next/image";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import { ASSET_PATHS } from "@/utils/assets";
const placeHolderImage = ASSET_PATHS.images.imagePlaceholder;
import useNavigateToCampaign from "@/hooks/useNavigateToCampaign";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { getVideoThumbnail } from "@/utils/helpers";
import { getCookie } from "cookies-next";
import { handlePosthog } from "@/api/post-api-services";
// import posthog from "posthog-js";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";

// Next
const DEFAULT_IMAGE =
  "https://madinah-dev.s3.us-east-1.amazonaws.com/campaign-cover-images/1000X1000/Cxl9fn-1730095218.png";

const CampaignOption = ({
  coverImageUrl = DEFAULT_IMAGE,
  discoverPage = false,
  image,
  videoLinks,
  title = "Fundraiser for animal rescue in Africa",
  subtitle = "",
  raisedAmount = 1000,
  totalGoal = 10000,
  raisedCurrency = "$",
  currencySymbol = "$",
  containerStyleOverrides,
  containerProps,
  width = "100%",
  imageHeight = "small",
  height,
  recurringDonation = false,
  imageStyleOverrides,
  ratio = "47.33%",
  isRatio = false,
  isLoading,
  oneTimeDonation,
  searchPage = false,
  priority = false, // For LCP optimization - first visible campaign
  ...otherProps
}) => {
  let heightOfImage = "100%";
  if (imageHeight === "small") {
    heightOfImage = "119px";
  }
  if (imageHeight === "medium") {
    heightOfImage = "154px";
  }

  const navigateToCampaign = useNavigateToCampaign();

  const { isSmallScreen } = useResponsiveScreen();
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const [imgSrc, setImgSrc] = useState(
    !coverImageUrl || coverImageUrl === "" ? placeHolderImage : coverImageUrl
  );

  useEffect(() => {
    const loadImage = async () => {
      try {
        // If there's no image but there are video links, get the video thumbnail
        if (videoLinks?.length > 0) {
          if (videoLinks[0].url) {
            const thumbnail = await getVideoThumbnail(videoLinks[0].url);
            setImgSrc(thumbnail || DEFAULT_IMAGE);
          }
        } else {
          // If there's an image, use it
          setImgSrc(coverImageUrl || DEFAULT_IMAGE);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setImgSrc(DEFAULT_IMAGE);
      }
    };
    loadImage();
  }, [coverImageUrl, videoLinks]);

  const handleError = () => {
    setImgSrc(DEFAULT_IMAGE);
  };

  return (
    <StackComponent
      className="campaign-option"
      spacing={0}
      sx={{
        width: width,
        cursor: "pointer",
        height: "100%",
        ...containerStyleOverrides,
      }}
      direction="column"
      onClick={() => {
        if (searchPage) {
          const userId = getCookie("distinctId");
          const payload = {
            distinctId: userId,
            event: "Campaign Clicked From Search",
            properties: {
              $current_url: `https://www.madinah.com/${otherProps?.urlRedirect}`,
              // ...posthog?.persistence?.props,
            },
          };
          if (parsedConsent?.analytics || !consentCookie) {
            enhancedHandlePosthog(
              handlePosthog,
              payload,
              title || "Campaign Page"
            );
          }
        }
        navigateToCampaign(otherProps?.urlRedirect);
      }}
      {...containerProps}
    >
      {isRatio ? (
        <BoxComponent
          sx={{
            width: "100%", // Container width
            paddingTop: ratio, // 16:9 aspect ratio (9 / 16 = 0.5625)
            position: "relative",
            marginBottom: "12px !important",
          }}
        >
          <NextImage
            src={discoverPage ? imgSrc : image}
            alt={title}
            fill
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            loading={priority ? undefined : "lazy"}
            sizes={
              priority
                ? "(max-width: 600px) 100vw, (max-width: 900px) 50vw, 400px"
                : "(max-width: 768px) 100vw, 400px"
            }
            style={{
              objectFit: "cover",
              borderRadius: "12px",
            }}
            onError={handleError}
          />
        </BoxComponent>
      ) : (
        <Image
          className="image-container"
          width="100%"
          height={heightOfImage}
          source={discoverPage ? imgSrc : image}
          alt="fundraiser-option"
          objectFit="cover"
          priority={priority}
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 435px"
          containerStyles={{
            borderRadius: "12px",
            mb: "12px !important",
            overflow: "hidden",
            flexGrow: 1,
            ...imageStyleOverrides,
          }}
          onError={handleError}
          // placeholderSrc={DEFAULT_IMAGE}
        />
      )}

      <LimitedParagraph
        sx={{
          fontWeight: 500,
          fontSize: "22px",
          lineHeight: "28px",
          letterSpacing: "-0.41px",
          color: "#090909",
          maxWidth: "100%",
        }}
        line={1}
      >
        {title}
      </LimitedParagraph>

      <LimitedParagraph
        fontWeight={400}
        fontSize={"16px"}
        lineHeight={"20px"}
        sx={{
          letterSpacing: "-0.41px",
          color: "#A1A1A8",
          marginTop: height === "229px" || isSmallScreen ? "-5px" : "",
        }}
        line={1}
      >
        {subtitle === "" || subtitle === undefined || subtitle === null ? (
          <span style={{ color: "#ffffff" }}>-</span>
        ) : (
          subtitle
        )}
      </LimitedParagraph>
      <DonationProgressBar
        minVal={0}
        maxVal={totalGoal}
        defaultValue={raisedAmount}
        small
        currency={searchPage ? currencySymbol : raisedCurrency}
        withoutResponsiveness
        recurringDonation={recurringDonation}
        isStatic={false}
        isLoading={isLoading}
        oneTimeDonation={oneTimeDonation}
      />
    </StackComponent>
  );
};

CampaignOption.propTypes = {
  containerProps: PropTypes.any,
  containerStyleOverrides: PropTypes.any,
  coverImageUrl: PropTypes.any,
  videoLinks: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    })
  ),
  imageHeight: PropTypes.string,
  imageStyleOverrides: PropTypes.any,
  raisedAmount: PropTypes.number,
  currencySymbol: PropTypes.string,
  title: PropTypes.string,
  totalGoal: PropTypes.any,
  width: PropTypes.string,
  ratio: PropTypes.any,
  isRatio: PropTypes.bool,
  subtitle: PropTypes.string,
  recurringDonation: PropTypes.bool,
  isLoading: PropTypes.bool,
  oneTimeDonation: PropTypes.any,
  priority: PropTypes.bool,
};

export default CampaignOption;
