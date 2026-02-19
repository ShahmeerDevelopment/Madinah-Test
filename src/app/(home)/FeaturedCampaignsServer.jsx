import { Suspense } from "react";
import { headers } from "next/headers";
import { cacheLife, cacheTag } from "next/cache";
import FeaturedCampaignsClient from "./FeaturedCampaignsClient";
import { CACHE_LIFE_TIME } from "@/config/constant";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;

const DEFAULT_IMAGE =
  "https://madinah-dev.s3.us-east-1.amazonaws.com/campaign-cover-images/1000X1000/Cxl9fn-1730095218.png";

function getThumbnailUrl(url) {
  if (!url) return null;
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
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

function getIPv4(ip) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ip) return null;
  const addresses = ip.split(/,\s*/);
  for (const addr of addresses) {
    if (ipv4Regex.test(addr)) return addr;
  }
  return null;
}

async function getFeaturedCampaigns(cfCountry) {
  "use cache";
  // Cache for 2 hours (stale after 1hr, revalidate at 2hr)
  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 300,
  });
  // Tag for on-demand revalidation
  cacheTag("featured-campaigns");

  const url = `${CAMPAIGN_API_URL}${API_VERSION}user/campaigns?type=featured&limit=5&offset=0${`&countryCode=${cfCountry}`}`;

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
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching featured campaigns:", error);
    return {
      success: false,
      data: { campaigns: [], isMoreRecordsExist: false },
    };
  }
}

export default function FeaturedCampaignsServer() {
  return (
    <>
      {/* Styles moved to globals.css for TBT optimization */}
      <section className="featured-campaigns-section">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-league-spartan)",
              fontSize: "32px",
              fontWeight: 500,
              lineHeight: "38px",
              letterSpacing: "-0.41px",
              color: "#090909",
              margin: 0,
            }}
          >
            Featured Campaigns
          </h2>
        </div>

        <Suspense fallback={<FeaturedCampaignsCardsSkeleton />}>
          <FeaturedCampaignsContent />
        </Suspense>
      </section>
    </>
  );
}

// Skeleton for just the campaign cards (not the whole section)
function FeaturedCampaignsCardsSkeleton() {
  return (
    <>
      <div
        className="skeleton-grid"
        style={{ display: "flex", gap: "32px", width: "100%" }}
      >
        {/* Large card (40.81%) */}
        <div
          className="skeleton-col-1"
          style={{ width: "40.81%", flexShrink: 0 }}
        >
          <div
            className="skeleton-card"
            style={{ height: "486px", borderRadius: "24px" }}
          />
        </div>

        {/* Second column (25.85%) - 2 cards */}
        <div
          className="skeleton-col-2"
          style={{
            width: "25.85%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flexShrink: 0,
          }}
        >
          <div
            className="skeleton-card"
            style={{ height: "229px", borderRadius: "24px" }}
          />
          <div
            className="skeleton-card"
            style={{ height: "229px", borderRadius: "24px" }}
          />
        </div>

        {/* Third column (25.85%) - 2 cards */}
        <div
          className="skeleton-col-3"
          style={{
            width: "25.85%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flexShrink: 0,
          }}
        >
          <div
            className="skeleton-card"
            style={{ height: "229px", borderRadius: "24px" }}
          />
          <div
            className="skeleton-card"
            style={{ height: "229px", borderRadius: "24px" }}
          />
        </div>
      </div>

      {/* Discover link placeholder */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "150px",
            height: "20px",
            borderRadius: "8px",
            background: "#f0f0f0",
          }}
        />
      </div>
      {/* Skeleton styles moved to globals.css for TBT optimization */}
    </>
  );
}

// Async component that fetches data - streams in after shell
async function FeaturedCampaignsContent() {
  // Get IP and country from headers for geo-targeting
  const headersList = await headers();
  const cfCountryHeader = headersList.get("cf-ipcountry");

  const cfCountry = cfCountryHeader || "US";

  // Fetch data server-side with 2-hour cache
  const result = await getFeaturedCampaigns(cfCountry);

  const campaigns = result?.success
    ? (result.data.campaigns || []).map(mapCampaignData)
    : [];

  const hasMoreRecords = result?.data?.isMoreRecordsExist || false;

  return (
    <FeaturedCampaignsClient
      initialCampaigns={campaigns}
      initialHasMore={hasMoreRecords}
      cfCountry={cfCountry}
    />
  );
}
