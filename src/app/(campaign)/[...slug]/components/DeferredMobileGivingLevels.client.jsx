"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

// Use dynamic import with ssr: false to prevent server rendering
// This component is only visible on mobile and can load after LCP
const MobileGivingLevels = dynamic(() => import("./MobileGivingLevels.client"), {
  ssr: false,
  loading: () => (
    <BoxComponent
      sx={{
        display: { xs: "block", md: "none" },
        minHeight: "220px",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
      }}
    />
  ),
});

export default function DeferredMobileGivingLevels(props) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Significantly defer this non-critical component to reduce TBT
    // Mobile giving levels are below the fold and not critical for first interaction
    const timeoutId = setTimeout(() => {
      if (typeof window === "undefined") return;

      if ("requestIdleCallback" in window) {
        const idleId = window.requestIdleCallback(
          () => setShouldRender(true),
          { timeout: 3000 } // Increased - let critical content load first
        );
        return () => window.cancelIdleCallback?.(idleId);
      }

      setShouldRender(true);
    }, 400); // Increased initial delay

    return () => clearTimeout(timeoutId);
  }, []);

  if (!shouldRender) {
    return (
      <BoxComponent
        sx={{
          display: { xs: "block", md: "none" },
          minHeight: "220px",
          backgroundColor: "#f5f5f5",
          borderRadius: "12px",
        }}
      />
    );
  }

  return <MobileGivingLevels {...props} />;
}
