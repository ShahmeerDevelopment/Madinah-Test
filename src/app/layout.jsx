import localFont from "next/font/local";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ClientScripts from "./ClientScripts";
import Script from "next/script";
import { Providers } from "./providers";
import fs from "fs";
import path from "path";

// Critical font - preloaded for LCP optimization
const leagueSpartan = localFont({
  src: "../../public/fonts/league-spartan-latin.woff2",
  weight: "100 900",
  variable: "--font-league-spartan",
  display: "swap",
  preload: true, // Preload critical font for LCP
  adjustFontFallback: "Arial", // Reduce CLS with fallback metrics
});

// Non-critical font - lazy loaded to not block LCP
const notoSansArabic = localFont({
  src: "../../public/fonts/noto-sans-arabic.woff2",
  variable: "--font-noto-sans-arabic",
  weight: "400 700",
  display: "swap", // Ensure swap is used to prevent invisible text
  preload: false, // Don't preload - not critical for initial LCP (English site)
});

export const metadata = {
  title: "Madinah",
  description: "Trusted fundraising for all of life's moments...",
  icons: {
    icon: "https://madinah.s3.us-east-2.amazonaws.com/favicon.ico",
    shortcut: "https://madinah.s3.us-east-2.amazonaws.com/favicon.ico",
  },
  openGraph: {
    images: ["https://madinah.s3.us-east-2.amazonaws.com/test1.png"],
  },
  robots:
    process.env.NEXT_PUBLIC_ENV === "production"
      ? "index, follow"
      : "noindex, nofollow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // Read globals.css for full inlining to eliminate Discovery Latency (~400ms)
  // This is a server-side operation that only happens during build/request
  const cssPath = path.join(process.cwd(), "src/styles/globals.css");
  let criticalCss = "";
  try {
    criticalCss = fs.readFileSync(cssPath, "utf8");
  } catch (err) {
    console.error("Failed to read globals.css for inlining:", err);
  }

  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical image origins - significantly faster than dns-prefetch */}
        <link rel="preconnect" href="https://madinah.s3.us-east-2.amazonaws.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://madinah.s3.amazonaws.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ibb.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Full CSS Inlining to break critical request chains and eliminate Discovery Latency */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />

        {/* DNS prefetch for secondary external domains */}
        <link
          rel="dns-prefetch"
          href="https://madinah-development.s3.us-east-1.amazonaws.com"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://js.recurly.com" />
        <link rel="dns-prefetch" href="https://cdn.growthbook.io" />
      </head>
      <body
        className={`${leagueSpartan.variable}`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* Facebook noscript */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <Providers>
          <AppRouterCacheProvider options={{ key: "mui" }}>
            {children}
          </AppRouterCacheProvider>
        </Providers>
        <ClientScripts />
      </body>
    </html>
  );
}
