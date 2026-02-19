/**
 * USAGE EXAMPLES FOR ENHANCED POSTHOG HELPER
 *
 * This file shows how to use the enhanced PostHog helper that includes
 * reliable country and continent information from Cloudflare geolocation.
 */

// Import the enhanced helper
import {
  getEnhancedPosthogProperties,
  enhancedHandlePosthog,
} from "./posthogHelper";
import { handlePosthog } from "@/api/post-api-services";

// Example 1: Get enhanced properties directly
function trackPageView(pageTitle) {
  const enhancedProps = getEnhancedPosthogProperties(pageTitle);

  console.log("Enhanced properties include:");
  console.log("Country:", enhancedProps.$country_name); // e.g., "United States"
  console.log("Continent:", enhancedProps.$continent_name); // e.g., "North America"
  console.log("Country Code:", enhancedProps.$country_code); // e.g., "US"

  // Use with your existing PostHog tracking
  const payload = {
    distinctId: "user-id",
    event: "Page View",
    properties: {
      $current_url: window.location.href,
      ...enhancedProps, // This includes all the enhanced geolocation data
    },
  };

  handlePosthog(payload);
}

// Example 2: Use the wrapper function (easier approach)
function trackWithEnhancedWrapper() {
  const basePayload = {
    distinctId: "user-id",
    event: "Campaign Landing Page",
    properties: {
      $current_url: window.location.href,
      campaign_id: "123",
    },
  };

  // This automatically adds enhanced properties
  enhancedHandlePosthog(handlePosthog, basePayload, "Campaign Page Title");
}

// Example 3: Conditional usage based on data availability
function trackEvent() {
  const enhancedProps = getEnhancedPosthogProperties();

  // Check if we have reliable geolocation data
  if (enhancedProps.$country_name && enhancedProps.$continent_name) {
    console.log(
      `User is from ${enhancedProps.$country_name}, ${enhancedProps.$continent_name}`
    );

    // Track with geographic context
    const payload = {
      distinctId: "user-id",
      event: "User Action",
      properties: {
        action_type: "button_click",
        geographic_region: enhancedProps.$continent_name,
        country: enhancedProps.$country_name,
        ...enhancedProps,
      },
    };

    handlePosthog(payload);
  } else {
    console.log("No reliable geolocation data available");
    // Track without geographic data
    const payload = {
      distinctId: "user-id",
      event: "User Action",
      properties: {
        action_type: "button_click",
      },
    };

    handlePosthog(payload);
  }
}

/**
 * DATA SOURCES PRIORITY:
 *
 * 1. Cloudflare CF-IPCountry header (most reliable)
 *    - Captured in getServerSideProps on page load
 *    - Saved to localStorage as 'cfCountry'
 *    - Mapped to country name and continent using our mapping
 *
 * 2. PostHog built-in geolocation (fallback)
 *    - May be empty or unreliable
 *    - Used only when Cloudflare data is not available
 *
 * 3. Empty values (when no data is available)
 *    - Better to have empty values than incorrect data
 */

export { trackPageView, trackWithEnhancedWrapper, trackEvent };
