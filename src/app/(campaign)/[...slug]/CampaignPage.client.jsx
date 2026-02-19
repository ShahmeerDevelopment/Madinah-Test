"use client";

import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getCookie } from "cookies-next";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ViewCampaignTemplate from "@/components/templates/ViewCampaignTemplate";
import PageTransitionWrapper from "@/components/atoms/PageTransitionWrapper";

import { setUtmParams } from "@/store/slices/utmSlice";
import { announcementTokenHandler } from "@/store/slices/donationSlice";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { getUTMParams } from "@/utils/helpers";
import { handlePosthog } from "@/api/post-api-services";
import { executeAnalyticsWithConsent } from "@/utils/gdprConsent";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
import { useInjectDonationSlices } from "@/hooks/useInjectReducers";

export const minHeight = "calc(100% - 104px - 32px - 44px)";

export default function CampaignPage({
  campaignValuesAsProps,
  slug,
  cfCountry,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content,
  referral,
  fbclid,
  src,
  widget,
  embedded,
  preview,
  announcementToken,
  gtmId,
}) {
  // Inject donation flow slices for campaign donation functionality
  useInjectDonationSlices();

  const dispatch = useDispatch();

  // Scroll to top when campaign page loads - cover all possible scroll containers
  useEffect(() => {
    // Scroll window
    window.scrollTo({ top: 0, behavior: "instant" });

    // Scroll document body and html element (in case they have scroll)
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  const parsedConsent = useMemo(() => {
    if (consentCookie) {
      try {
        return JSON.parse(consentCookie);
      } catch {
        return {};
      }
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
    ],
  );

  // Set UTM params in Redux store
  useEffect(() => {
    dispatch(setUtmParams(utmParams));
  }, [dispatch, utmParams]);

  // Block back navigation to donation page after user clicked "Not Today"
  useEffect(() => {
    const skipFlag = sessionStorage.getItem("__skipDonationPage");

    if (skipFlag === "true") {
      // DO NOT clear the sessionStorage flags here - keep them so if user
      // somehow navigates to donation page, they get redirected back
      // Flags will only be cleared when user clicks donate button again

      // Set a global flag that can be checked/cleared dynamically
      window.__blockBackToDonation = true;

      // Push a new history state to "absorb" back button presses
      window.history.pushState({ fromDonation: true, blockBack: true }, "");

      let hasBlocked = false;

      const handlePopState = (event) => {
        // Check the global flag - it can be cleared by donate button clicks
        if (window.__blockBackToDonation && !hasBlocked) {
          // If user tries to go back, push state once to prevent navigation
          window.history.pushState({ fromDonation: true, blockBack: true }, "");
          hasBlocked = true;

          // After blocking once, remove the handler so subsequent backs work normally
          setTimeout(() => {
            window.removeEventListener("popstate", handlePopState);
            window.__blockBackToDonation = false;
          }, 100);
        }
      };

      window.addEventListener("popstate", handlePopState);

      // Clean up after 10 seconds - enough time for user interaction
      const cleanup = setTimeout(() => {
        window.removeEventListener("popstate", handlePopState);
        window.__blockBackToDonation = false;
        // Clear flags after timeout
        sessionStorage.removeItem("__skipDonationPage");
        sessionStorage.removeItem("__skipDonationPageTarget");
      }, 10000);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        clearTimeout(cleanup);
      };
    }
  }, []);

  // PostHog tracking
  useEffect(() => {
    const referrer = typeof document !== "undefined" ? document.referrer : "";
    const userId = getCookie("distinctId");
    const urlUtmParams =
      typeof window !== "undefined" ? getUTMParams(window.location.href) : {};

    const trackPageView = (eventName, properties) => {
      executeAnalyticsWithConsent(() => {
        const payload = {
          distinctId: userId,
          event: eventName,
          properties: {
            $current_url:
              typeof window !== "undefined" ? window.location.href : "",
            ...properties,
            ...urlUtmParams,
          },
        };
        if (parsedConsent?.analytics) {
          enhancedHandlePosthog(
            handlePosthog,
            payload,
            campaignValuesAsProps?.title || "Campaign Page",
          );
        }
      });
    };

    if (referrer) {
      trackPageView("Campaign Landing Page (Referrer Visit)");
    } else if (
      utm_source ||
      utm_medium ||
      utm_campaign ||
      utm_term ||
      utm_content
    ) {
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
  }, [
    src,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    parsedConsent,
    campaignValuesAsProps?.title,
  ]);

  // Handle announcement token and cfCountry storage
  useEffect(() => {
    dispatch(announcementTokenHandler(announcementToken));

    // Save cfCountry to localStorage if available
    if (cfCountry && typeof window !== "undefined") {
      localStorage.setItem("cfCountry", cfCountry);
    }

    // Execute meta scripts from campaign
    if (campaignValuesAsProps?.meta && campaignValuesAsProps.meta.length > 0) {
      campaignValuesAsProps.meta.forEach((metaItem) => {
        if (metaItem.type === "viewPageScript") {
          try {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.text = metaItem.value;
            document.head.appendChild(script);
            document.head.removeChild(script);
          } catch (error) {
            console.error("Error executing script from meta:", error);
          }
        }
      });
    }

    // Load campaign-specific Google tag (Ads/GA4 measurement ID) if provided
    const globalGtmId = process.env.NEXT_PUBLIC_GTM_ID;
    const globalGaId = process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID;
    const globalAdId = process.env.NEXT_PUBLIC_GOOGLE_AD;
    
    if (
      gtmId &&
      gtmId !== globalGtmId &&
      gtmId !== globalGaId &&
      gtmId !== globalAdId &&
      !window[`__gtagConfigured_${gtmId}`]
    ) {
      window[`__gtagConfigured_${gtmId}`] = true;

      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
      }

      const gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
      gtagScript.onerror = () => {
        console.error(`Failed to load Google tag for: ${gtmId}`);
      };
      document.head.appendChild(gtagScript);

      window.gtag("config", gtmId, { send_page_view: true });
    }
  }, [campaignValuesAsProps, announcementToken, cfCountry, dispatch, gtmId]);

  // Check if this is widget mode
  const isWidgetMode = widget === "true" && embedded === "true";

  return (
    <PageTransitionWrapper>
      <BoxComponent
        sx={{ minHeight: isWidgetMode ? "auto" : minHeight, width: "100%" }}
      >
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
  );
}
