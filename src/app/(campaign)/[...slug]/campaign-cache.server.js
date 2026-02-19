import { CACHE_LIFE_TIME } from "@/config/constant";
import { cacheLife, cacheTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;


/**
 * Fetch single campaign data with caching
 *
 * Uses 'use cache' directive for PPR static shell generation
 * Cache duration: 15 minutes (stale), 30 minutes (revalidate), 1 day (expire)
 *
 * @param {string} slugPath - Campaign slug path
 * @param {string|null} ip - User IP address (cache key)
 * @param {string|null} cfCountry - Country code from Cloudflare
 * @param {object} utmParams - UTM tracking parameters
 * @param {string|null} token - Authentication token
 */
export async function getCampaignDataCachedLeftSide(
  slugPath,
  // ip = null,
  cfCountry = null,
  // utmParams = {},
  // token = null
) {
  "use cache";

  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 300,
  });

  // Tag for on-demand revalidation
  cacheTag(`campaign-${slugPath}`);
  cacheTag(`campaign-left-${slugPath}`);
  cacheTag("campaigns");

  // const {
  //   utm_source,
  //   utm_medium,
  //   utm_campaign,
  //   utm_term,
  //   utm_content,
  //   referral,
  // } = utmParams;

  let url = `${CAMPAIGN_API_URL}${API_VERSION}campaign/${slugPath}/left-section`;

  const params = new URLSearchParams();
  // if (utm_source) params.append("utm_source", utm_source);
  // if (utm_medium) params.append("utm_medium", utm_medium);
  // if (utm_campaign) params.append("utm_campaign", utm_campaign);
  // if (utm_term) params.append("utm_term", utm_term);
  // if (utm_content) params.append("utm_content", utm_content);
  // if (referral) params.append("referral", referral);
  // if (ip) params.append("ipAddress", ip);
  if (cfCountry) params.append("countryCode", cfCountry);

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": CLIENT_API_KEY || "",
        "md-cli-id": "web-usr",
        Origin: "https://www.madinah.com",
        // ...(ip && { "X-Forwarded-For": ip }),
        // ...(token && { Authorization: ` ${token}` }),
      },
    });

    if (!response.ok) {
      // Return status code for proper 404 handling
      return { data: { success: false, data: { campaignDetails: null } }, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return { data: { success: false, data: { campaignDetails: null } }, status: 500 };
  }
}

export async function getCampaignDataCachedStats(
  slugPath,
  // ip = null,
  cfCountry = null,
  // utmParams = {},
  token = null
) {




  // const {
  //   utm_source,
  //   utm_medium,
  //   utm_campaign,
  //   utm_term,
  //   utm_content,
  //   referral,
  // } = utmParams;

  let url = `${CAMPAIGN_API_URL}${API_VERSION}campaign/${slugPath}/right-section`;

  const params = new URLSearchParams();
  // if (utm_source) params.append("utm_source", utm_source);
  // if (utm_medium) params.append("utm_medium", utm_medium);
  // if (utm_campaign) params.append("utm_campaign", utm_campaign);
  // if (utm_term) params.append("utm_term", utm_term);
  // if (utm_content) params.append("utm_content", utm_content);
  // if (referral) params.append("referral", referral);
  // if (ip) params.append("ipAddress", ip);
  if (cfCountry) params.append("countryCode", cfCountry);

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": CLIENT_API_KEY || "",
        "md-cli-id": "web-usr",
        Origin: "https://www.madinah.com",
        // ...(ip && { "X-Forwarded-For": ip }),
        ...(token && { Authorization: ` ${token}` }),
      },
    });

    if (!response.ok) {
      // Return status code for proper 404 handling
      return { data: { success: false, data: { campaignDetails: null } }, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return { data: { success: false, data: { campaignDetails: null } }, status: 500 };
  }
}

export async function getCampaignDataCachedGivingLevels(
  slugPath,
  // ip = null,
  cfCountry = null,
  // utmParams = {},
  token = null
) {
  "use cache";

  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 300,
  });

  // Tag for on-demand revalidation
  cacheTag(`campaign-${slugPath}`);
  cacheTag(`campaign-giving-levels-${slugPath}`);
  cacheTag("campaigns");

  // const {
  //   utm_source,
  //   utm_medium,
  //   utm_campaign,
  //   utm_term,
  //   utm_content,
  //   referral,
  // } = utmParams;

  let url = `${CAMPAIGN_API_URL}${API_VERSION}campaign/${slugPath}/giving-level-section`;

  const params = new URLSearchParams();
  // if (utm_source) params.append("utm_source", utm_source);
  // if (utm_medium) params.append("utm_medium", utm_medium);
  // if (utm_campaign) params.append("utm_campaign", utm_campaign);
  // if (utm_term) params.append("utm_term", utm_term);
  // if (utm_content) params.append("utm_content", utm_content);
  // if (referral) params.append("referral", referral);
  // if (ip) params.append("ipAddress", ip);
  if (cfCountry) params.append("countryCode", cfCountry);

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": CLIENT_API_KEY || "",
        "md-cli-id": "web-usr",
        Origin: "https://www.madinah.com",
        // ...(ip && { "X-Forwarded-For": ip }),
        ...(token && { Authorization: ` ${token}` }),
      },
    });

    if (!response.ok) {
      // Return status code for proper 404 handling
      return { data: { success: false, data: { campaignDetails: null } }, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return { data: { success: false, data: { campaignDetails: null } }, status: 500 };
  }
}


/**
 * Fetch campaign data for static shell (no runtime data dependencies)
 *
 * This version does NOT include IP/country - it's a pure static cache
 * that can be included in the PPR static shell at build time.
 *
 * @param {string} slugPath - Campaign slug path
 * @param {string|null} token - Authentication token
 */
export async function getStaticCampaignDataCached(slugPath) {
  "use cache";

  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 300,
  });

  // Tag for on-demand revalidation
  const decodedSlugPath = decodeURIComponent(slugPath);
  cacheTag(`campaign-static-${decodedSlugPath}`);
  cacheTag(`campaign-${decodedSlugPath}`);
  cacheTag("campaigns");

  const url = `${CAMPAIGN_API_URL}${API_VERSION}campaign/${slugPath}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": CLIENT_API_KEY || "",
        "md-cli-id": "web-usr",
        Origin: "https://www.madinah.com",
        // ...(token && { Authorization: ` ${token}` }),
      },
    });

    if (!response.ok) {
      // Return status code for proper 404 handling
      return { data: { success: false, data: { campaignDetails: null } }, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("Error fetching static campaign data:", error);
    return { data: { success: false, data: { campaignDetails: null } }, status: 500 };
  }
}

/**
 * Fetch recent supporters for a campaign with caching
 *
 * Uses 'use cache' directive for PPR static shell generation
 * Cache duration: 5 minutes (shorter since supporters change frequently)
 *
 * @param {string} slugPath - Campaign slug path
 * @param {number} limit - Number of supporters to fetch
 * @param {number} offset - Offset for pagination
 * @param {string|null} ip - User IP address
 * @param {string|null} token - Authentication token
 */
export async function getSupportersCached(
  slugPath,
  limit = 4,
  offset = 0,
  // ip = null,
  // token = null
) {
  // "use cache";

  // cacheLife({
  //   stale: CACHE_LIFE_TIME,
  //   revalidate: CACHE_LIFE_TIME,
  //   expire: CACHE_LIFE_TIME,
  // });

  // Tag for on-demand revalidation
  // const decodedSlugPath = decodeURIComponent(slugPath);
  // cacheTag(`supporters-${decodedSlugPath}`);
  // cacheTag(`campaign-${decodedSlugPath}`);
  // cacheTag("supporters");

  const url = `${CAMPAIGN_API_URL}${API_VERSION}campaign/${slugPath}/supporters?limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": CLIENT_API_KEY || "",
        "md-cli-id": "web-usr",
        Origin: "https://www.madinah.com",
        // ...(ip && { "X-Forwarded-For": ip }),
        // ...(token && { Authorization: ` ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching recent supporters:", error);
    return { data: { success: false, data: { recentSupporters: [] } } };
  }
}
