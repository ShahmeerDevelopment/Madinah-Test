/**
 * API Route - Featured Campaigns Pagination
 *
 * Handles client-side pagination requests for featured campaigns.
 * Uses Next.js Route Handlers with caching.
 */

import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;

const DEFAULT_IMAGE =
  "https://madinah-dev.s3.us-east-1.amazonaws.com/campaign-cover-images/1000X1000/Cxl9fn-1730095218.png";

function getThumbnailUrl(url) {
  if (!url) return null;
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
  }
  return null;
}

function mapCampaignData(campaign) {
  let image;
  if (campaign.coverImageUrl !== "") {
    image = campaign.coverImageUrl;
  } else if (campaign.videoLinks && campaign.videoLinks[0]?.url) {
    image = getThumbnailUrl(campaign.videoLinks[0].url);
    if (!image) image = DEFAULT_IMAGE;
  } else {
    image = DEFAULT_IMAGE;
  }

  return {
    id: campaign.randomToken,
    image,
    coverImageUrl: campaign.coverImageUrl,
    videoLinks: campaign.videoLinks,
    title: campaign.title,
    subtitle: campaign.subTitle,
    raisedAmount: campaign.collectedAmount,
    totalGoal: campaign.targetAmount,
    raisedCurrency: campaign.currencySymbol || null,
    recurringDonation: campaign.isRecurringDonation || false,
    oneTimeDonation: campaign.isOneTimeDonation || false,
    currencySymbol: campaign?.currencySymbol,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "0", 10);
  const cfCountry = searchParams.get("cfCountry") || "US";

  const url = `${CAMPAIGN_API_URL}${API_VERSION}user/campaigns?type=featured&limit=5&offset=${page * 5}&countryCode=${cfCountry}`;

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
      // Cache pagination requests for 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const campaigns = data?.success
      ? (data.data.campaigns || []).map(mapCampaignData)
      : [];

    const hasMore = data?.data?.isMoreRecordsExist || false;

    return NextResponse.json(
      { campaigns, hasMore },
      {
        headers: {
          // Cache response for 5 minutes on client
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching featured campaigns:", error);
    return NextResponse.json(
      { campaigns: [], hasMore: false, error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
