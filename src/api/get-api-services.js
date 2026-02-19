import { useQuery } from "react-query";
import { END_POINTS } from "./constant";
import { doGet, doGetIp } from "./httpRequests";
import {
  generateRandomToken,
  isSuccessStatus,
  queryToString,
  queryToStringWithCSVAdjusted,
  sanitizeUtmParams,
} from "../utils/helpers";
import dayjs from "dayjs";
const {
  SEARCH_CHARITY,
  PROFILE,
  USER_CAMPAIGNS,
  USER_CAMPAIGN_DETAILS,
  PAYMENT_CARD,
  CAMPAIGN_CATEGORIES,
  CAMPAIGNS_AGAINST_CATID,
  CAMPAIGN,
  GET_CATEGORIES,
  GET_COUNTRY,
  CAMPAIGN_LIST,
  ALL_COUNTRIES,
  NOTIFICATIONS,
  NOTIFICATIONS_LIST,
  STATISTICS,
  STATISTICS_TABLE,
  STATISTICS_DROPDOWN_VALUES,
  REFERRAL_LINKS,
  REFERRAL_LINK_STATS,
  REFERRAL_STATS,
  UTM_TABLE,
  DONATION_SUMMARY,
  CAMPAIGN_DROPDOWN,
  CURRENCIES_DROPDOWN,
  FINANCIAL_SUMMARY,
  CAMPAIGN_DONATION,
} = END_POINTS;

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;

export const getProfile = (data) => {
  return doGet(`${API_URL}${API_VERSION}${PROFILE}`, data);
};

export const useGetProfile = (dependancy) => {
  return useQuery(`profileData-${dependancy}`, getProfile);
};

export const getCharityList = (searchingCharacters, limit, offSet) => {
  return doGet(
    `${CAMPAIGN_API_URL}${API_VERSION}${SEARCH_CHARITY}${searchingCharacters}&limit=${limit}&offset=${offSet}`
  );
};
export const useGetCharityList = (value, limit, offSet) => {
  return useQuery(["charityList", value, limit, offSet], () =>
    getCharityList(value, limit, offSet)
  );
};

export const getAllCampaigns = (query, limit = 12, offSet, cfCountry) => {
  return doGet(
    `${CAMPAIGN_API_URL}${API_VERSION}${USER_CAMPAIGNS}?${query}&countryCode=${cfCountry}&limit=${limit}&offset=${
      +offSet * +limit
    }`
  );
};

export const useGetAllCampaigns = (query = {}, limit = 12, offSet = 0) => {
  const queryString = queryToString(query);
  return useQuery("allCampaigns", () =>
    getAllCampaigns(queryString, limit, offSet)
  );
};

export const getCampaignDetails = (id, { limit, offSet }) => {
  return doGet(
    `${API_URL}${API_VERSION}${USER_CAMPAIGN_DETAILS}${id}/details?limit=${limit}&offset=${offSet}`
  );
};
export const useGetCampaignDetails = (id) => {
  return useQuery(["campaignDetails", id], () => getCampaignDetails(id));
};

export const getCreditCardList = () => {
  return doGet(`${PAYMENT_API_URL}${API_VERSION}${PAYMENT_CARD}`);
};
export const getAllCategories = () => {
  return doGet(`${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN_CATEGORIES}`);
};

export const getAllCampaignsBasedOnQuery = async (
  query,
  limit = 12,
  offSet = 0,
  ip = null,
  cfCountry = "US"
) => {
  const queryString = queryToString(query);
  const res = await doGetIp(
    `${CAMPAIGN_API_URL}${API_VERSION}${USER_CAMPAIGNS}?${queryString}&limit=${limit}&offset=${
      +offSet * +limit
    }${ip ? `&ipAddress=${ip}&countryCode=${cfCountry}` : ""}`,
    null,
    ip
  );
  return res;
};
export const applyFilter = async ({
  topFilterStartDate = "2024-03-07",
  topFilterEndDate = "2024-04-10",
  topFilterPreset = "",
  topFilterCompareTo = "previous-period",
  groupByFilter = "utmSource,utmMedium,utmTerm,utmContent,utmCampaign",
  utmSourceFilter = "",
  utmMediumFilter = "",
  utmTermFilter = "",
  utmContentFilter = "",
  utmCampaignFilter = "",
}) => {
  try {
    const searchQuery = queryToStringWithCSVAdjusted({
      topFilterStartDate,
      topFilterEndDate,
      topFilterPreset,
      topFilterCompareTo,
      groupByFilter,
      utmSourceFilter,
      utmMediumFilter,
      utmTermFilter,
      utmContentFilter,
      utmCampaignFilter,
    });
    const res = await doGet(
      `${CAMPAIGN_API_URL}${API_VERSION}${STATISTICS}?${searchQuery}`
    );
    return res;
  } catch (err) {
    return { error: err.message };
  }
};

export const getCampaignsAgainstCatId = async ({
  categoryId,
  offSet,
  limit,
  query,
}) => {
  try {
    const res = await doGet(
      `${API_URL}${API_VERSION}${CAMPAIGNS_AGAINST_CATID}/${categoryId}?limit=${limit}&offset=${offSet}&${query}`
    );
    return res;
  } catch (err) {
    return { error: err.message };
  }
};

export const useGetAllCampaignsAgainstCategory = (
  categoryId,
  index,
  paginationLimit = 12,
  query = {}
) => {
  const res = useQuery(categoryId, () =>
    getCampaignsAgainstCatId({
      categoryId,
      offSet: index,
      limit: paginationLimit,
      query,
    })
  );
  return res;
};

export const useGetAllCampaignsQuery = () => {
  return useQuery("campaign-categories", getAllCategories);
};

export const useGetCreditCardList = ({ enabled = true }) => {
  return useQuery("creditCardList", getCreditCardList, { enabled });
};

export const getReferralData = async (randomToken) => {
  return await doGet(
    `${API_URL}${API_VERSION}${CAMPAIGN}/${randomToken}/${REFERRAL_LINKS}`
  );
};

export const getNotifications = () => {
  return doGet(`${API_URL}${API_VERSION}${NOTIFICATIONS}`);
};

export const getNotificationsList = (
  limit = 10,
  offset = 0,
  type = "campaign-wise",
  campaignId = ""
) => {
  let url = `${API_URL}${API_VERSION}${NOTIFICATIONS_LIST}?limit=${limit}&offset=${offset}`;

  // Add type parameter only if it's provided
  if (type) {
    url += `&type=${type}`;
  }

  // Add campaignId parameter if provided
  if (campaignId) {
    url += `&campaignId=${campaignId}`;
  }

  return doGet(url);
};

export const useGetNotificationsList = (
  limit = 10,
  offset = 0,
  type = "campaign-wise",
  campaignId = ""
) => {
  return useQuery(["notificationsList", limit, offset, type, campaignId], () =>
    getNotificationsList(limit, offset, type, campaignId)
  );
};

export const getRecentSupporters = async (randomToken, limit, offset, ip) => {
  return await doGetIp(
    `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${randomToken}/supporters?limit=${limit}&offset=${offset}`,
    null,
    ip
  );
};

export const getAnnouncements = async (randomToken, limit, offset) => {
  return await doGet(
    `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${randomToken}/announcements?limit=${limit}&offset=${offset}`
  );
};

export const getSingleCampaignDataGivingLevels = async (
  randomToken,
  currency,
  screenType,
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  referral,
  ip = null,
  serverSideToken = null,
  cfCountry
) => {
  // Initialize token with a query string
  let tokenWithCurrency = `${randomToken}/giving-level-section?`;

  // Add currency and screenType if they exist
  if (currency) {
    tokenWithCurrency += `currency=${encodeURIComponent(currency)}`;
  }
  if (screenType) {
    tokenWithCurrency += `${currency ? "&" : ""}screenType=${encodeURIComponent(
      screenType
    )}`;
  }

  // Determine the endpoint based on screenType
  let endPoint;
  if (screenType === "update") {
    endPoint = `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}/giving-level-section/${tokenWithCurrency}`;
  } else {
    // Prepare UTM and referral parameters
    const queryParams = {
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      referralToken: referral,
      ipAddress: ip,
    };

    // Filter out invalid query parameters
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

    // Construct the full endpoint
    endPoint = `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${tokenWithCurrency}&${validParams}${cfCountry ? `&countryCode=${cfCountry}` : ""}`;
  }

  // Perform the GET request
  try {
    const res = await doGetIp(endPoint, serverSideToken, ip);

    const { status, statusText } = res;
    if (!isSuccessStatus(status)) {
      throw new Error(statusText);
    }
    return res;
  } catch (err) {
    return {
      error: true,
      response: err.message,
    };
  }
};


export const getSingleCampaignData = async (
  randomToken,
  currency,
  screenType,
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  referral,
  ip = null,
  serverSideToken = null,
  cfCountry
) => {
  // Initialize token with a query string
  let tokenWithCurrency = `${randomToken}?`;

  // Add currency and screenType if they exist
  if (currency) {
    tokenWithCurrency += `currency=${encodeURIComponent(currency)}`;
  }
  if (screenType) {
    tokenWithCurrency += `${currency ? "&" : ""}screenType=${encodeURIComponent(
      screenType
    )}`;
  }

  // Determine the endpoint based on screenType
  let endPoint;
  if (screenType === "update") {
    endPoint = `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${tokenWithCurrency}`;
  } else {
    // Prepare UTM and referral parameters
    const queryParams = {
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      referralToken: referral,
      ipAddress: ip,
    };

    // Filter out invalid query parameters
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

    // Construct the full endpoint
    endPoint = `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${tokenWithCurrency}&${validParams}${cfCountry ? `&countryCode=${cfCountry}` : ""}`;
  }

  // Perform the GET request
  try {
    const res = await doGetIp(endPoint, serverSideToken, ip);

    const { status, statusText } = res;
    if (!isSuccessStatus(status)) {
      throw new Error(statusText);
    }
    return res;
  } catch (err) {
    return {
      error: true,
      response: err.message,
    };
  }
};

export const useGetSingleCampaign = (
  token,
  screenType,
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  referral
) => {
  return useQuery(
    [
      "singleCampaign",
      token,
      screenType,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      referral,
    ],
    () =>
      getSingleCampaignData(
        token,
        null,
        screenType,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        referral
      )
  );
};

export const getCategoriesList = () => {
  return doGet(`${CAMPAIGN_API_URL}${API_VERSION}${GET_CATEGORIES}`);
};
export const useGetCategoriesList = () => {
  return useQuery("categoriesList", getCategoriesList);
};

export const getCountriesList = () => {
  return doGet(`${CAMPAIGN_API_URL}${API_VERSION}${GET_COUNTRY}`);
};
export const useGetCountriesList = () => {
  return useQuery("countriesList", getCountriesList);
};

const getCampaignList = () => {
  return doGet(`${API_URL}${API_VERSION}${CAMPAIGN_LIST}`);
};
export const useGetCampaignList = () => {
  return useQuery("campaignList", getCampaignList);
};

const getAllCountries = () => {
  return doGet(`${CAMPAIGN_API_URL}${API_VERSION}${ALL_COUNTRIES}`);
};
export const useGetAllCountries = () => {
  return useQuery("allCountriesList", getAllCountries);
};
export const getAllStatistics = (startDate) => {
  if (startDate?.id) {
    return doGet(
      `${API_URL}${API_VERSION}${CAMPAIGN}${startDate.id}/${REFERRAL_LINK_STATS}/${startDate.referralToken}/${REFERRAL_STATS}?topFilterStartDate=${startDate.startDate}&topFilterEndDate=${startDate.endDate}&topFilterPreset=${startDate.value}&topFilterCompareTo=${startDate.previousPeriod}&
		groupByFilter=utmSource,utmMedium,utmTerm,utmContent,utmCampaign`
    );
  }
  return doGet(
    `${CAMPAIGN_API_URL}${API_VERSION}${STATISTICS}?topFilterStartDate=${startDate.startDate}&topFilterEndDate=${startDate.endDate}&topFilterPreset=${startDate.value}&topFilterCompareTo=${startDate.previousPeriod}&
		groupByFilter=utmSource,utmMedium,utmTerm,utmContent,utmCampaign`
  );
};
export const getAllStatisticsTableData = (
  groupByFilter = [
    "utmSource",
    "utmMedium",
    "utmTerm",
    "utmContent",
    "utmCampaign",
  ],
  utmSourceFilter = "",
  utmMediumFilter = "",
  utmTermFilter = "",
  utmContentFilter = "",
  utmCampaignFilter = "",
  id,
  referralToken,
  startDate = "",
  endDate = ""
) => {
  const groupByFilterStr = groupByFilter.join(",");

  if (id) {
    return doGet(
      `${API_URL}${API_VERSION}${CAMPAIGN}/${id}/${REFERRAL_LINK_STATS}/${referralToken}/${REFERRAL_STATS}/${UTM_TABLE}?groupByFilter=${groupByFilterStr}&utmSourceFilter=${
        utmSourceFilter ?? ""
      }&utmMediumFilter=${utmMediumFilter ?? ""}&utmTermFilter=${
        utmTermFilter ?? ""
      }&utmContentFilter=${utmContentFilter ?? ""}&utmCampaignFilter=${
        utmCampaignFilter ?? ""
      }&startDateFilter=${startDate}&endDateFilter=${endDate}`
    );
  }
  const url = `${CAMPAIGN_API_URL}${API_VERSION}${STATISTICS_TABLE}?groupByFilter=${groupByFilterStr}&utmSourceFilter=${
    utmSourceFilter ?? ""
  }&utmMediumFilter=${utmMediumFilter ?? ""}&utmTermFilter=${
    utmTermFilter ?? ""
  }&utmContentFilter=${utmContentFilter ?? ""}&utmCampaignFilter=${
    utmCampaignFilter ?? ""
  }&startDateFilter=${startDate}&endDateFilter=${endDate}`;
  return doGet(url);
};

export const getFilterStatisticsDropDownData = () => {
  return doGet(`${CAMPAIGN_API_URL}${API_VERSION}${STATISTICS_DROPDOWN_VALUES}`);
};
export const getDonationData = (startDate, endDate) => {
  return doGet(
    `${PAYMENT_API_URL}${API_VERSION}${DONATION_SUMMARY}?startDate=${startDate}&endDate=${endDate}`
  );
};

export const getSpecificUserCampaign = () => {
  return doGet(`${API_URL}${API_VERSION}${CAMPAIGN_DROPDOWN}`);
};
export const getSpecificUserReceiptsList = (id) => {
  return doGet(
    `${PAYMENT_API_URL}${API_VERSION}${CAMPAIGN_DONATION}/${id}/receipts/download`
  );
};

export const getCurrencies = () => {
  return doGet(`${API_URL}${API_VERSION}${CURRENCIES_DROPDOWN}`);
};

export const getFinancialSummary = (startDate, endDate) => {
  if (startDate && endDate) {
    return doGet(
      `${PAYMENT_API_URL}${API_VERSION}${FINANCIAL_SUMMARY}?startDate=${startDate}&endDate=${endDate}`
    );
  }
};

export const useGetFinancialSummary = (startDate, endDate) => {
  return useQuery(
    ["financialSummary", startDate, endDate], // This key array ensures the query is re-fetched if any value changes
    () => getFinancialSummary(startDate, endDate)
    // {
    // 	keepPreviousData: true, // Optionally, keep previous data while new data is loading
    // },
  );
};
const getReceiptsList = (limit, offSet, sortBy) => {
  return doGet(
    `${PAYMENT_API_URL}${API_VERSION}${CAMPAIGN_DONATION}/receipts?limit=${limit}&offset=${offSet}&sortBy=${sortBy}`
  );
};
export const useGetReceiptsList = ({ limit, offset }, sortBy) => {
  return useQuery(
    ["receiptsList", limit, offset, sortBy], // This key array ensures the query is re-fetched if any value changes
    () => getReceiptsList(limit, offset, sortBy)
    // {
    // 	keepPreviousData: true, // Optionally, keep previous data while new data is loading
    // },
  );
};

export const getInvoiceList = (invoiceId) => {
  return doGet(
    `${API_URL}${API_VERSION}${CAMPAIGN_DONATION}/receipt/${invoiceId}`
  );
};

export const getAllReceiptsListZip = () => {
  return doGet(
    `${PAYMENT_API_URL}${API_VERSION}${CAMPAIGN_DONATION}/receipts/download`
  );
};

const getRecurringTableList = (limit, offSet, sortBy) => {
  return doGet(
    `${PAYMENT_API_URL}${API_VERSION}${CAMPAIGN_DONATION}/recurring?limit=${limit}&offset=${offSet}&sortBy=${sortBy}`
  );
};
export const useGetRecurringTableList = ({ limit, offset }, sortBy) => {
  return useQuery(
    ["receiptsList", limit, offset, sortBy], // This key array ensures the query is re-fetched if any value changes
    () => getRecurringTableList(limit, offset, sortBy)
    // {
    // 	keepPreviousData: true, // Optionally, keep previous data while new data is loading
    // },
  );
};

const getHistoryTableList = (limit, offSet, sortBy) => {
  return doGet(
    `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN_DONATION}/history?limit=${limit}&offset=${offSet}&sortBy=${sortBy}`
  );
};

export const useGetHistoryTableList = ({ limit, offset }, sortBy) => {
  return useQuery(
    ["historyList", limit, offset, sortBy], // This key array ensures the query is re-fetched if any value changes
    () => getHistoryTableList(limit, offset, sortBy)
    // {
    // 	keepPreviousData: true, // Optionally, keep previous data while new data is loading
    // },
  );
};
const getDonationDetails = (limit, offSet, sortBy, id) => {
  return doGet(
    `${PAYMENT_API_URL}${API_VERSION}${CAMPAIGN_DONATION}/${id}/details?limit=${limit}&offset=${offSet}&sortBy=${sortBy}`
  );
};

export const useGetDonationDetails = ({ limit, offset }, sortBy, id) => {
  return useQuery(
    ["donationDetails", limit, offset, sortBy, id], // This key array ensures the query is re-fetched if any value changes
    () => getDonationDetails(limit, offset, sortBy, id)
    // {
    // 	keepPreviousData: true, // Optionally, keep previous data while new data is loading
    // },
  );
};

export const getCsvAllList = () => {
  return doGet(
    `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN_DONATION}/receipts/download/csv`
  );
};

export const getAddToCartFbTags = async ({
  campaignId = "",
  totalAmount = null,
  currency = "",
  givingLevelTitle = "",
  utmSource = "",
  utmMedium = "",
  utmCampaign = "",
  utmTerm = "",
  utmContent = "",
  referral = "",
  src = "external_website",
  eventId = "",
  fbp = "",
  externalId = "",
  version = "",
  fbc = "",
  event_month = "",
  event_day = "",
  event_hour = "",
  traffic_source = "",
  content_ids = "",
  content_type = "product",
  user_roles = "guest",
  pixelUrl = "",
  campaignVersion = "",
  experimentKey,
  variationKey,
}) => {
  const url = `${API_URL}${API_VERSION}${CAMPAIGN}${campaignId}/add-to-cart?value=${totalAmount}&currency=${currency}&givingLevel=${givingLevelTitle}&utmSource=${utmSource}&utmMedium=${utmMedium}&utmCampaign=${utmCampaign}&utmTerm=${utmTerm}&utmContent=${utmContent}&src=${src}&referral=${referral}&fbc=${fbc}&eventId=${eventId}&fbp=${fbp}&event_month=${event_month}&event_day=${event_day}&event_hour=${event_hour}&traffic_source=${traffic_source}&content_ids=${content_ids}&content_type=${content_type}&user_roles=${user_roles}&pixelUrl=${pixelUrl}&externalId=${externalId}&version=${
    version ? version : "original"
  }&campaignVersion=${
    campaignVersion ? campaignVersion : "original"
  }&experiment_id=${experimentKey}&variation_id=${variationKey}`;
  return doGet(url);
};

export const getPaymentInfoFbTags = async ({
  campaignId = "",
  totalAmount = null,
  currency = "",
  givingLevelTitle = "",
  utmSource = "",
  utmMedium = "",
  utmCampaign = "",
  utmTerm = "",
  utmContent = "",
  referral = "",
  src = "external_website",
  eventId = "",
  fbp = "",
  externalId = "",
  version = "",
  fbc = "",
  event_month = "",
  event_day = "",
  event_hour = "",
  traffic_source = "",
  content_ids = "",
  content_type = "product",
  user_roles = "guest",
  pixelUrl = "",
  campaignVersion = "",
  experimentKey,
  variationKey,
}) => {
  const url = `${API_URL}${API_VERSION}${CAMPAIGN}${campaignId}/payment-info?value=${totalAmount}&currency=${currency}&givingLevel=${givingLevelTitle}&utmSource=${utmSource}&utmMedium=${utmMedium}&utmCampaign=${utmCampaign}&utmTerm=${utmTerm}&utmContent=${utmContent}&src=${src}&referral=${referral}&fbc=${fbc}&event_month=${event_month}&event_day=${event_day}&event_hour=${event_hour}&traffic_source=${traffic_source}&content_ids=${content_ids}&content_type=${content_type}&user_roles=${user_roles}&pixelUrl=${pixelUrl}&eventId=${eventId}&fbp=${fbp}&externalId=${externalId}&version=${
    version ? version : "original"
  }&campaignVersion=${
    campaignVersion ? campaignVersion : "original"
  }&experiment_id=${experimentKey}&variation_id=${variationKey}`;
  return doGet(url);
};

export const getInitiateCheckoutFbTags = async ({
  campaignId = "",
  totalAmount = null,
  currency = "",
  givingLevelTitle = "",
  utmSource = "",
  utmMedium = "",
  utmCampaign = "",
  utmTerm = "",
  utmContent = "",
  referral = "",
  src = "external_website",
  eventId = "",
  fbp = "",
  externalId = "",
  version = "",
  fbc = "",
  event_month = "",
  event_day = "",
  event_hour = "",
  traffic_source = "",
  content_ids = "",
  content_type = "product",
  user_roles = "guest",
  pixelUrl = "",
  campaignVersion,
  experimentKey,
  variationKey,
}) => {
  const url = `${API_URL}${API_VERSION}${CAMPAIGN}${campaignId}/initiate-checkout?value=${totalAmount}&currency=${currency}&givingLevel=${givingLevelTitle}&utmSource=${utmSource}&utmMedium=${utmMedium}&utmCampaign=${utmCampaign}&utmTerm=${utmTerm}&utmContent=${utmContent}&src=${src}&referral=${referral}&fbc=${fbc}&event_month=${event_month}&event_day=${event_day}&event_hour=${event_hour}&traffic_source=${traffic_source}&content_ids=${content_ids}&content_type=${content_type}&user_roles=${user_roles}&pixelUrl=${pixelUrl}&eventId=${eventId}&fbp=${fbp}&externalId=${externalId}&version=${
    version ? version : "original"
  }&campaignVersion=${
    campaignVersion ? campaignVersion : "original"
  }&experiment_id=${experimentKey}&variation_id=${variationKey}`;
  return doGet(url);
};

export const getVisits = (
  campaignToken,
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  referral,
  experimentalFeature,
  src = "external_website",
  campaignVersion,
  experimentKey,
  variationKey,
  userId
) => {
  // Session-level deduplication: if UTM params are present, only fire once
  // per session for the same campaign + UTM combination.
  const hasUtmParams = utmSource || utmMedium || utmCampaign || utmTerm || utmContent;
  if (hasUtmParams && typeof sessionStorage !== "undefined") {
    const dedupeKey = `visits_tracked_${campaignToken}_${utmSource || ""}_${utmMedium || ""}_${utmCampaign || ""}_${utmTerm || ""}_${utmContent || ""}`;
    if (sessionStorage.getItem(dedupeKey)) {
      return Promise.resolve(null);
    }
    sessionStorage.setItem(dedupeKey, "1");
  }

  const viewContentEventId = generateRandomToken("a", 5) + dayjs().unix();
  const pageViewEventId = generateRandomToken("a", 5) + dayjs().unix();
  const version = experimentalFeature;
  const utmParams = {
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    referralToken: referral,
    src,
  };
  const sanitizedUtmParams = sanitizeUtmParams(utmParams);
  const queryString = new URLSearchParams({
    viewContentEventId,
    pageViewEventId,
    version: version ? version : "original",
    campaignVersion,
    experiment_id: experimentKey,
    variation_id: variationKey,
    gb_visitor_id: userId,
    ...sanitizedUtmParams,
  }).toString();
  return doGet(
    `${CAMPAIGN_API_URL}${API_VERSION}campaign/${campaignToken}/visit?${queryString}`
  );
};

export const getAllVisits = (
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  referral
) => {
  const eventId = generateRandomToken("a", 5) + dayjs().unix();

  // Create query parameters object
  const queryParams = {
    eventId,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    referralToken: referral,
  };

  // Filter out invalid parameters
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

  // Construct URL with valid query parameters
  const url = `${API_URL}${API_VERSION}campaign/visit/general?${validParams}`;

  return doGet(url);
};

export const getDocumentTypes = () => {
  return doGet(`${API_URL}${API_VERSION}user/verification-document-types`);
};
export const getCampaignUpdates = async (campaignId) => {
  return doGet(
    `${CAMPAIGN_API_URL}${API_VERSION}${CAMPAIGN}${campaignId}/announcements`
  );
};
