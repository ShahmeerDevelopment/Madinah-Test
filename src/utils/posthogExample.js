/**
 * Example of how the enhanced handlePosthog function works
 *
 * This file demonstrates how the handlePosthog function now automatically
 * includes the requested properties from PostHog's auto-captured data:
 *
 * - Title (from document.title)
 * - Continent name (from PostHog's GeoIP data)
 * - Browser (auto-captured by PostHog)
 * - Device type (auto-captured by PostHog)
 * - Country name (from PostHog's GeoIP data)
 * - Session ID (from PostHog's session tracking)
 * - Path name (from PostHog's auto-captured pathname)
 */

import { handlePosthog } from "@/api/post-api-services";
import { getCookie } from "cookies-next";

// Example usage - the enhanced properties are automatically added
const trackUserAction = () => {
  const userId = getCookie("distinctId");

  // Simple payload - the handlePosthog function will automatically add:
  // title, continent_name, browser, device_type, country_name, session_id, path_name
  const payload = {
    distinctId: userId,
    event: "User Action",
    properties: {
      action_type: "button_click",
      page_section: "header",
      // All enhanced properties will be automatically added here
    },
  };

  handlePosthog(payload);
};

/**
 * What gets sent to the API after enhancement:
 * {
 *   distinctId: "user123",
 *   event: "User Action",
 *   properties: {
 *     // Original properties
 *     action_type: "button_click",
 *     page_section: "header",
 *
 *     // Auto-added enhanced properties
 *     title: "Homepage - Madinah",
 *     continent_name: "North America",
 *     browser: "Chrome",
 *     device_type: "Desktop",
 *     country_name: "United States",
 *     session_id: "session123",
 *     path_name: "/",
 *
 *     // Plus all other PostHog auto-captured properties
 *     $current_url: "https://www.madinah.com",
 *     $browser_version: "120",
 *     $os: "Mac OS X",
 *     $screen_height: 1080,
 *     $screen_width: 1920,
 *     // ... and many more auto-captured properties
 *   }
 * }
 */

export { trackUserAction };
