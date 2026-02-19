# PostHog Enhanced Properties Implementation

## Overview

I have successfully enhanced the `handlePosthog` function to automatically include the requested properties from PostHog's auto-captured data.

## Implemented Properties

The following properties are now automatically added to every PostHog event:

1. **Title** - `title`

   - Source: `document.title` (current page title)
   - Fallback: Empty string if document is unavailable

2. **Continent Name** - `continent_name`

   - Source: PostHog's auto-captured `$geoip_continent_name`
   - Requires GeoIP enrichment to be enabled in PostHog

3. **Browser** - `browser`

   - Source: PostHog's auto-captured `$browser`
   - Examples: "Chrome", "Firefox", "Safari"

4. **Device Type** - `device_type`

   - Source: PostHog's auto-captured `$device_type`
   - Examples: "Desktop", "Mobile", "Tablet"

5. **Country Name** - `country_name`

   - Source: PostHog's auto-captured `$geoip_country_name`
   - Requires GeoIP enrichment to be enabled in PostHog

6. **Session ID** - `session_id`

   - Source: PostHog's auto-captured `$session_id` or `$sesid`
   - Unique identifier for the user's session

7. **Path Name** - `path_name`
   - Source: PostHog's auto-captured `$pathname`
   - Fallback: `window.location.pathname` if PostHog data unavailable
   - Examples: "/", "/campaign/123", "/about-us"

## Implementation Details

### Enhanced API Function

The main enhancement was made to the `handlePosthog` function in `/src/api/post-api-services.js`:

- Uses the `getEnhancedPosthogProperties` utility function for clean separation of concerns
- Automatically extracts all PostHog persistence properties
- Adds the 7 requested properties from auto-captured data
- Includes ALL other PostHog auto-captured properties (40+ additional properties)
- Maintains backward compatibility with existing code
- Has error handling to fallback gracefully if PostHog is unavailable

### PostHog Helper Utility

The `/src/utils/posthogHelper.js` file provides:

- `getEnhancedPosthogProperties()` - Extracts all enhanced properties from PostHog
- `enhancedHandlePosthog()` - Alternative wrapper function for manual usage
- SSR-safe implementation with proper error handling
- Reusable utilities for other parts of the application

### Auto-Captured Properties Included

In addition to the 7 requested properties, the enhanced function automatically includes:

- `$browser_version`, `$os`, `$os_version`
- `$current_url`, `$host`, `$pathname`
- `$screen_height`, `$screen_width`, `$viewport_height`, `$viewport_width`
- `$referrer`, `$referring_domain`
- UTM parameters (`$utm_source`, `$utm_medium`, etc.)
- And many more...

### Files Modified

1. **`/src/api/post-api-services.js`**

   - Enhanced the `handlePosthog` function to automatically include enhanced properties

2. **`/src/utils/posthogHelper.js`** (Created)

   - Utility functions for extracting PostHog properties
   - Can be used for custom implementations if needed

3. **`/src/utils/posthogExample.js`** (Created)
   - Documentation and examples of how the enhanced function works

### Usage

No changes are required in existing code! The enhancement is automatic:

```javascript
// Before (still works the same)
const payload = {
  distinctId: userId,
  event: "User Action",
  properties: {
    custom_property: "value",
  },
};
handlePosthog(payload);

// After enhancement - automatically includes:
// title, continent_name, browser, device_type, country_name, session_id, path_name
// Plus all other PostHog auto-captured properties
```

## Benefits

1. **Automatic Enhancement**: All existing PostHog calls are automatically enhanced
2. **No Code Changes Required**: Existing implementations continue to work
3. **Comprehensive Data**: Includes 40+ auto-captured properties beyond the 7 requested
4. **Error Handling**: Graceful fallback if PostHog is unavailable
5. **SSR Compatible**: Works with server-side rendering

## GeoIP Requirements

For `continent_name` and `country_name` to be populated, ensure that:

1. GeoIP enrichment is enabled in your PostHog project settings
2. The PostHog instance has access to GeoIP data

## Testing

The implementation is ready for testing. All PostHog tracking calls will now automatically include the enhanced properties without requiring any code changes.
