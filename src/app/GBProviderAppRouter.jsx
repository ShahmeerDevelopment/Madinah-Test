"use client";

import React, {Suspense, useEffect } from "react";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { growthbook } from "@/utils/growthbook";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Inner component that uses searchParams - requires Suspense boundary
 */
function GBProviderInner({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update GrowthBook URL when route changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      growthbook.setURL(window.location.href);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Configure GrowthBook for visual editor
    const configureGrowthBook = async () => {
      try {
        // Set up user attributes for consistent identification
        const userId = localStorage.getItem("userId");
        const visitorId =
          userId ||
          localStorage.getItem("gb_visitor_id") ||
          `visitor-${Math.random().toString(36).substring(2, 15)}`;

        // Store the visitor ID if we generated one
        if (!userId && !localStorage.getItem("gb_visitor_id")) {
          localStorage.setItem("gb_visitor_id", visitorId);
        }

        // Set attributes before loading
        growthbook.setAttributes({
          id: visitorId,
          deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
          url: window.location.href,
          path: window.location.pathname,
          host: window.location.host,
          query: window.location.search,
        });

        // Initialize GrowthBook with feature flags
        await growthbook.init({
          streaming: true,
        });
      } catch (error) {
        console.error("GrowthBook initialization error:", error);
      }
    };

    configureGrowthBook();
  }, []);

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}

/**
 * GrowthBook Provider for App Router
 * Uses next/navigation instead of next/router
 * Wrapped in Suspense for useSearchParams compatibility
 */
const GBProviderAppRouter = ({ children }) => {
  return (
    <Suspense fallback={<>{children}</>}>
    <GBProviderInner>{children}</GBProviderInner>
     </Suspense>
  );
};

export default GBProviderAppRouter;
