import { isNecessaryOnlyMode, executeIfNotNecessaryOnly } from "./gdprConsent";

/**
 * Wrapper for Google Analytics tracking calls that respects GDPR consent
 * @param {string} action - The gtag action (e.g., 'event', 'config')
 * @param  {...any} args - Arguments to pass to gtag
 */
export const gtagWithConsent = (action, ...args) => {
  executeIfNotNecessaryOnly(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag(action, ...args);
    }
  });
};

/**
 * Wrapper for Facebook Pixel tracking calls that respects GDPR consent
 * @param {string} action - The fbq action (e.g., 'track', 'trackCustom')
 * @param  {...any} args - Arguments to pass to fbq
 */
export const fbqWithConsent = (action, ...args) => {
  executeIfNotNecessaryOnly(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq(action, ...args);
    }
  });
};

/**
 * Wrapper for PostHog tracking calls that respects GDPR consent
 * @param {string} method - The PostHog method (e.g., 'capture', 'identify')
 * @param  {...any} args - Arguments to pass to the PostHog method
 */
export const posthogWithConsent = (method, ...args) => {
  executeIfNotNecessaryOnly(() => {
    if (
      typeof window !== "undefined" &&
      window.posthog &&
      typeof window.posthog[method] === "function"
    ) {
      window.posthog[method](...args);
    }
  });
};

/**
 * Wrapper for ActiveCampaign tracking calls that respects GDPR consent
 * @param {string} action - The vgo action
 * @param  {...any} args - Arguments to pass to vgo
 */
export const vgoWithConsent = (action, ...args) => {
  executeIfNotNecessaryOnly(() => {
    if (typeof window !== "undefined" && window.vgo) {
      window.vgo(action, ...args);
    }
  });
};

/**
 * Check if tracking is allowed (not in necessary-only mode)
 * @returns {boolean}
 */
export const isTrackingAllowed = () => {
  return !isNecessaryOnlyMode();
};

/**
 * Generic wrapper for any tracking function that should respect GDPR consent
 * @param {Function} trackingFunction - The tracking function to execute
 * @param  {...any} args - Arguments to pass to the tracking function
 */
export const executeTrackingWithConsent = (trackingFunction, ...args) => {
  executeIfNotNecessaryOnly(() => {
    if (typeof trackingFunction === "function") {
      trackingFunction(...args);
    }
  });
};

/**
 * Stop all tracking and clear tracking cookies
 * This is a more aggressive version for manual cleanup
 */
export const stopAndClearAllTracking = () => {
  if (typeof window === "undefined") return;

  // Disable all tracking services
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  if (window.fbq) {
    window.fbq("consent", "revoke");
  }

  if (window.posthog) {
    window.posthog.opt_out_capturing();
  }

  if (window.vgo) {
    window.vgo("setTrackByDefault", false);
  }

  // Clear tracking cookies
  const trackingCookiePatterns = ["_ga", "_gid", "_gat", "_fbp", "_fbc"];

  trackingCookiePatterns.forEach((pattern) => {
    const cookies = document.cookie
      .split(";")
      .filter((cookie) => cookie.trim().startsWith(pattern));

    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      // Clear for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      // Clear for parent domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      // Clear without domain (fallback)
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  });

  // Dispatch event for other components
  window.dispatchEvent(
    new CustomEvent("allTrackingStopped", {
      detail: { timestamp: new Date().toISOString() },
    })
  );
};
