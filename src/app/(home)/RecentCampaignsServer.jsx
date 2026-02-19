import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { BigCarousalSection } from "./HomeSections.client";
import { CACHE_LIFE_TIME } from "@/config/constant";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;

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

/**
 * Fetch recent campaigns - called from cached component
 */
async function getRecentCampaigns() {
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
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recent campaigns:", error);
    return { success: false, data: { campaigns: [] } };
  }
}

export default function RecentCampaignsServer() {
  return (
    <>
      <style>{`
        .recent-campaigns-section {
          width: 100%;
          height: max-content;
          z-index: 1;
          box-shadow: 0px 0px 100px 0px #0000000F;
          border-radius: 40px;
          background-color: #FFFFFF;
          padding: 32px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 0px;
        }
        @media (max-width: 600px) {
          .recent-campaigns-section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
      <section className="recent-campaigns-section">
        {/* STATIC: Header renders immediately */}
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
            Recent campaigns
          </h2>
        </div>

        {/* DYNAMIC: Campaign carousel - streams in */}
        <Suspense fallback={<RecentCampaignsCardsSkeleton />}>
          <RecentCampaignsContent />
        </Suspense>
      </section>
    </>
  );
}

// Skeleton for just the campaign cards
function RecentCampaignsCardsSkeleton() {
  return (
    <>
      {/* Desktop skeleton - horizontal row */}
      <div
        className="recent-skeleton-grid"
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "hidden",
          marginTop: "56px",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton-card"
            style={{
              minWidth: "280px",
              borderRadius: "16px",
              flexShrink: 0,
              background: "#ffffff",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div className="skeleton-image" />
            <div className="skeleton-title" />
            <div className="skeleton-subtitle" />
          </div>
        ))}
      </div>

      <style>{`
        .skeleton-card {
          box-sizing: border-box;
        }
        .skeleton-image {
          width: 100%;
          height: 154px;
          border-radius: 16px;
          background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite ease-in-out;
        }
        .skeleton-title {
          width: 80%;
          height: 22px;
          border-radius: 4px;
          background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite ease-in-out;
        }
        .skeleton-subtitle {
          width: 60%;
          height: 20px;
          border-radius: 4px;
          background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite ease-in-out;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 600px) {
          .recent-skeleton-grid {
            flex-direction: column !important;
          }
          .recent-skeleton-grid .skeleton-card {
            min-width: 100% !important;
            width: 100% !important;
          }
          .recent-skeleton-grid .skeleton-card:nth-child(n+4) {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Async content component - cached and streams in
 */
async function RecentCampaignsContent() {
  "use cache";
  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 300,
  });
  cacheTag("recent-campaigns");

  const result = await getRecentCampaigns();

  const campaigns = result?.success
    ? (result.data.campaigns || []).map((c) => ({
        id: c._id,
        title: c.title,
        subTitle: c.subTitle,
        image: c.coverImageUrl || getThumbnailUrl(c.videoLinks?.[0]?.url),
        raisedAmount: c.collectedAmount,
        raisedCurrency: c.amountCurrency,
        totalGoal: c.targetAmount,
        urlRedirect: c.randomToken,
      }))
    : [];

  return <BigCarousalSection campaigns={campaigns} />;
}
