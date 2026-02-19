"use client";

import React from "react";
import Script from "next/script";

const GoogleTagManager = () => (
  <>
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_AD}`}
    />
    <Script id="google-tag-manager" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_AD}');
      `}
    </Script>
  </>
);

export default GoogleTagManager;
