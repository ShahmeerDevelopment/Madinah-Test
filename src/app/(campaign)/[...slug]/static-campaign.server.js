import { CACHE_LIFE_TIME } from "@/config/constant";
import { cacheLife, cacheTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL; 

/**
 * Get all active campaign slugs for generateStaticParams
 *
 * This function is called at build time to pre-generate all campaign routes.
 * Uses 'use cache' for build-time caching.
 *
 * @returns {Promise<Array<{slug: string[]}>>} Array of slug params for generateStaticParams
 */
export async function getAllActiveCampaignSlugs() {
  "use cache";

  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 300,
  });

  cacheTag("campaign-slugs");
  cacheTag("campaigns");

  const url = `${CAMPAIGN_API_URL}${API_VERSION}user/campaigns?type=featured&limit=1000&offset=0`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": CLIENT_API_KEY || "",
        "md-cli-id": "web-usr",
        Origin: "https://www.madinah.com",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch campaign slugs: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const campaigns = data?.data?.campaigns || [];

    return campaigns
      .filter((campaign) => campaign.randomToken)
      .map((campaign) => ({
        slug: [campaign.randomToken],
      }));
  } catch (error) {
    console.error("Error fetching campaign slugs for static generation:", error);
    return [];
  }
}

/**
 * Fetch static campaign data for build-time rendering
 *
 * This fetches campaign content WITHOUT dynamic dependencies (IP, country, UTM).
 * The data is cached at build time and served as static HTML.
 *
 * For analytics tracking, use getCampaignDataCached from campaign-cache.server.js
 * which accepts IP/country for tracking purposes.
 *
 * @param {string} slugPath - Campaign slug path
 * @returns {Promise<{data: object}>} Campaign data
 */
export async function getStaticCampaignData(slugPath) {
  "use cache";

  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 300,
  });

  // Tag for on-demand revalidation
  cacheTag(`campaign-${slugPath}`);
  cacheTag("campaigns");
  cacheTag("static-campaigns");

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
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching static campaign data:", error);
    return { data: { success: false, data: { campaignDetails: null } } };
  }
}

/**
 * Fetch static supporters data for build-time rendering
 *
 * This fetches recent supporters WITHOUT IP dependency.
 * The list is the same for all users (no location-based sorting).
 *
 * @param {string} slugPath - Campaign slug path
 * @param {number} limit - Number of supporters to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<{data: object}>} Supporters data
 */
export async function getStaticSupportersData(slugPath, limit = 4, offset = 0) {
  "use cache";

  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 300,
  });

  // Tag for on-demand revalidation
  cacheTag(`supporters-${slugPath}`);
  cacheTag(`campaign-${slugPath}`);
  cacheTag("supporters");

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
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching static supporters data:", error);
    return { data: { success: false, data: { recentSupporters: [] } } };
  }
}
