"use client";

import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { getVisits } from "@/api/get-api-services";

/**
 * CampaignVisitTracker - Client component that fires the getVisits API
 * on campaign page load.
 *
 * This was previously handled inside ViewCampaignTemplate, but after the
 * page was refactored to a static-shell + dynamic-content pattern,
 * ViewCampaignTemplate is no longer rendered in the normal (non-widget) flow.
 */
export default function CampaignVisitTracker({
  randomToken,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content,
  referral,
  src,
  previewMode,
  gtmId,
}) {
  useEffect(() => {
    const initVisits = async () => {
      if (previewMode) return;

      try {
        const experimentKey = localStorage.getItem("experimentKey");
        const variationKey = localStorage.getItem("variationKey");
        const userId = localStorage.getItem("gb_visitor_id");
        const experimentalFeature = getCookie("abtesting");
        const campaignVersion = getCookie("campaign_testing");

        await getVisits(
          randomToken,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
          referral,
          experimentalFeature,
          src,
          campaignVersion,
          experimentKey,
          variationKey,
          userId,
        );
      } catch (error) {
        console.error("Error tracking campaign visit:", error);
      }
    };

    initVisits();
  }, [
    previewMode,
    randomToken,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referral,
    src,
    gtmId,
  ]);

  // Load campaign-specific Google tag (Ads/GA4 measurement ID) if provided
  useEffect(() => {
    const globalGtmId = process.env.NEXT_PUBLIC_GTM_ID;
    const globalGaId = process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID;
    const globalAdId = process.env.NEXT_PUBLIC_GOOGLE_AD;
    
    // Don't inject if it's the same as any global ID
    if (
      gtmId &&
      gtmId !== globalGtmId &&
      gtmId !== globalGaId &&
      gtmId !== globalAdId &&
      !window[`__gtagConfigured_${gtmId}`]
    ) {
      window[`__gtagConfigured_${gtmId}`] = true;

      // Ensure gtag is available (it's loaded by ClientScripts.jsx)
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
      }

      // Load the gtag.js script for this measurement/conversion ID
      const gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
      gtagScript.onerror = () => {
        console.error(`Failed to load Google tag for: ${gtmId}`);
      };
      document.head.appendChild(gtagScript);

      // Configure the tag
      window.gtag("config", gtmId, { send_page_view: true });
    }
  }, [gtmId]);

  // This component renders nothing — it only fires the visit API
  return null;
}
