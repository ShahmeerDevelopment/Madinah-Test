"use client";

import { useEffect, useRef } from "react";

const gaTrackingId = process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const fbPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const googleAdId = process.env.NEXT_PUBLIC_GOOGLE_AD;
const growthbookHost =
  process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || "https://cdn.growthbook.io";
const growthbookKey = process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY || "";

// Delay before loading analytics (ms) - allows LCP to complete first
// Increased to 4000ms to ensure LCP and TBT metrics are captured first
const ANALYTICS_DELAY = 4000;

/**
 * Load scripts after a delay to ensure LCP completes first
 * This eliminates score variability caused by third-party scripts
 */
function loadAnalyticsScripts() {
  // 1. GTM
  if (gtmId && !window.__gtmLoaded) {
    window.__gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
    const gtmScript = document.createElement("script");
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(gtmScript);
  }

  // 2. Google Analytics (gtag)
  if (gaTrackingId && !window.__gtagLoaded) {
    window.__gtagLoaded = true;
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaTrackingId);
    if (googleAdId) {
      window.gtag("config", googleAdId);
    }
  }

  // 3. GrowthBook config
  if (!window.GROWTHBOOK_CONFIG) {
    window.GROWTHBOOK_CONFIG = {
      apiHost: growthbookHost,
      clientKey: growthbookKey,
      enableVisualEditor: true,
      visualEditorOptions: { trackClicks: true, defaultEditor: "wysiwyg" },
      trackingCallback: (experiment, result) => {
        if (window.gtag) {
          window.gtag("event", "experiment_viewed", {
            experiment_id: experiment.key,
            variation_id: result.key,
          });
        }
        if (window.posthog) {
          window.posthog.capture("$experiment_viewed", {
            experiment_id: experiment.key,
            variation_id: result.key,
          });
        }
      },
    };
  }

  // 4. Facebook Pixel - load after analytics
  if (fbPixelId && !window.__fbLoaded) {
    window.__fbLoaded = true;
    setTimeout(() => {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js",
      );
      window.fbq("init", fbPixelId);
      window.fbq("track", "PageView");
    }, 1000); // Additional 1s delay for FB pixel
  }
}

export default function ClientScripts() {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    // Strategy: Load analytics AFTER LCP is likely complete
    // Use requestIdleCallback if available, otherwise setTimeout
    const loadAfterDelay = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(loadAnalyticsScripts, {
          timeout: ANALYTICS_DELAY + 1000,
        });
      } else {
        setTimeout(loadAnalyticsScripts, ANALYTICS_DELAY);
      }
    };

    // Wait for page to be fully interactive
    if (document.readyState === "complete") {
      setTimeout(loadAfterDelay, ANALYTICS_DELAY);
    } else {
      window.addEventListener("load", () => setTimeout(loadAfterDelay, 500));
    }
  }, []);

  // Recurly loaded on-demand when needed (donation pages)
  useEffect(() => {
    // Expose a function to load Recurly when needed
    window.loadRecurly = () => {
      if (window.recurlyReady || window.__recurlyLoading)
        return Promise.resolve();
      window.__recurlyLoading = true;

      return new Promise((resolve) => {
        // Load Apple Pay SDK first (skip if already registered to avoid duplicate customElements.define)
        if (!customElements.get("apple-pay-button")) {
          const applePayScript = document.createElement("script");
          applePayScript.src =
            "https://applepay.cdn-apple.com/jsapi/v1.1.0/apple-pay-sdk.js";
          applePayScript.async = true;
          document.head.appendChild(applePayScript);
        }

        // Load Recurly
        const script = document.createElement("script");
        script.src = "https://js.recurly.com/v4/recurly.js";
        script.async = true;
        script.onload = () => {
          window.recurlyReady = true;
          window.dispatchEvent(new CustomEvent("recurlyReady"));
          resolve();
        };
        document.head.appendChild(script);
      });
    };
  }, []);

  // No script tags rendered - all loaded programmatically after delay
  return null;
}
