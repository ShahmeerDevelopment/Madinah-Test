import { getCookie } from "cookies-next";
import { getGeolocationData } from "./countryToContinent";

const CONSENT_COOKIE_NAME = "gdpr_consent";

/**
 * Check if user has given consent for a specific category
 * @param {string} category - The consent category ('analytics', 'marketing', 'functional', 'necessary')
 * @returns {boolean} - Whether consent has been given for the category
 */
export const hasGdprConsent = (category) => {
  try {
    const consentCookie = getCookie(CONSENT_COOKIE_NAME);
    if (!consentCookie) return false;

    const consent = JSON.parse(consentCookie);
    return consent[category] === true;
  } catch (error) {
    console.error("Error parsing GDPR consent:", error);
    return false;
  }
};

/**
 * Get the full consent object
 * @returns {object|null} - The consent object or null if not found
 */
export const getGdprConsent = () => {
  try {
    const consentCookie = getCookie(CONSENT_COOKIE_NAME);
    if (!consentCookie) return null;

    return JSON.parse(consentCookie);
  } catch (error) {
    console.error("Error parsing GDPR consent:", error);
    return null;
  }
};

/**
 * Check if user has given consent for analytics tracking
 * @returns {boolean}
 */
export const hasAnalyticsConsent = () => hasGdprConsent("analytics");

/**
 * Check if user has given consent for marketing tracking
 * @returns {boolean}
 */
export const hasMarketingConsent = () => hasGdprConsent("marketing");

/**
 * Check if user has given consent for functional cookies
 * @returns {boolean}
 */
export const hasFunctionalConsent = () => hasGdprConsent("functional");

/**
 * Execute tracking code only if user has given appropriate consent
 * @param {string} category - The consent category required
 * @param {Function} callback - The function to execute if consent is given
 */
export const executeWithConsent = (category, callback) => {
  if (hasGdprConsent(category)) {
    callback();
  }
};

/**
 * Execute analytics tracking only if user has given analytics consent
 * @param {Function} callback - The analytics function to execute
 */
export const executeAnalyticsWithConsent = (callback) => {
  executeWithConsent("analytics", callback);
};

/**
 * Execute marketing tracking only if user has given marketing consent
 * @param {Function} callback - The marketing function to execute
 */
export const executeMarketingWithConsent = (callback) => {
  executeWithConsent("marketing", callback);
};

/**
 * Check if user is in Europe
 * @returns {boolean}
 */
export const isInEurope = () => {
  try {
    const { continent } = getGeolocationData();
    return continent === "Europe";
  } catch (error) {
    console.warn("Error checking if user is in Europe:", error);
    // Default to true (require consent) if we can't determine location
    return true;
  }
};

/**
 * Check if only necessary cookies are allowed
 * @returns {boolean}
 */
export const isNecessaryOnlyMode = () => {
  try {
    const consent = getGdprConsent();
    if (!consent) return false;
    return (
      consent.necessary === true &&
      consent.analytics === false &&
      consent.marketing === false &&
      consent.functional === false
    );
  } catch (error) {
    console.error("Error checking necessary-only mode:", error);
    return false;
  }
};

/**
 * Execute callback only if NOT in necessary-only mode
 * If user is not in Europe, always execute (no consent required)
 * @param {Function} callback - The function to execute
 */
export const executeIfNotNecessaryOnly = (callback) => {
  // If user is not in Europe, tracking is always allowed
  if (!isInEurope()) {
    callback();
    return;
  }
  
  // If user is in Europe, check consent mode
  if (!isNecessaryOnlyMode()) {
    callback();
  }
};
