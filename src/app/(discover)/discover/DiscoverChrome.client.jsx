"use client";

import React, { Suspense } from "react";
// import { useSearchParams } from "next/navigation";

import Navbar from "@/components/molecules/navbar/Navbar";
import Footer from "@/components/molecules/footer/Footer";
import GdprBanner from "@/components/UI/GdprBanner";
import DiscoverInit from "./DiscoverInit.client";

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
 * DiscoverChrome - Client component wrapper for discover layout
 * Provides Navbar, Footer, and main content area
 */
export default function DiscoverChrome({ children }) {
  // const searchParams = useSearchParams();

  // Check if this is widget mode
  const isWidgetMode = false;
    // searchParams.get("widget") === "true" &&
    // searchParams.get("embedded") === "true";

  const backgroundColor = "#fbfbfb";

  return (
    <div
      style={{
        background: isWidgetMode ? "#ffffff" : backgroundColor,
        position: "relative",
      }}
    >
      {/* DiscoverInit runs initialization that requires Redux context */}
      <DiscoverInit />
      <Suspense>
      <Navbar isWidgetMode={isWidgetMode} />
      </Suspense>
      <main style={isWidgetMode ? WIDGET_STYLES : DEFAULT_STYLES}>
        {children}
      </main>
      {!isWidgetMode && 
      <Suspense>
      <Footer />
      </Suspense>
      }
      {!isWidgetMode && <GdprBanner />}
    </div>
  );
}
