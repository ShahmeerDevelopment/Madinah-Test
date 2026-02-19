"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCookie, setCookie } from "cookies-next";

import { generateRandomToken } from "@/utils/helpers";
import { isLoginModalOpen } from "@/store/slices/authSlice";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { handlePosthog } from "@/api/post-api-services";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
import { getAllVisits } from "@/api/get-api-services";

// Helper to get unix timestamp (replaces dayjs().unix())
const getUnixTimestamp = () => Math.floor(Date.now() / 1000);

// Helper to run non-critical tasks when browser is idle
const runWhenIdle = (callback) => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    requestIdleCallback(callback, { timeout: 2000 });
  } else {
    // Fallback for Safari - use setTimeout with delay
    setTimeout(callback, 100);
  }
};

export default function HomeInit() {
  const dispatch = useDispatch();
  useEffect(() => {
    // Critical cookie initialization - run immediately
    // These are needed for functionality
    if (!getCookie("externalId")) {
      const externalId = generateRandomToken("a", 5) + getUnixTimestamp();
      setCookie("externalId", externalId);
    }

    if (!getCookie("abtesting")) {
      setCookie("abtesting", "donation_version_1");
    }

    if (!getCookie("distinctId")) {
      const distinctId = generateRandomToken("d", 5) + getUnixTimestamp();
      setCookie("distinctId", distinctId);
    }

    // Preserve existing behavior: show login modal after redirect
    const shouldShowLoginModal = localStorage.getItem(
      "showLoginModalAfterRedirect"
    );
    if (shouldShowLoginModal === "true") {
      localStorage.removeItem("showLoginModalAfterRedirect");
      setTimeout(() => {
        dispatch(isLoginModalOpen(true));
      }, 1000);
    }

    // NON-CRITICAL: Defer analytics and tracking until browser is idle
    // This improves TBT (Total Blocking Time) by not running during initial paint
    runWhenIdle(() => {
      // UTM + referral tracking (non-critical)
      try {
        const url = new URL(window.location.href);
        const utmSource = url.searchParams.get("utm_source");
        const utmMedium = url.searchParams.get("utm_medium");
        const utmCampaign = url.searchParams.get("utm_campaign");
        const utmTerm = url.searchParams.get("utm_term");
        const utmContent = url.searchParams.get("utm_content");
        const referral = url.searchParams.get("ref");
        getAllVisits(
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          referral
        );
      } catch {
        // ignore
      }

      // PostHog homepage event (non-critical analytics)
      const consentCookie = getCookie(CONSENT_COOKIE_NAME);
      let parsedConsent = {};
      if (consentCookie) {
        try {
          parsedConsent = JSON.parse(consentCookie);
        } catch {
          parsedConsent = {};
        }
      }

      const userId = getCookie("distinctId");
      const payload = {
        distinctId: userId,
        event: "Homepage Visit",
        properties: {
          $current_url: "https://www.madinah.com",
        },
      };

      if (parsedConsent?.analytics) {
        enhancedHandlePosthog(handlePosthog, payload, "Madinah - Homepage");
      }
    });
  }, [dispatch]);

  return null;
}
