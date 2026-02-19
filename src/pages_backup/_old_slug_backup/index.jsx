/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { getSingleCampaignData } from "@/api";
import { setUtmParams } from "@/store/slices/utmSlice";
import ErrorAlert from "@/components/advance/ErrorAlert";
import {
  formatTimestamp,
  getThumbnailUrl,
  getUTMParams,
} from "@/utils/helpers";
import {
  CONSENT_COOKIE_NAME,
  DEFAULT_AVATAR,
  RANDOM_URL,
} from "@/config/constant";
import { useDispatch } from "react-redux";
import ViewCampaignTemplate from "@/components/templates/ViewCampaignTemplate";
import Head from "next/head";
import PageTransitionWrapper from "@/components/atoms/PageTransitionWrapper";
import { getRecentSupporters } from "@/api/get-api-services";
import { announcementTokenHandler } from "@/store/slices/donationSlice";
import { getCookie } from "cookies-next";
import { handlePosthog } from "@/api/post-api-services";
import { executeAnalyticsWithConsent } from "@/utils/gdprConsent";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";

export const minHeight = "calc(100% - 104px - 32px - 44px)";

const ViewCampaign = ({ campaignValuesAsProps, error, cfCountry }) => {
  // const gaTrackingId = process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID;
  // const gaAdsTrackingId = process.env.NEXT_PUBLIC_GOOGLE_AD;
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referral,
    slug,
    announcementToken,
    fbclid,
    src,
    widget,
    embedded,
    preview,
  } = router.query;
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  const parsedConsent = useMemo(() => {
    if (consentCookie) {
      return JSON.parse(consentCookie);
    }
    return {};
  }, [consentCookie]);

  const utmParams = useMemo(
    () => ({
      utmSource: utm_source,
      utmMedium: utm_medium,
      utmCampaign: utm_campaign,
      utmTerm: utm_term,
      utmContent: utm_content,
      referral,
      fbclid,
      src,
    }),
    [
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referral,
      fbclid,
      src,
    ]
  );
  useEffect(() => {
    if (router.isReady) {
      dispatch(setUtmParams(utmParams));
    }
  }, [router.isReady, dispatch, utmParams]);

  useEffect(() => {
    // const src = router?.query?.src;
    const referrer = document?.referrer;
    const userId = getCookie("distinctId");
    const utmParams = getUTMParams(window.location.href);

    const trackPageView = (eventName, properties) => {
      executeAnalyticsWithConsent(() => {
        const payload = {
          distinctId: userId,
          event: eventName,
          properties: {
            $current_url: window.location.href,
            // Enhanced properties will be automatically added by handlePosthog function
            ...properties,
            ...utmParams,
          },
        };
        if (parsedConsent?.analytics || !consentCookie) {
          enhancedHandlePosthog(
            handlePosthog,
            payload,
            campaignValuesAsProps?.title || "Campaign Page"
          );
        }
      });
    };

    const captureEvent = () => {
      if (referrer) {
        trackPageView("Campaign Landing Page (Referrer Visit)");
      } else if (utm_source || utm_medium || utm_campaign || utm_term || utm_content) {
        trackPageView("Campaign Landing Page (Referrer Visit)");
      } else if (src) {
        let eventName;
        if (src === "internal_website") {
          eventName = "Campaign Landing Page (Organic Visit)";
        } else {
          eventName = "Campaign Landing Page (Shared Link Visit)";
        }
        trackPageView(eventName);
      } else {
        trackPageView("Campaign Landing Page (Shared Link Visit)");
      }
    };

    // Wait for PostHog to be initialized before capturing events
    if (typeof window !== "undefined") {
      const checkPostHogAndCapture = () => {
        const posthog = require("posthog-js").default;
        if (posthog && posthog.__loaded) {
          captureEvent();
        } else {
          // PostHog not yet initialized, wait and retry
          setTimeout(checkPostHogAndCapture, 100);
        }
      };

      // Small delay to ensure ConditionalAnalytics has initialized PostHog
      setTimeout(checkPostHogAndCapture, 200);
    }
  }, [src, utm_source, utm_medium, utm_campaign, utm_term, utm_content, parsedConsent]);

  //This will execute the script on initial load
  useEffect(() => {
    dispatch(announcementTokenHandler(announcementToken));
    // Save cfCountry to localStorage if available
    if (cfCountry) {
      if (typeof window !== "undefined") {
        localStorage.setItem("cfCountry", cfCountry);
      }
    }

    if (campaignValuesAsProps?.meta && campaignValuesAsProps.meta.length > 0) {
      campaignValuesAsProps.meta.forEach((metaItem) => {
        if (metaItem.type === "viewPageScript") {
          try {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.text = metaItem.value;
            document.head.appendChild(script);

            // Optionally, remove the script after execution
            document.head.removeChild(script);
          } catch (error) {
            console.error("Error executing script from meta:", error);
          }
        }
      });
    }
  }, [campaignValuesAsProps, announcementToken, cfCountry, dispatch]);

  if (error) {
    const errorMessage = error || "Error 400: No Campaign ID found!";
    return (
      <BoxComponent sx={{ minHeight }}>
        <ErrorAlert>{errorMessage}</ErrorAlert>
      </BoxComponent>
    );
  }

  // Check if this is widget mode
  const isWidgetMode = widget === "true" && embedded === "true";

  let image;
  if (campaignValuesAsProps.coverMedia !== "") {
    if (
      campaignValuesAsProps.coverMedia.match(
        /youtube\.com|youtu\.be|vimeo\.com/i
      ) ||
      campaignValuesAsProps.coverMedia.includes("youtube.com/shorts/")
    ) {
      image = getThumbnailUrl(campaignValuesAsProps.coverMedia);
    } else {
      image = campaignValuesAsProps.coverMedia;
    }
  }

  return (
    <>
      <Head>
        <title>{isWidgetMode ? `${campaignValuesAsProps.title} - Widget` : campaignValuesAsProps.title}</title>
        <meta property="og:title" content={campaignValuesAsProps.title} />
        <meta
          property="og:description"
          content={campaignValuesAsProps.subTitle}
        />
        <meta property="og:image" content={image} />
        <meta property="og:image:secure_url" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${RANDOM_URL}${router.asPath}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={image} />
        <meta property="whatsapp:image" content={image} />
        {isWidgetMode && <meta name="robots" content="noindex, nofollow" />}
        {/* <link rel="icon" href={campaignValuesAsProps.thumbnailCoverImageUrl} /> */}
        {/* <link
          rel="shortcut icon"
          href={campaignValuesAsProps.thumbnailCoverImageUrl}
        /> */}
        <link
          rel="icon"
          href="https://madinah.s3.us-east-2.amazonaws.com/favicon.ico"
        />
        <link
          rel="shortcut icon"
          href="https://madinah.s3.us-east-2.amazonaws.com/favicon.ico"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://madinah.s3.us-east-2.amazonaws.com/test1.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://madinah.s3.us-east-2.amazonaws.com/test1.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://madinah.s3.us-east-2.amazonaws.com/test1.png"
        />
      </Head>
      <PageTransitionWrapper>
        <BoxComponent sx={{ minHeight: isWidgetMode ? "auto" : minHeight, width: "100%" }}>
          <ViewCampaignTemplate
            {...campaignValuesAsProps}
            utm_source={utm_source}
            utm_medium={utm_medium}
            utm_campaign={utm_campaign}
            utm_term={utm_term}
            utm_content={utm_content}
            referral={referral}
            fbclid={fbclid}
            src={src}
            previewMode={preview === "true"}
            randomToken={slug}
          />
        </BoxComponent>
      </PageTransitionWrapper>
    </>
  );
};

export default ViewCampaign;

export const getServerSideProps = async (context) => {
  const {
    slug,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referral,
    fbclid, // Add fbclid to extracted query parameters
    // src,
  } = context.query;

  const requestHeaders = context?.req?.headers;
  const cfCountry = requestHeaders?.["cf-ipcountry"]; // Retrieve CF-IPCountry
  const cfIp = context?.req?.headers["cf-connecting-ip"];
  const forwarded = context?.req?.headers["x-forwarded-for"];
  const token = context?.req?.cookies?.token;

  // Helper function to validate IPv4
  const getIPv4 = (ip) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ip) return null;
    // For x-forwarded-for, it can be a list. Take the first one.
    // For cf-connecting-ip, it's typically a single IP.
    const addresses = ip.split(/,\s*/);
    for (const addr of addresses) {
      if (ipv4Regex.test(addr)) {
        return addr;
      }
    }
    return null;
  };

  // Get IPv4 address
  let ip = null;
  if (cfIp) {
    ip = getIPv4(cfIp);
  }
  if (!ip && forwarded) {
    ip = getIPv4(forwarded); // Fallback to x-forwarded-for
  }
  if (!ip && context?.req?.socket?.remoteAddress) {
    // This will likely be a Cloudflare IP if cfIp and forwarded are missing or invalid, so it's a last resort
    ip = getIPv4(context.req.socket.remoteAddress);
  }
  if (!ip) {
    ip = "0.0.0.0"; // fallback IP if no valid IPv4 is found
  }
  try {
    // Use Promise.allSettled to prevent one API failure from blocking the page
    const [campaignResult, supportersResult] = await Promise.allSettled([
      getSingleCampaignData(
        slug,
        null,
        "",
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        referral,
        ip,
        token,
        // fbclid, // Pass fbclid to the API call if needed
        // src,
        cfCountry // Pass cfCountry to the API call
      ),
      getRecentSupporters(slug, 4, 0, ip), // Fetch supporters concurrently
    ]);

    // Handle campaign data
    let campaignDetails = null;
    if (campaignResult.status === "fulfilled") {
      campaignDetails = campaignResult.value?.data?.data.campaignDetails;
    } else {
      console.error("Failed to fetch campaign data:", campaignResult.reason);
      return { notFound: true };
    }

    if (!campaignDetails) {
      return { notFound: true };
    }

    // Handle supporters data (don't fail if supporters fail to load)
    let recentSupporters = [];
    if (supportersResult.status === "fulfilled") {
      recentSupporters =
        supportersResult.value?.data?.data?.recentSupporters || [];
    } else {
      console.error(
        "Failed to fetch supporters, continuing without:",
        supportersResult.reason
      );
    }

    if (!campaignDetails) {
      return {
        notFound: true,
      };
    }

    const {
      updatedAt,
      createdAt,
      videoLinks = [],
      coverImageUrl,
      status,
    } = campaignDetails;

    const whenPublished =
      updatedAt || createdAt ? formatTimestamp(updatedAt || createdAt) : "";

    const coverMedia = coverImageUrl || videoLinks[0]?.url || "";

    const campaignStatus =
      status === "pending-approval"
        ? "Pending"
        : status === "active"
          ? "Active"
          : "";

    const campaignValuesAsProps = {
      campaignId: campaignDetails._id,
      title: campaignDetails.title,
      subTitle: campaignDetails.subTitle,
      altTitle: campaignDetails?.altTitle || null,
      altSubTitle: campaignDetails?.altSubTitle || null,
      altStory: campaignDetails?.altStory || null,
      altCoverImageUrl: campaignDetails?.altCoverImageUrl || null,
      altVideoLinksUrl:
        campaignDetails?.altVideoLinks?.length > 0
          ? campaignDetails?.altVideoLinks[0]?.url
          : null,
      coverMedia,
      organizerPhoto:
        campaignDetails.campaignerId?.profileImage || DEFAULT_AVATAR,
      whenPublished,
      story: campaignDetails.story,
      categoryName: campaignDetails.categoryId?.name,
      creator: `${campaignDetails.campaignerId?.firstName} ${campaignDetails.campaignerId?.lastName}`,
      countryName: campaignDetails.countryId?.name,
      currency: campaignDetails.currencySymbol,
      initialGoal: campaignDetails.targetAmount,
      isEmailVerified: campaignDetails?.campaignerId?.isEmailVerified,
      url: RANDOM_URL + slug,
      status: campaignStatus,
      checkStatus: campaignDetails?.status,
      email: campaignDetails.campaignerId?.email,
      gradingLevelsList: campaignDetails.givingLevels,
      currencyConversionIdCampaign: campaignDetails.currencyConversionId
        ? campaignDetails.currencyConversionId
        : null,
      symbol: campaignDetails.currencySymbol,
      units: campaignDetails.amountCurrency,
      isoAlpha2: campaignDetails.countryId?.isoAlpha2,
      country: campaignDetails.countryId?.name,
      currencyCountry: campaignDetails.currencyCountry,
      recentSupporters: recentSupporters || [],
      isZakatEligible: campaignDetails.isZakatEligible,
      recurringDonation: campaignDetails.isRecurringDonation,
      oneTimeDonation: campaignDetails.isOneTimeDonation,
      isTaxDeductable: campaignDetails?.isTaxDeductable || null,
      meta: campaignDetails?.meta || [],
      recentSupportersCount: campaignDetails?.recentSupportersCount || 0,
      thumbnailCoverImageUrl: campaignDetails?.thumbnailCoverImageUrl || null,
      raisedPercentage:
        campaignDetails.collectedAmount / campaignDetails.targetAmount,
      campaignEndDate: campaignDetails?.endDate,
      announcements: campaignDetails?.announcements,
    };
    return {
      props: {
        campaignValuesAsProps,
        slug,
        fbclid: fbclid || null, // Add fbclid to returned props
        cfCountry: cfCountry || null, // Add cfCountry to returned props
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
        slug,
        fbclid: fbclid || null, // Also add to error case
        cfCountry: cfCountry || null, // Add cfCountry to error case too
      },
    };
  }
};
