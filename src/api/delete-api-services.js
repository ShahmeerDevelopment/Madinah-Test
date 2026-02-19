import { doDelete } from "./httpRequests";

import { END_POINTS } from "./constant";
const {
  CAMPAIGN,
  PAYMENT_CARD_DETAILS,
  CREATE_CAMPAIGN,
  REFERRAL_LINK_STATS,
  CAMPAIGN_DONATION,
} = END_POINTS;

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;

export const deleteReferralLink = (campaignToken, id) => {
  return doDelete(
    `${API_URL}${API_VERSION}${CAMPAIGN}/${campaignToken}/${REFERRAL_LINK_STATS}/${id}`
  );
};

export const deleteLevel = (data, id) => {
  return doDelete(
    `${API_URL}${API_VERSION}${CAMPAIGN}${id}/giving-level`,
    data
  );
};

export const deleteUpdate = (updateId, id) => {
  return doDelete(`${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${id}/announcement/${updateId}`);
};

export const deleteCampaign = (id) => {
  return doDelete(`${API_URL}${API_VERSION}${CAMPAIGN}${id}`);
};

export const deleteUpSellCard = (id, data) => {
  return doDelete(`${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${id}/sell-config`, data);
};

export const deletePaymentCard = () => {
  return doDelete(`${PAYMENT_API_URL}${API_VERSION}${PAYMENT_CARD_DETAILS}`);
};

export const deleteTeamMember = (id, data) => {
  return doDelete(
    `${CAMPAIGN_API_URL}${API_VERSION}${CREATE_CAMPAIGN}/${id}/team-member`,
    data
  );
};
export const cancelSubscription = (id) => {
  return doDelete(
    `${PAYMENT_API_URL}${API_VERSION}${CAMPAIGN_DONATION}/${id}/terminate`
  );
};

export const deleteVerificationDocument = (id) => {
	return doDelete(
		`${API_URL}${API_VERSION}user/verification-document/${id}`,
	);
};
