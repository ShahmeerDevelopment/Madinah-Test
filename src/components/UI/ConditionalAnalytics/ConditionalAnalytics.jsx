"use client";

import { useEffect, useRef } from "react";
import { useGdprConsent } from "@/hooks/useGdprConsent";
import posthog from "posthog-js";
import { isInEurope } from "@/utils/gdprConsent";

const ConditionalAnalytics = ({ children }) => {
  const {
    hasAnalyticsConsent,
    hasMarketingConsent,
    isLoading,
    isNecessaryOnlyMode,
    stopAllTracking,
  } = useGdprConsent();
  const posthogInitialized = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    const userInEurope = isInEurope();

    // If not in Europe, grant all consent by default
    if (!userInEurope) {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
        });
      }
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("consent", "grant");
      }
      if (typeof window !== "undefined" && window.posthog) {
        window.posthog.opt_in_capturing();
      }
      return;
    }
    // If only necessary cookies are allowed, stop all tracking
    if (isNecessaryOnlyMode()) {
      stopAllTracking();
      // Reset PostHog initialization flag when tracking is stopped
      posthogInitialized.current = false;
      return;
    }

    // Handle PostHog initialization and consent
    if (typeof window !== "undefined") {
      if (hasAnalyticsConsent()) {
        // Initialize PostHog only once when analytics consent is granted
        if (!posthogInitialized.current && !window.posthog) {
          // Build the full api_host URL using current origin
          const apiHost = `${window.location.origin}/ph`;

          posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            // Use rewrites proxy path - full URL required for Firefox/Brave compatibility
            api_host: apiHost,
            // UI host must point to PostHog's actual domain for toolbar functionality
            ui_host: "https://us.posthog.com",
            session_recording: {
              recordCanvas: true, // optional: for canvas-based apps
            },
            // Use localStorage instead of cookies for better privacy
            persistence: "localStorage",
            loaded: (posthog) => {
              if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
            },
          });
          posthogInitialized.current = true;
        }

        // Opt in to capturing if PostHog is available
        if (window.posthog) {
          window.posthog.opt_in_capturing();
        }
      } else {
        // Opt out of capturing if PostHog is available but no analytics consent
        if (window.posthog) {
          window.posthog.opt_out_capturing();
        }
      }
    }

    // Handle Google Analytics consent
    if (typeof window !== "undefined" && window.gtag) {
      if (hasAnalyticsConsent()) {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: hasMarketingConsent() ? "granted" : "denied",
        });
      } else {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
        });
      }
    }

    // Handle Facebook Pixel consent
    if (typeof window !== "undefined" && window.fbq) {
      if (hasMarketingConsent()) {
        window.fbq("consent", "grant");
      } else {
        window.fbq("consent", "revoke");
      }
    }
  }, [
    hasAnalyticsConsent,
    hasMarketingConsent,
    isLoading,
    isNecessaryOnlyMode,
    stopAllTracking,
  ]);

  return children;
};

export default ConditionalAnalytics;
