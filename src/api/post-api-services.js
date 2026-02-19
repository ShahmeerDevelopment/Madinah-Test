import { doGet, doPost, postWithoutToken } from "./httpRequests";
import { END_POINTS } from "./constant";
const {
  CAMPAIGN,
  ZIP_CODE_VALIDATE,
  PAYMENT_CARD_DETAILS,
  CREATE_CAMPAIGN,
  CURRENCY_CONVERSION,
  RESEND_EMAIL,
  TOKEN,
} = END_POINTS;

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;

export const getToken = (data) => {
  return postWithoutToken(`${API_URL}${API_VERSION}${TOKEN}`, data);
};

export const addLevels = (data, id) => {
  return doPost(`${API_URL}${API_VERSION}${CAMPAIGN}${id}/giving-level`, data);
};
export const postZipCodeValidation = (data) => {
  return doPost(`${API_URL}${API_VERSION}${ZIP_CODE_VALIDATE}`, data);
};
export const postCardDetails = (data) => {
  return doPost(`${PAYMENT_API_URL}${API_VERSION}${PAYMENT_CARD_DETAILS}`, data);
};

export const postCardPayment = (
  id,
  data,
  isLogin,
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  referral,
  src = "external_website",
  fbc,
  event_month,
  event_day,
  event_hour,
  traffic_source,
  content_ids,
  content_type,
  user_roles,
  url,
  purchaseEventId,
  donateEventId,
  fbpData,
  externalId,
  version,
  campaignVersion,
  experimentKey,
  variationKey,
  userId
) => {
  const queryParams = {
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    referralToken: referral,
    src,
    fbc,
    event_month,
    event_day,
    event_hour,
    traffic_source,
    content_ids,
    content_type,
    user_roles,
    url,
    purchaseEventId,
    donateEventId,
    fbp: fbpData,
    externalId,
    version: version ? version : "original",
    campaignVersion: campaignVersion ? campaignVersion : "original",
    experiment_id: experimentKey,
    variation_id: variationKey,
    gb_visitor_id: userId,
  };

  const validParams = Object.entries(queryParams)
    .filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "null" &&
        value !== "undefined"
    )
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  const _url = `${PAYMENT_API_URL}${API_VERSION}${CREATE_CAMPAIGN}/${id}/payment${
    validParams ? `?${validParams}` : ""
  }`;

  // const _url = `${API_URL}${API_VERSION}${CREATE_CAMPAIGN}/${id}/payment?utmSource=${utmSource}&utmMedium=${utmMedium}&utmCampaign=${utmCampaign}&utmTerm=${utmTerm}&utmContent=${utmContent}&referralToken=${referral}&purchaseEventId=${purchaseEventId}&donateEventId=${donateEventId}&fbp=${fbpData}&externalId=${externalId}`;
  if (isLogin) {
    return doPost(_url, data);
  } else {
    return postWithoutToken(_url, data);
  }
};

export const postCurrencyForConversion = (currencyOne, currencyTwo) => {
  return doPost(
    `${PAYMENT_API_URL}${API_VERSION}${CURRENCY_CONVERSION}${currencyOne}/${currencyTwo}`
  );
};

export const resendEmailVerification = (data) => {
  return postWithoutToken(`${API_URL}${API_VERSION}${RESEND_EMAIL}`, data);
};

export const postUpSellData = (id, data) => {
  return doPost(`${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${id}/sell-config`, data);
};
export const resendEmailVerificationLoggedIn = () => {
  return doGet(`${API_URL}${API_VERSION}${RESEND_EMAIL}`);
};

export const postReferralLink = (id, data) => {
  return doPost(
    `${CAMPAIGN_API_URL}${API_VERSION}${CREATE_CAMPAIGN}/${id}/referral-link`,
    data
  );
};

export const postTeamMember = (id, data) => {
  return doPost(
    `${CAMPAIGN_API_URL}${API_VERSION}${CREATE_CAMPAIGN}/${id}/team-member`,
    data
  );
};

export const verifyMember = (data) => {
  return doPost(
    `${CAMPAIGN_API_URL}${API_VERSION}${CREATE_CAMPAIGN}/team-member/invitation`,
    data
  );
};

export const postOfflineDonation = (campaignId, data) => {
  return doPost(
    `${PAYMENT_API_URL}${API_VERSION}${CAMPAIGN}${campaignId}/offline-payment`,
    data
  );
};

export const postDuplicateCampaign = (campaignId) => {
  return doPost(`${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${campaignId}/duplicate`);
};
export const postDeactivateCampaign = (campaignId) => {
  return doPost(`${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${campaignId}/de-activate`);
};

export const postCampaignUpdate = (campaignId, data) => {
  return doPost(
    `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${campaignId}/announcement`,
    data
  );
};

export const savePixelLogs = (data, campaignId) => {
  const payload = {
    payload: data,
  };
  return doPost(
    `${CAMPAIGN_API_URL}${API_VERSION}campaign/${campaignId}/facebook-event-log`,
    payload
  );
};

export const googleTagLogs = (data, campaignId) => {
  const payload = {
    payload: data,
  };
  return doPost(
    `${API_URL}${API_VERSION}campaign/${campaignId}/google-tag-log`,
    payload
  );
};

export const googleTagServer = (data, campaignId) => {
  const payload = {
    payload: data,
  };
  return doPost(
    `${API_URL}${API_VERSION}campaign/${campaignId}/google-tag-server`,
    payload
  );
};

export const uploadVerificationDocument = (data) => {
  return doPost(`${API_URL}${API_VERSION}user/verification-document`, data);
};

export const verifyGoogleReCaptcha = (token) => {
  return postWithoutToken(`${API_URL}${API_VERSION}user/google-recaptcha`, {
    token,
  });
};

export const handleVerificationDocumentApproval = () => {
  return doPost(`${API_URL}${API_VERSION}user/verification-document/submit`);
};

export const sendConsentToApi = (data) => {
  return doPost(`${API_URL}${API_VERSION}user/cookies-consent`, data);
};

/**
 * @deprecated This function is deprecated and will be removed in a future version.
 * PostHog events are now sent directly from the frontend via posthog-js and the middleware proxy.
 *
 * Use the following instead:
 * - import { capturePosthogEvent } from "@/utils/posthogHelper";
 * - capturePosthogEvent("event_name", { property: "value" });
 *
 * Or use posthog-js directly:
 * - import posthog from "posthog-js";
 * - posthog.capture("event_name", { property: "value" });
 *
 * The backend endpoint /api/v1/user/posthog is no longer needed.
 */
export const handlePosthog = (data) => {
  // Log deprecation warning in development
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[DEPRECATED] handlePosthog is deprecated. " +
        "Use capturePosthogEvent from @/utils/posthogHelper or posthog.capture() directly. " +
        "Events are now sent via frontend middleware proxy."
    );
  }

  // Forward to new direct capture method for backward compatibility
  if (typeof window !== "undefined") {
    try {
      const { capturePosthogEvent } = require("@/utils/posthogHelper");
      capturePosthogEvent(data.event, data.properties);
      // Return a resolved promise for backward compatibility
      return Promise.resolve({ success: true });
    } catch (error) {
      console.warn("PostHog event capture failed:", error);
      return Promise.resolve({ success: false, error: error.message });
    }
  }

  // SSR fallback - return resolved promise
  return Promise.resolve({ success: false, error: "SSR environment" });
};
