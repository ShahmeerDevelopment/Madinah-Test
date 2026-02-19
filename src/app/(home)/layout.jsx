import { Suspense } from "react";
import HomeProviders from "./HomeProviders.client";
import HomeChrome from "./HomeChrome.client";
// Import HeroServer directly - it's the only truly static component outside Suspense
import HeroServer from "../server-components/HeroServer";
import FooterServer from "./FooterServer";
import NavbarServer from "@/components/molecules/navbar/NavbarServer";

// LCP image paths for preload
const LCP_IMAGE = "/assets/images/background_poster.png";
const LCP_IMAGE_MOBILE = "/assets/images/background_poster_mobile.webp";

/**
 * Home Layout - Static shell with streaming content
 *
 * Next.js 16+ Architecture:
 * - HeroServer renders immediately in static shell
 * - loading.jsx provides the skeleton UI (wrapped automatically by Next.js in Suspense)
 * - children (page content) streams in when ready
 * - Footer/Navbar deferred with Suspense
 *
 * The loading.jsx file is the official Next.js convention for showing loading UI.
 * It automatically wraps the page in a Suspense boundary.
 */
export default function HomeLayout({ children }) {
  return (
    <>
      {/* 
        LCP Image Preload with responsive hints
        - Mobile (<=640px): Preload 22KB WebP for fast LCP
        - Desktop: Preload full PNG for quality
      */}
      <link
        rel="preload"
        as="image"
        href={LCP_IMAGE_MOBILE}
        type="image/webp"
        media="(max-width: 640px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={LCP_IMAGE}
        media="(min-width: 641px)"
        fetchPriority="high"
      />
      <div
        className="home-layout"
        style={{
          background: "#fbfbfb",
          position: "relative",
        }}
      >
        {/* STATIC SHELL: Hero renders immediately */}
        <HeroServer />

        {/* 
        PAGE CONTENT: Next.js automatically wraps this in Suspense
        using loading.jsx as the fallback
      */}
        {children}

        {/* Mobile footer styles moved to globals.css for TBT optimization */}

        {/* Footer and Navbar - deferred */}
        <Suspense fallback={null}>
          <HomeProviders>
            <HomeChrome
              footerSection={<FooterServer />}
              navbarSection={<NavbarServer />}
            />
          </HomeProviders>
        </Suspense>
      </div>
    </>
  );
}
