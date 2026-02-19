"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * PostHog Wrapper Component
 * Lazy loads PostHog after window.onload to reduce initial bundle size (~100KB savings)
 * PostHog is loaded on client-side only after all page resources have loaded (onload event)
 * This ensures analytics don't interfere with critical page load metrics (LCP, FCP, TBT)
 */
const PostHogWrapper = ({ children }) => {
  const [PostHogProvider, setPostHogProvider] = useState(null);
  const [posthogClient, setPosthogClient] = useState(null);

  useEffect(() => {
    // Lazy load PostHog only after window.onload event
    const loadPostHog = async () => {
      try {
        // Dynamically import both posthog-js and posthog-js/react
        const [posthogModule, posthogReactModule] = await Promise.all([
          import("posthog-js"),
          import("posthog-js/react"),
        ]);

        const posthog = posthogModule.default;
        const { PostHogProvider: Provider } = posthogReactModule;

        // Initialize PostHog
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
          person_profiles: "identified_only",
          loaded: (ph) => {
            if (process.env.NODE_ENV === "development") ph.debug();
          },
        });

        // Store on window for other components that might need it
        if (typeof window !== "undefined") {
          window.posthog = posthog;
        }

        setPosthogClient(posthog);
        setPostHogProvider(() => Provider);
        console.log("PostHog initialized successfully");
      } catch (error) {
        console.error("Error loading PostHog:", error);
      }
    };

    // Lazy load: wait for window.onload event before loading PostHog
    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        // Page already loaded, use requestIdleCallback for best performance
        if (window.requestIdleCallback) {
          window.requestIdleCallback(loadPostHog, { timeout: 3000 });
        } else {
          setTimeout(loadPostHog, 500);
        }
      } else {
        // Wait for window.onload event
        const onLoad = () => {
          // Add additional delay after onload to ensure all critical resources are processed
          if (window.requestIdleCallback) {
            window.requestIdleCallback(loadPostHog, { timeout: 3000 });
          } else {
            setTimeout(loadPostHog, 1000);
          }
        };
        window.addEventListener("load", onLoad, { once: true });

        // Cleanup listener if component unmounts before load
        return () => window.removeEventListener("load", onLoad);
      }
    }
  }, []);

  // If PostHog isn't loaded yet, just render children without the provider
  if (!PostHogProvider || !posthogClient) {
    return <>{children}</>;
  }

  // Once PostHog is loaded, wrap children with PostHogProvider
  return <PostHogProvider client={posthogClient}>{children}</PostHogProvider>;
};

PostHogWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PostHogWrapper;
