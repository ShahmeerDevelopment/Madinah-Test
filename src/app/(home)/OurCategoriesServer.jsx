/**
 * Server Component - Our Categories Section with Cache Components (PPR)
 *
 * Next.js 16+ Cache Components Strategy:
 * - Static structure (title, container) renders immediately in initial paint
 * - Dynamic content wrapped in Suspense with skeleton fallback
 * - 'use cache' on the async content component for caching
 *
 * Benefits:
 * - Static elements in initial HTML (good LCP)
 * - Skeleton shows while data loads
 * - Cached content streams in fast after first load
 */

import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { OurCategoriesSection } from "./HomeSections.client";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CLIENT_API_KEY;

/**
 * Fetch categories - called from cached component
 */
async function getCategories() {
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
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: { categories: [] } };
  }
}

/**
 * Wrapper - renders static structure immediately
 */
export default function OurCategoriesServer() {
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
          Our Categories
        </h2>
      </div>

      {/* DYNAMIC: Categories carousel - streams in */}
      <Suspense fallback={<CategoriesCardsSkeleton />}>
        <CategoriesContent />
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

// Skeleton for just the category cards
function CategoriesCardsSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        overflowX: "hidden",
        flexWrap: "nowrap",
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="skeleton-category-card"
          style={{
            width: "163px",
            height: "223px",
            borderRadius: "16px",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background image skeleton */}
          <div className="skeleton-bg" />

          {/* Bottom white card with text */}
          <div
            style={{
              position: "absolute",
              top: "141px",
              left: "8.3px",
              bottom: "8px",
              right: "8.67px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div className="skeleton-title" />
            <div className="skeleton-subtitle" />
          </div>
        </div>
      ))}
      <style>{`
        .skeleton-bg {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite ease-in-out;
        }
        .skeleton-title {
          width: 90%;
          height: 22px;
          border-radius: 4px;
          background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite ease-in-out;
        }
        .skeleton-subtitle {
          width: 100%;
          height: 32px;
          border-radius: 4px;
          background: linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite ease-in-out;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * Async content component - cached
 */
async function CategoriesContent() {
  "use cache";
  cacheLife({
    stale: 60,
    revalidate: 60,
    expire: 300,
  });
  cacheTag("categories");

  const result = await getCategories();
  const categories = result?.success ? result.data.categories || [] : [];

  return <OurCategoriesSection categories={categories} />;
}
