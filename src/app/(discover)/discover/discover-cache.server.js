/**
 * Discover Cache Functions - Server-side with Next.js 16 Cache Components
 *
 * PPR (Partial Prerendering) Strategy:
 * - Uses 'use cache' directive for static shell generation
 * - cacheLife for cache duration configuration
 * - cacheTag for on-demand revalidation via revalidateTag()
 *
 * Benefits:
 * - Static shell with skeletons during build
 * - Cached data streams in quickly
 * - On-demand revalidation via revalidateTag('categories') or revalidateTag('countries')
 */

import { CACHE_LIFE_TIME } from "@/config/constant";
import { cacheLife, cacheTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;

/**
 * Fetch categories list with caching
 *
 * Uses 'use cache' directive for PPR static shell generation
 * Cache duration: 1 hour (stale), 2 hours (revalidate), 1 day (expire)
 * Categories change infrequently, so longer cache duration is appropriate
 */
export async function getCategoriesListCached() {
  "use cache";

  // Cache for 1 hour (stale after 30min, revalidate at 1hr, expire at 1 day)
  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 86400,
  });

  // Tag for on-demand revalidation
  cacheTag("categories");
  cacheTag("discover");

  const url = `${API_URL}${API_VERSION}campaign/categories`;

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
    console.error("Error fetching categories:", error);
    return { data: { success: false, data: { categories: [] } } };
  }
}

/**
 * Fetch countries list with caching
 *
 * Uses 'use cache' directive for PPR static shell generation
 * Cache duration: 1 hour (stale), 2 hours (revalidate), 1 day (expire)
 * Countries change infrequently, so longer cache duration is appropriate
 */
export async function getCountriesListCached() {
  "use cache";

  // Cache for 1 hour (stale after 30min, revalidate at 1hr, expire at 1 day)
  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 86400,
  });

  // Tag for on-demand revalidation
  cacheTag("countries");
  cacheTag("discover");

  const url = `${API_URL}${API_VERSION}campaign/countries`;

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
    console.error("Error fetching countries:", error);
    return { data: { success: false, data: { countries: [] } } };
  }
}

/**
 * Fetch featured campaigns with caching
 *
 * Uses 'use cache' directive for PPR static shell generation
 * Cache duration: 1 hour (stale), 2 hours (revalidate), 1 day (expire)
 */
export async function getFeaturedCampaignsCached(cfCountry = null) {
  "use cache";

  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 86400,
  });

  cacheTag("featured-campaigns");
  cacheTag("discover");

  const query = "type=featured";
  const limit = 100;
  const offset = 0;

  // Construct URL similar to getAllCampaignsBasedOnQuery
  let url = `${CAMPAIGN_API_URL}${API_VERSION}user/campaigns?${query}&limit=${limit}&offset=${offset}`;
  if (cfCountry) {
    url += `&countryCode=${cfCountry}`;
  }

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
      // Log error but don't throw to prevent crashing the page
      console.error(`HTTP error fetching featured campaigns! status: ${response.status}`);
      return { data: { success: false, data: { campaigns: [] } } };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching featured campaigns:", error);
    return { data: { success: false, data: { campaigns: [] } } };
  }
}

/**
 * Fetch organizations with caching
 */
export async function getOrganizationsCached() {
  "use cache";

  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 86400,
  });

  cacheTag("organizations");
  cacheTag("discover");

  const searchingCharacters = "";
  const limit = 100;
  const offSet = 0;

  // Construct URL similar to getCharityList
  const url = `${API_URL}${API_VERSION}campaign/charity/organizations?searchText=${searchingCharacters}&limit=${limit}&offset=${offSet}`;

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
      console.error(`HTTP error fetching organizations! status: ${response.status}`);
      return { data: { success: false, data: { charityOrganizations: [] } } };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return { data: { success: false, data: { charityOrganizations: [] } } };
  }
}

/**
 * Fetch trending (almost completed) campaigns with caching
 */
export async function getTrendingCampaignsCached(cfCountry = null) {
  "use cache";

  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 86400,
  });

  cacheTag("trending-campaigns");
  cacheTag("discover");

  const query = "type=almost-completed";
  const limit = 100;
  const offset = 0;

  let url = `${CAMPAIGN_API_URL}${API_VERSION}user/campaigns?${query}&limit=${limit}&offset=${offset}`;
  if (cfCountry) {
    url += `&countryCode=${cfCountry}`;
  }

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
      console.error(`HTTP error fetching trending campaigns! status: ${response.status}`);
      return { data: { success: false, data: { campaigns: [] } } };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching trending campaigns:", error);
    return { data: { success: false, data: { campaigns: [] } } };
  }
}
