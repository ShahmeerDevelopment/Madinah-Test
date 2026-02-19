"use client";

import dynamic from "next/dynamic";
import Private from "@/Layouts/Private";
import { Suspense } from "react";
import { useInjectStatisticsSlices } from "@/hooks/useInjectReducers";

// Lazy load the heavy component
const StatisticsUI = dynamic(() => import("@/components/UI/Statistics"), {
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
        width: "100%",
      }}
    >
      Loading statistics...
    </div>
  ),
  ssr: false, // Statistics data is user-specific, no need for SSR
});

const Statistics = () => {
  // Inject statistics slice on mount
  const isStatsReady = useInjectStatisticsSlices();

  return (
    <Private withFooter={true} withSidebar={true}>
      <Suspense fallback={<div>Loading statistics...</div>}>
        <StatisticsUI />
      </Suspense>
    </Private>
  );
};

export default Statistics;
