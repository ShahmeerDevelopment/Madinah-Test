/**
 * GDPR Compliance - Necessary Only Mode Implementation
 *
 * This file demonstrates how tracking is stopped when users select "Necessary Only" cookies.
 *
 * ## What happens when "Necessary Only" is selected:
 *
 * 1. **Consent State**:
 *    - necessary: true
 *    - analytics: false
 *    - marketing: false
 *    - functional: false
 *
 * 2. **Tracking Services Disabled**:
 *    - Google Analytics (gtag consent set to "denied")
 *    - Facebook Pixel (fbq consent revoked)
 *    - PostHog (opt_out_capturing called)
 *    - ActiveCampaign (setTrackByDefault set to false)
 *
 * 3. **Tracking Cookies Cleared**:
 *    - Google Analytics cookies (_ga, _gid, _gat)
 *    - Facebook tracking cookies (_fbp, _fbc)
 *
 * 4. **Components Updated**:
 *    - useGdprConsent hook provides isNecessaryOnlyMode() method
 *    - ConditionalAnalytics component calls stopAllTracking()
 *    - Tracking wrapper functions prevent execution
 *
 * ## Usage Examples:
 *
 * ```javascript
 * import { useGdprConsent } from '@/hooks/useGdprConsent';
 * import { fbqWithConsent, gtagWithConsent } from '@/utils/trackingPreventionUtils';
 *
 * // In a component
 * const { isNecessaryOnlyMode, stopAllTracking } = useGdprConsent();
 *
 * // Check if only necessary cookies are allowed
 * if (isNecessaryOnlyMode()) {
 *   console.log("Only necessary cookies are active");
 * }
 *
 * // Safe tracking calls that respect consent
 * fbqWithConsent('track', 'PageView');
 * gtagWithConsent('event', 'page_view', { page_title: 'Home' });
 * ```
 *
 * ## Events Dispatched:
 * - "trackingStopped" - when tracking is disabled due to necessary-only mode
 * - "gdprConsentUpdated" - when consent preferences change
 * - "allTrackingStopped" - when manual cleanup is performed
 *
 * ## Files Modified:
 * - src/hooks/useGdprConsent.js - Added isNecessaryOnlyMode() and stopAllTracking()
 * - src/components/UI/ConditionalAnalytics/ConditionalAnalytics.jsx - Enhanced to stop tracking in necessary-only mode
 * - src/components/UI/GdprBanner/GdprBanner.jsx - Enhanced cookie clearing for necessary-only selection
 * - src/utils/trackingPreventionUtils.js - New utility functions for consent-aware tracking
 * - src/utils/gdprConsent.js - Added isNecessaryOnlyMode() helper function
 * - src/hooks/useActiveCampaignTracking.js - Made ActiveCampaign respect GDPR consent
 * - Various tracking components updated to use consent-aware wrappers
 */

// This file serves as documentation and is not imported anywhere
