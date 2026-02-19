// components/Layout.js
import React, { useState, useEffect } from "react";
// import Navbar from "./molecules/navbar/Navbar";
// import Footer from "./molecules/footer/Footer";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
// import { scrollToTop } from "../utils/helpers";
import Navbar from "@/components/molecules/navbar/Navbar";
import Footer from "@/components/molecules/footer/Footer";
import GdprBanner from "@/components/UI/GdprBanner";
import { Router } from "next/router";
// import { getCookie } from "cookies-next";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
// import Custom404 from "@/pages/404";
// import errorPage from "@";

// const Navbar = dynamic(() => import("@/components/molecules/navbar/Navbar"), {
//   ssr: false,
// });
// import useAuthManager from "../hooks/useAuthManager"; // Assuming you've extracted auth logic into a custom hook

const Hero = dynamic(() => import("@/components/UI/Home/Hero"));

const VERSION1_STYLES = {
  display: "block",
  // flexDirection: "column",
  // justifyContent: "end",
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

const RootLayout = ({ children }) => {
  const { pathname, query } = useRouter();
  const [showHero, setShowHero] = useState(pathname === "/");
  const [isMounted, setIsMounted] = useState(false);
  const [currentStyles, setCurrentStyles] = useState(DEFAULT_STYLES);
  const { isSmallScreen } = useResponsiveScreen();

  // Check if this is widget mode
  const isWidgetMode = query.widget === "true" && query.embedded === "true";

  useEffect(() => {
    setIsMounted(true);
    // const experimentalFeature = getCookie("abtesting");
    // const isVersion1 = experimentalFeature === "donation_version_1";
    setCurrentStyles(
      isSmallScreen && pathname.includes("/donate-now")
        ? VERSION1_STYLES
        : DEFAULT_STYLES,
    );
  }, [isSmallScreen, pathname]);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setShowHero(false);
    };

    const handleRouteChangeComplete = (url) => {
      setShowHero(url === "/");
    };

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     scrollToTop();
  //   }
  // }, [pathname]);

  // const withHeroSection = pathname === "/"; // Example: Only show Hero on the homepage
  const withFooter =
    !pathname.includes("/admin") &&
    !pathname.includes("/your-donations") &&
    !pathname.includes("/setup-transfers") &&
    !pathname.includes("/create-campaign");
  // !(<Custom404 />);
  // Example: Don't show Footer on admin and your-donations pages

  const backgroundColor =
    pathname.includes("/about-us") ||
    pathname.includes("/account-settings") ||
    pathname.includes("/campaign") ||
    pathname.includes("/campaign-success") ||
    pathname.includes("/category") ||
    pathname.includes("/create-campaign") ||
    pathname.includes("/dashboard") ||
    pathname.includes("/discover") ||
    pathname.includes("/donate-now") ||
    pathname.includes("/donation-success") ||
    pathname.includes("/donations") ||
    pathname.includes("/email-verification") ||
    pathname.includes("/how-it-works") ||
    pathname.includes("/invite-user") ||
    pathname.includes("/preview") ||
    pathname.includes("/privacy-policy") ||
    pathname.includes("/reset-password") ||
    pathname.includes("/setup-transfers") ||
    pathname.includes("/statistics") ||
    pathname.includes("/summary") ||
    pathname.includes("/terms-and-conditions") ||
    pathname.includes("/your-donations") ||
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
};

export default RootLayout;
