"use client";

import React from "react";
import Script from "next/script";
import { gtagWithConsent } from "@/utils/trackingPreventionUtils";

const GoogleAnalyticsHelmet = () => {
  // Initialize Google Analytics page view tracking
  const gaTrackingId = process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID;

  const trackPageView = React.useCallback(() => {
    gtagWithConsent("config", gaTrackingId, {
      page_path: window.location.pathname + window.location.search,
    });
  }, [gaTrackingId]);

  React.useEffect(() => {
    trackPageView(); // Track the initial page view
  }, [trackPageView]);

  return (
    <>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag; // Make gtag globally accessible
          gtag('js', new Date());
          gtag('config', '${gaTrackingId}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalyticsHelmet;
