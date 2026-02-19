/**
 * Server-side API services for App Router
 * These functions use native fetch without React Query for use in Server Components
 *
 * Uses Next.js 16 'use cache' directive with cacheLife for optimal caching
 */

import { cacheLife, cacheTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;


/**
 * Helper function to convert query object to query string
 */
function queryToString(query) {
  if (!query || typeof query !== "object") return "";
  return Object.entries(query)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}

/**
 * Fetch featured campaigns for the homepage
 * Server-side compatible - no React Query
 */
export async function getAllCampaignsBasedOnQuery(
  query,
  limit = 12,
  offSet = 0,
  ip = null,
  cfCountry = "US"
) {
  const queryString = queryToString(query);
  const url = `${CAMPAIGN_API_URL}${API_VERSION}user/campaigns?${queryString}&limit=${limit}&offset=${
    +offSet * +limit
  }${ip ? `&ipAddress=${ip}&countryCode=${cfCountry}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": CLIENT_API_KEY || "",
        "md-cli-id": "web-usr",
        Origin: "https://www.madinah.com",
        ...(ip && { "X-Forwarded-For": ip }),
      },
      // Cache for 60 seconds, revalidate in background
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { data: { success: false, data: { campaigns: [] } } };
  }
}

/**
 * Fetch all categories for the homepage
 * Server-side compatible
 */
export async function getAllCategories() {
  const url = `${API_URL}${API_VERSION}user/campaigns`;

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
      next: { revalidate: 300 }, // Cache for 5 minutes
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
 * Fetch all campaigns for BigCarousal (all category campaigns)
 * Server-side compatible
 */
export async function getAllCampaignsForCarousel() {
  const url = `${CAMPAIGN_API_URL}${API_VERSION}user/campaigns?isAllCategoryCampaignsRequired=true&limit=12&offset=0`;

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
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching carousel campaigns:", error);
    return { data: { success: false, data: { campaigns: [] } } };
  }
}

/**
 * Fetch charity organizations list
 * Server-side compatible
 */
export async function getCharityOrganizations(limit = 100) {
  const url = `${API_URL}${API_VERSION}campaign/charity/organizations?searchText=&limit=${limit}&offset=0`;

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
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching charity organizations:", error);
    return { data: { success: false, data: { charityOrganizations: [] } } };
  }
}

/**
 * Fetch blog posts for YearInHelpReview
 * Server-side compatible
 */
export async function getBlogPostsServer(limit = 1) {
  // Use hardcoded URL like blog-api-services.js
  const BLOG_API_URL = "https://blog.madinah.com/wp-json/wp/v2";
  const url = `${BLOG_API_URL}/posts?per_page=${limit}&_embed`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();

    // Transform WordPress response to match expected format (same as blog-api-services.js)
    const transformedPosts = posts.map((post) => {
      // Get featured image with fallbacks
      let featuredImage = "";
      if (post._embedded?.["wp:featuredmedia"]?.[0]) {
        const media = post._embedded["wp:featuredmedia"][0];
        if (media.media_details?.sizes) {
          featuredImage =
            media.media_details.sizes.medium_large?.source_url ||
            media.media_details.sizes.large?.source_url ||
            media.media_details.sizes.medium?.source_url ||
            media.media_details.sizes.full?.source_url ||
            media.source_url ||
            "";
        } else {
          featuredImage = media.source_url || "";
        }
      }

      return {
        id: post.id,
        title: post.title?.rendered || "",
        excerpt: post.excerpt?.rendered || "",
        link: post.link || "",
        featured_image_url: featuredImage, // Match the field name from blog-api-services.js
        date: post.date,
      };
    });

    return {
      data: {
        success: true,
        data: transformedPosts,
      },
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { data: { success: false, data: [] } };
  }
}

/**
 * Fetch single campaign data by slug
 * Server-side compatible with Next.js fetch caching
 *
 * Note: Using fetch next.revalidate instead of "use cache" to avoid serialization issues
 */
export async function getSingleCampaignDataServer(
  slug,
  ip = null,
  cfCountry = null,
  utmParams = {}
) {
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;

  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referral,
  } = utmParams;

  let url = `${CAMPAIGN_API_URL}${API_VERSION}campaign/${slugPath}`;

  // Build query params
  const params = new URLSearchParams();
  if (utm_source) params.append("utm_source", utm_source);
  if (utm_medium) params.append("utm_medium", utm_medium);
  if (utm_campaign) params.append("utm_campaign", utm_campaign);
  if (utm_term) params.append("utm_term", utm_term);
  if (utm_content) params.append("utm_content", utm_content);
  if (referral) params.append("referral", referral);
  if (ip) params.append("ipAddress", ip);
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
        ...(ip && { "X-Forwarded-For": ip }),
      },
      next: { revalidate: 900, tags: [`campaign-${slugPath}`, "campaigns"] },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return { data: { success: false, data: { campaignDetails: null } } };
  }
}

/**
 * Fetch recent supporters for a campaign
 * Server-side compatible with Next.js fetch caching
 *
 * Note: Using fetch next.revalidate instead of "use cache" to avoid serialization issues
 */
export async function getRecentSupportersServer(
  slug,
  limit = 4,
  offset = 0,
  ip = null
) {
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;

  const url = `${CAMPAIGN_API_URL}${API_VERSION}campaign/${slugPath}/supporters?limit=${limit}&offset=${offset}${ip ? `&ipAddress=${ip}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": CLIENT_API_KEY || "",
        "md-cli-id": "web-usr",
        Origin: "https://www.madinah.com",
        ...(ip && { "X-Forwarded-For": ip }),
      },
      next: {
        revalidate: 300,
        tags: [`supporters-${slugPath}`, `campaign-${slugPath}`, "supporters"],
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
