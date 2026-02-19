/**
 * PostHog Helper - Simplified
 *
 * PostHog automatically captures the following properties server-side:
 * - $browser, $browser_version
 * - $device_type, $os, $os_version
 * - $current_url, $pathname, $referrer
 * - $screen_height, $screen_width, $viewport_height, $viewport_width
 * - $geoip_country_name, $geoip_country_code, $geoip_city_name, $geoip_continent_name, etc.
 * - $session_id, $distinct_id
 *
 * This helper only adds custom properties that PostHog doesn't auto-capture.
 * All device/browser/geo info is handled automatically by PostHog.
 */

/**
 * Get custom properties that aren't auto-captured by PostHog
 * @param {string} pageTitle - The title of the current page (optional)
 * @returns {Object} Custom properties object
 */
export const getCustomPosthogProperties = (pageTitle = "") => {
  if (typeof window === "undefined") return {};

  const properties = {};

  // Add page title if provided (PostHog captures $title but we may want custom naming)
  if (pageTitle) {
    properties.page_title = pageTitle;
  }

  return properties;
};

/**
 * Enhanced handlePosthog wrapper - simplified to rely on PostHog auto-capture
 * @param {Function} handlePosthogFunction - Deprecated, no longer used
 * @param {Object} basePayload - Base payload object with event name and properties
 * @param {string} pageTitle - Optional page title
 * @returns {void}
 *
 * @description
 * This function sends events directly to PostHog via posthog-js.
 * Device info, browser, country, etc. are automatically captured by PostHog server-side.
 * Only custom properties specific to your app need to be passed.
 */
export const enhancedHandlePosthog = (
  handlePosthogFunction,
  basePayload,
  pageTitle = ""
) => {
  if (typeof window === "undefined") return;

  try {
    const posthog = require("posthog-js").default;

    // Check if PostHog is initialized
    if (!posthog || !posthog.__loaded) {
      console.warn("PostHog not initialized, skipping event capture");
      return;
    }

    // Respect GDPR consent
    if (posthog.has_opted_out_capturing && posthog.has_opted_out_capturing()) {
      console.debug("PostHog capturing is opted out, skipping event");
      return;
    }

    const customProperties = getCustomPosthogProperties(pageTitle);

    // Only include custom properties + original properties
    // PostHog auto-captures device, browser, geo, etc. server-side
    const mergedProperties = {
      ...customProperties,
      ...basePayload.properties,
    };
    console.log("Enhanced PostHog Properties:", mergedProperties);
    posthog.capture(basePayload.event, mergedProperties);
  } catch (error) {
    console.warn("Failed to capture PostHog event:", error);
  }
};

/**
 * Direct PostHog capture function
 * Use this for new implementations instead of enhancedHandlePosthog
 *
 * @param {string} eventName - The name of the event to capture
 * @param {Object} properties - Custom event properties (don't include device/browser/geo - auto-captured)
 * @param {string} pageTitle - Optional page title
 * @returns {void}
 *
 * @example
 * // Simple event
 * capturePosthogEvent("button_clicked", { button_name: "donate" });
 *
 * // Event with custom properties
 * capturePosthogEvent("donation_completed", {
 *   amount: 100,
 *   currency: "USD",
 *   campaign_id: "abc123"
 * });
 */
export const capturePosthogEvent = (
  eventName,
  properties = {},
  pageTitle = ""
) => {
  if (typeof window === "undefined") return;

  try {
    const posthog = require("posthog-js").default;

    // Check if PostHog is initialized
    if (!posthog || !posthog.__loaded) {
      console.warn("PostHog not initialized, skipping event capture");
      return;
    }

    // Respect GDPR consent
    if (posthog.has_opted_out_capturing && posthog.has_opted_out_capturing()) {
      console.debug("PostHog capturing is opted out, skipping event");
      return;
    }

    const customProperties = getCustomPosthogProperties(pageTitle);

    // Merge custom properties with provided properties
    // PostHog auto-captures device, browser, geo, etc.
    const mergedProperties = {
      ...customProperties,
      ...properties,
    };

    posthog.capture(eventName, mergedProperties);
  } catch (error) {
    console.warn("Failed to capture PostHog event:", error);
  }
};

// ============================================================================
// DEPRECATED - Keeping for reference, will be removed in future version
// ============================================================================

/**
 * @deprecated Use getCustomPosthogProperties instead.
 * PostHog now auto-captures browser, device, and geo properties server-side.
 */
export const getEnhancedPosthogProperties = (pageTitle = "") => {
  console.warn(
    "[DEPRECATED] getEnhancedPosthogProperties is deprecated. " +
      "PostHog auto-captures device/browser/geo info. Use getCustomPosthogProperties instead."
  );
  return getCustomPosthogProperties(pageTitle);
};

