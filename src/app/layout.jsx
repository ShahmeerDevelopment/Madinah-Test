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
  display: "swap",
  preload: false, // Don't preload - not critical for initial paint
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
        {/* Critical preconnects only (max 4) - for LCP optimization */}
        <link
          rel="preconnect"
          href="https://madinah.s3.us-east-2.amazonaws.com"
        />
        {/* <link
          rel="preconnect"
          href="https://cdn.growthbook.io"
          crossOrigin="anonymous"
        /> */}
        {/* DNS prefetch for other domains - lower priority */}
        <link rel="dns-prefetch" href="https://i.ibb.co" />
        <link rel="dns-prefetch" href="https://madinah.s3.amazonaws.com" />
        <link
          rel="dns-prefetch"
          href="https://madinah-development.s3.us-east-1.amazonaws.com"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* <link rel="dns-prefetch" href="https://www.clarity.ms" /> */}
        <link rel="dns-prefetch" href="https://js.recurly.com" />
        {/* Note: LCP image preload handled automatically by Next.js Image with priority prop */}
      </head>
      <body
        className={`${leagueSpartan.variable} ${notoSansArabic.variable}`}
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
