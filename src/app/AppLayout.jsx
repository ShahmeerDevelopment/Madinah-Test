"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/molecules/navbar/Navbar";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

// Lazy load non-critical components to reduce TBT
const Footer = dynamic(() => import("@/components/molecules/footer/Footer"), {
  ssr: false,
  loading: () => null,
});

const GdprBanner = dynamic(
  () => import("@/components/UI/GdprBanner"),
  {
    ssr: false,
    loading: () => null,
  }
);

const Hero = dynamic(() => import("@/components/UI/Home/Hero"));

const VERSION1_STYLES = {
  display: "block",
  width: "100%",
  maxWidth: "1120px",
  padding: 0,
  margin: "0 auto",
  marginTop: "55px",
  minHeight: "calc(100vh - 325px - 60px)",
};

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

export default function AppLayout({
  children,
  withHeroSection = false,
  withFooter: withFooterProp = true,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showHero, setShowHero] = useState(withHeroSection && pathname === "/");
  const [isMounted, setIsMounted] = useState(false);
  const [currentStyles, setCurrentStyles] = useState(DEFAULT_STYLES);
  const { isSmallScreen } = useResponsiveScreen();

  // Check if this is widget mode
  const isWidgetMode =
    searchParams.get("widget") === "true" &&
    searchParams.get("embedded") === "true";

  useEffect(() => {
    setIsMounted(true);
    setCurrentStyles(
      isSmallScreen && pathname?.includes("/donate-now")
        ? VERSION1_STYLES
        : DEFAULT_STYLES
    );
  }, [isSmallScreen, pathname]);

  useEffect(() => {
    // Update hero visibility when pathname changes
    setShowHero(withHeroSection && pathname === "/");
  }, [pathname, withHeroSection]);

  const withFooter =
    withFooterProp &&
    !pathname?.includes("/admin") &&
    !pathname?.includes("/your-donations") &&
    !pathname?.includes("/setup-transfers") &&
    !pathname?.includes("/create-campaign");

  const backgroundColor =
    pathname?.includes("/about-us") ||
    pathname?.includes("/account-settings") ||
    pathname?.includes("/campaign") ||
    pathname?.includes("/campaign-success") ||
    pathname?.includes("/category") ||
    pathname?.includes("/create-campaign") ||
    pathname?.includes("/dashboard") ||
    pathname?.includes("/discover") ||
    pathname?.includes("/donate-now") ||
    pathname?.includes("/donation-success") ||
    pathname?.includes("/donations") ||
    pathname?.includes("/email-verification") ||
    pathname?.includes("/how-it-works") ||
    pathname?.includes("/invite-user") ||
    pathname?.includes("/preview") ||
    pathname?.includes("/privacy-policy") ||
    pathname?.includes("/reset-password") ||
    pathname?.includes("/setup-transfers") ||
    pathname?.includes("/statistics") ||
    pathname?.includes("/summary") ||
    pathname?.includes("/terms-and-conditions") ||
    pathname?.includes("/your-donations") ||
    pathname === "/"
      ? "#fbfbfb"
      : "#f7f7f7";

  return (
    <div
      style={{
        background: isWidgetMode ? "#ffffff" : backgroundColor,
        position: "relative",
      }}
    >
      <Navbar isWidgetMode={isWidgetMode} />
      {showHero && !isWidgetMode && <Hero />}
      <main
        style={
          isMounted
            ? isWidgetMode
              ? {
                  width: "100%",
                  height: "100%",
                  margin: 0,
                  padding: 0,
                  minHeight: "auto",
                  marginTop: "64px",
                }
              : currentStyles
            : DEFAULT_STYLES
        }
        data-version={
          isMounted && currentStyles === VERSION1_STYLES ? "v1" : "default"
        }
      >
        {children}
      </main>
      {withFooter &&
        isMounted &&
        currentStyles !== VERSION1_STYLES &&
        !isWidgetMode && <Footer />}
      {!isWidgetMode && <GdprBanner />}
    </div>
  );
}
