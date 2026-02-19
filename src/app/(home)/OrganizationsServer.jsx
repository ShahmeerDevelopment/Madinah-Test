/**
 * Server Component - Organizations Section with Cache Components (PPR)
 *
 * Next.js 16+ PPR Strategy for Initial Paint:
 * - Default export is SYNC - renders static structure immediately in initial HTML
 * - Static parts (section container, title) are in the first paint
 * - Only the data-dependent content is wrapped in Suspense with skeleton
 * - OrganizationsContent uses 'use cache' for data fetching
 *
 * This ensures:
 * - Section title "Organizations we work with" appears in initial HTML
 * - Organization logos stream in after data loads
 * - Skeleton shows only for the logos area during loading
 */

import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { OrganizationsSection } from "./HomeSections.client";
import { CACHE_LIFE_TIME } from "@/config/constant";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CLIENT_API_KEY;

/**
 * Fetch organizations - called from cached component
 */
async function getOrganizations() {
  const url = `${API_URL}${API_VERSION}campaign/charity/organizations?searchText=&limit=100&offset=0`;

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
    console.error("Error fetching organizations:", error);
    return { success: false, data: { charityOrganizations: [] } };
  }
}

/**
 * Default export is SYNC - renders static structure immediately.
 * Section container and title appear in initial HTML.
 * Only the organizations logos are wrapped in Suspense.
 */
export default function OrganizationsServer() {
  return (
    <section
      style={{
        width: "100%",
        height: "max-content",
        zIndex: 1,
        boxShadow: "0px 0px 100px 0px #0000000F",
        borderRadius: "40px",
        backgroundColor: "#FFFFFF",
        padding: "32px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* STATIC: Header renders immediately in initial HTML */}
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
          Organizations we work with
        </h2>
      </div>

      {/* DYNAMIC: Organizations logos stream in with skeleton fallback */}
      <Suspense fallback={<OrganizationsLogosSkeleton />}>
        <OrganizationsContent />
      </Suspense>

      <style>{`
        @media (max-width: 600px) {
          section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * Skeleton for just the organizations logos (not the whole section)
 */
function OrganizationsLogosSkeleton() {
  return (
    <div
      className="orgs-skeleton"
      style={{ display: "flex", gap: "16px", overflow: "hidden" }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div
          key={i}
          style={{
            width: "80px",
            height: "58px",
            minWidth: "80px",
            borderRadius: "8px",
            background:
              "linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite ease-in-out",
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 600px) {
          .orgs-skeleton {
            overflow-x: auto !important;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .orgs-skeleton::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Async content component - fetches and renders organizations
 * Uses 'use cache' for data caching
 */
async function OrganizationsContent() {
  "use cache";
  // Cache for 2 days (stale after 1 day, revalidate at 2 days)
  cacheLife({
    stale: CACHE_LIFE_TIME,
    revalidate: CACHE_LIFE_TIME,
    expire: 86400,
  });
  // Tag for on-demand revalidation
  cacheTag("organizations");

  const result = await getOrganizations();

  const organizations = result?.success
    ? (result.data.charityOrganizations || []).map((org) => ({
      id: org._id,
      image: org.imageUrl,
      payload: org,
    }))
    : [];

  return <OrganizationsSection organizations={organizations} />;
}
