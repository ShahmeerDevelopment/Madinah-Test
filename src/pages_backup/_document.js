import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Critical font preloading for LCP optimization */}
        {/* <FontPreloadLinks /> */}
        {/* Google Tag Manager - moved to Script component below */}
        {/* Critical preconnects only (max 4) - for LCP optimization */}
        <link
          rel="preconnect"
          href="https://madinah.s3.us-east-2.amazonaws.com"
        />
        <link rel="preconnect" href="https://cdn.growthbook.io" />
        {/* DNS prefetch for other domains - lower priority than preconnect */}
        <link rel="dns-prefetch" href="https://i.ibb.co" />
        <link rel="dns-prefetch" href="https://madinah.s3.amazonaws.com" />
        <link
          rel="dns-prefetch"
          href="https://madinah-development.s3.us-east-1.amazonaws.com"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* Note: LCP image preload handled automatically by Next.js Image with priority prop */}
        <link
          rel="preload"
          as="fetch"
          href="/_next/image"
          crossOrigin="anonymous"
        />
        {/* <meta
          name="og:image"
          content="https://madinah.s3.us-east-2.amazonaws.com/test1.png"
        /> */}
      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

        <Main />
        <NextScript />
        {/* Google Tag Manager Script - Using afterInteractive for better LCP */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
      </body>
    </Html>
  );
}
