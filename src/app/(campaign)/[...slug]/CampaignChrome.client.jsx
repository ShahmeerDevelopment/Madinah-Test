"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/molecules/navbar/Navbar";
import Footer from "@/components/molecules/footer/Footer";
import GdprBanner from "@/components/UI/GdprBanner";
import NavbarSkeleton from "@/components/skeletons/NavbarSkeleton";

const DEFAULT_STYLES = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
  maxWidth: "1120px",
  padding: 0,
  margin: "0 auto",
  marginTop: "64px",
  minHeight: "calc(100vh - 236px - 60px)",
};

const WIDGET_STYLES = {
  width: "100%",
  height: "100%",
  margin: 0,
  padding: 0,
  minHeight: "auto",
  marginTop: "64px",
};

/**
 * CampaignChrome - Client component wrapper for campaign layout
 *
 * This component is wrapped in Suspense by the layout because:
 * - Navbar uses useSearchParams() (runtime API)
 * - Footer uses new Date() (runtime API)
 *
 * For PPR with Cache Components, any component using runtime APIs
 * must be inside a Suspense boundary.
 */
export default function CampaignChrome({ children }) {
  const pathname = usePathname();

  // Note: We don't use useSearchParams here to reduce Suspense triggers
  // Widget mode detection update...
  const isWidgetMode = false; // Default

  // Campaign slug pages use #f7f7f7 background
  const backgroundColor = "#f7f7f7";

  // Show footer for campaign pages (not donate-now, etc.)
  const withFooter =
    !pathname?.includes("/donate-now") &&
    !pathname?.includes("/your-donations") &&
    !pathname?.includes("/setup-transfers") &&
    !pathname?.includes("/create-campaign");

  return (
    <div
      style={{
        background: isWidgetMode ? "#ffffff" : backgroundColor,
        position: "relative",
      }}
    >
      {/* Suspense required because Navbar uses useSearchParams */}
      <Suspense fallback={<NavbarSkeleton />}>
       <Navbar isWidgetMode={isWidgetMode} /> 
      </Suspense>

      <main style={isWidgetMode ? WIDGET_STYLES : DEFAULT_STYLES}>
        {children}
      </main>

      {/* Suspense required because Footer uses new Date() and useSearchParams */}
      {withFooter && !isWidgetMode && (
        <Suspense fallback={<div style={{ height: "200px" }} />}>
          <Footer /> 
        </Suspense>
      )}

      {!isWidgetMode && <GdprBanner />}
    </div>
  );
}
