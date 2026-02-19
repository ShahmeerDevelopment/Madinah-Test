import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

const CONSENT_COOKIE_NAME = "gdpr_consent";

/**
 * Hook for managing GDPR consent and controlling tracking behavior
 *
 * When "Necessary Only" mode is active (analytics: false, marketing: false, functional: false):
 * - All tracking services are disabled (Google Analytics, Facebook Pixel, PostHog, ActiveCampaign)
 * - Existing tracking cookies are cleared
 * - Tracking consent APIs are set to "denied" state
 * - A "trackingStopped" event is dispatched for other components to listen
 *
 * This ensures full compliance with GDPR when users choose minimal cookie usage.
 */
export const useGdprConsent = () => {
  const [consent, setConsent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConsent = () => {
      const consentCookie = getCookie(CONSENT_COOKIE_NAME);
      if (consentCookie) {
        try {
          const parsedConsent = JSON.parse(consentCookie);
          setConsent(parsedConsent);
        } catch (error) {
          console.error("Error parsing GDPR consent cookie:", error);
          setConsent(null);
        }
      } else {
        setConsent(null);
      }
      setIsLoading(false);
    };

    checkConsent();

    // Listen for consent updates
    const handleConsentUpdate = (event) => {
      setConsent(event.detail);
    };

    window.addEventListener("gdprConsentUpdated", handleConsentUpdate);

    return () => {
      window.removeEventListener("gdprConsentUpdated", handleConsentUpdate);
    };
  }, []);

  const hasConsent = (category) => {
    if (!consent) return false;
    return consent[category] === true;
  };

  const hasAnalyticsConsent = () => hasConsent("analytics");
  const hasMarketingConsent = () => hasConsent("marketing");
  const hasFunctionalConsent = () => hasConsent("functional");
  const hasNecessaryConsent = () => hasConsent("necessary");

  // Check if only necessary cookies are allowed (all other categories are false)
  const isNecessaryOnlyMode = () => {
    if (!consent) return false;
    return (
      consent.necessary === true &&
      consent.analytics === false &&
      consent.marketing === false &&
      consent.functional === false
    );
  };

  // Disable all tracking when only necessary cookies are allowed
  const stopAllTracking = () => {
    if (typeof window === "undefined") return;

    // Disable Google Analytics
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }

    // Disable Facebook Pixel
    if (window.fbq) {
      window.fbq("consent", "revoke");
    }

    // Disable PostHog
    if (window.posthog) {
      window.posthog.opt_out_capturing();
      // Reset PostHog instance to ensure it can be re-initialized later
      window.posthog.reset();
    }

    // Disable ActiveCampaign tracking
    if (window.vgo) {
      window.vgo("setTrackByDefault", false);
    }

    // Clear any existing tracking data
    try {
      // Clear Google Analytics cookies
      const gaCookies = document.cookie
        .split(";")
        .filter(
          (cookie) =>
            cookie.trim().startsWith("_ga") ||
            cookie.trim().startsWith("_gid") ||
            cookie.trim().startsWith("_gat")
        );
      gaCookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      });

      // Clear Facebook tracking cookies
      const fbCookies = document.cookie
        .split(";")
        .filter(
          (cookie) =>
            cookie.trim().startsWith("_fbp") || cookie.trim().startsWith("_fbc")
        );
      fbCookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      });
    } catch (error) {
      console.warn("Error clearing tracking cookies:", error);
    }

    // Dispatch event to notify other components
    window.dispatchEvent(
      new CustomEvent("trackingStopped", {
        detail: { reason: "necessary_only_mode" },
      })
    );
  };

  return {
    consent,
    isLoading,
    hasConsent,
    hasAnalyticsConsent,
    hasMarketingConsent,
    hasFunctionalConsent,
    hasNecessaryConsent,
    isNecessaryOnlyMode,
    stopAllTracking,
  };
};

export default useGdprConsent;
