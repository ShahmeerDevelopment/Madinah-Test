import { END_POINTS } from "./constant";
import { doPatch, doPut } from "./httpRequests";
const {
  CAMPAIGN,
  USER_PERSONAL_INFORMATION,
  USER_HOME_ADDRESS,
  USER_BANK_INFO,
  USER_BANK_INFO_REVIEW,
  PROFILE,
  UPDATE_BILLING_INFO,
  NOTIFICATION_UPDATE,
  CREATE_CAMPAIGN,
  CAMPAIGN_DONATION,
} = END_POINTS;

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;

export const changeTeamRole = (campaignId, data) => {
  return doPut(
    `${CAMPAIGN_API_URL}${API_VERSION}${CREATE_CAMPAIGN}/${campaignId}/team-member`,
    data
  );
};

export const updateNotifications = (data) => {
  return doPatch(`${API_URL}${API_VERSION}${NOTIFICATION_UPDATE}`, data);
};

export const updatePaymentCard = (data) => {
  return doPut(`${PAYMENT_API_URL}${API_VERSION}${UPDATE_BILLING_INFO}`, data);
};

export const updateProfile = (data) => {
  return doPut(`${API_URL}${API_VERSION}${PROFILE}`, data);
};
export const updateCampaign = (data, id) => {
  return doPut(`${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${id}/details`, data);
};

export const updateSettings = (data, id) => {
  return doPatch(`${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${id}/settings`, data);
};
export const updateLevel = (data, id) => {
  return doPut(`${API_URL}${API_VERSION}${CAMPAIGN}${id}/giving-level`, data);
};

export const updateAnnouncement = (data, id, updateId) => {
  return doPut(
    `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${id}/announcement/${updateId}`,
    data
  );
};

export const sortUpdates = (data, id) => {
  return doPut(
    `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${id}/announcement/ordering`,
    data
  );
};

export const updateUserPersonalInformation = (data) => {
  return doPut(`${API_URL}${API_VERSION}${USER_PERSONAL_INFORMATION}`, data);
};
export const updateUserAddress = (data) => {
  return doPut(`${API_URL}${API_VERSION}${USER_HOME_ADDRESS}`, data);
};

export const updateBankInfo = (data) => {
  return doPut(`${API_URL}${API_VERSION}${USER_BANK_INFO}`, data);
};
export const updateBankInfoReview = (data) => {
  return doPut(`${API_URL}${API_VERSION}${USER_BANK_INFO_REVIEW}`, data);
};

export const sortLevels = (data, id) => {
  return doPut(
    `${API_URL}${API_VERSION}${CAMPAIGN}${id}/giving-levels/ordering`,
    data
  );
};

export const sortUpSellData = (id, data) => {
  return doPut(
    `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${id}/sell-configs/ordering`,
    data
  );
};

export const updateUpSellData = (id, data) => {
  return doPut(`${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${id}/sell-config`, data);
};

export const updateDonation = (campaignId, paymentId, data) => {
  return doPut(
    `${PAYMENT_API_URL}${API_VERSION}${CAMPAIGN}${campaignId}/payment/${paymentId}`,
    data
  );
};

export const updateRecurringDonation = (id, data) => {
  return doPut(`${API_URL}${API_VERSION}${CAMPAIGN_DONATION}/${id}`, data);
};

export const postDonationFeedback = (tokens, data) => {
  const payload = {
    feedback: data,
    paymentId: tokens?.paymentId,
    feedbackToken: tokens?.feedbackToken,
  };
  return doPut(`${CAMPAIGN_API_URL}${API_VERSION}campaign/payment/feedback`, payload);
};

export const updateUserPixelData = (data) => {
  return doPut(`${API_URL}${API_VERSION}user/pixel-details`, data);
};
