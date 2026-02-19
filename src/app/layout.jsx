import "@/styles/globals.css";
import localFont from "next/font/local";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ClientScripts from "./ClientScripts";
import Script from "next/script";
// import { Provider } from "react-redux";
// import { wrapper } from "@/store/store";
import { Providers } from "./providers";

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
  // const { store } = wrapper.useWrappedStore(pageProps);
  return (
    <html lang="en">
      <head>
        {/* Inline Critical CSS to break critical request chains and reduce Discovery Latency */}
        <style dangerouslySetInnerHTML={{
          __html: `
          *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; font-family: var(--font-league-spartan), Arial, sans-serif; }
          .root { position: relative; min-height: 100vh; min-width: 100vw; }
          body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; box-sizing: border-box; overflow-x: hidden; padding-right: 0 !important; }
          .ppr-skeleton-container { width: 100%; position: relative; transform: translateY(-140px); margin-bottom: -140px; display: flex; flex-direction: column; gap: 56px; }
          .ppr-skeleton-section { height: max-content; z-index: 1; box-shadow: 0px 0px 100px 0px rgba(0, 0, 0, 0.06); border-radius: 40px; background-color: #ffffff; padding: 32px; display: flex; flex-direction: column; gap: 32px; }
          @media (max-width: 600px) { .ppr-skeleton-container { transform: none !important; margin-bottom: 0 !important; } .ppr-skeleton-section { padding: 16px !important; } }
          .ppr-skeleton-element { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200px 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
          @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        `}} />

        {/* DNS prefetch for external domains - lower priority than LCP images */}
        <link rel="dns-prefetch" href="https://madinah.s3.us-east-2.amazonaws.com" />
        <link rel="dns-prefetch" href="https://i.ibb.co" />
        <link rel="dns-prefetch" href="https://madinah.s3.amazonaws.com" />
        <link
          rel="dns-prefetch"
          href="https://madinah-development.s3.us-east-1.amazonaws.com"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://js.recurly.com" />
        <link rel="dns-prefetch" href="https://cdn.growthbook.io" />
        {/* Note: LCP image preload handled automatically by Next.js Image with priority prop */}
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
