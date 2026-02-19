"use client";

import React, { useEffect } from "react";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { growthbook, setGrowthBookNavigation } from "@/utils/growthbook";
import { useRouter } from "next/navigation";

const GBProvider = ({ children }) => {
  const router = useRouter();

  // Initialize router for navigation
  useEffect(() => {
    // Set up Next.js navigation
    setGrowthBookNavigation(router);
  }, [router]);

  // Update GrowthBook URL when route changes
  useEffect(() => {
    const updateGrowthBookURL = () => {
      if (typeof window !== "undefined") {
        growthbook.setURL(window.location.href);
      }
    };

    // Initial URL setup
    updateGrowthBookURL();

    // Subscribe to route change events and update GrowthBook
    router.events.on("routeChangeComplete", updateGrowthBookURL);

    return () => {
      router.events.off("routeChangeComplete", updateGrowthBookURL);
    };
  }, [router]);

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

        // Set attributes for consistent user experience
        growthbook.setAttributes({
          id: visitorId,
          url: window.location.href,
          userAgent: navigator.userAgent,
          // Add any other attributes you want to make available in GrowthBook dashboard
        });

        // Initialize GrowthBook
        growthbook.init();
      } catch (error) {
        console.error("Failed to initialize GrowthBook", error);
      }
    };

    configureGrowthBook();
  }, []);

  return (
    <GrowthBookProvider instance={growthbook}>{children}</GrowthBookProvider>
  );
};

export default GBProvider;
