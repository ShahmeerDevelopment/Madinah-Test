"use client";

/**
 * MobileDonationProgressBar - Client Component for mobile donation progress
 * This component renders the donation progress bar on mobile view inside the left side section
 * 
 * Architecture Note:
 * - Initial props come from StaticCampaignShell (no country code - default currency)
 * - Once DynamicCampaignContent streams in, CampaignDetailsHydrator puts country-aware
 *   stats into Redux. This component reads from Redux to show the correct currency/amounts.
 * 
 * Next.js 16 Optimization:
 * - Uses CSS-based responsive visibility instead of useResponsiveScreen hook
 * - Defers loading further to reduce TBT on mobile
 * - Uses requestIdleCallback with longer timeout for non-critical UI
 */

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

// Lazy load the donation progress bar with prefetch disabled
const NewDonationProgressBar = lazy(
  () =>
    import(
      /* webpackPrefetch: false */
      "@/components/advance/DonationProgressBar/NewDonationProgressBar"
    )
);

// Skeleton animation styles
const skeletonPulse = {
  animation: "pulse 1.5s ease-in-out infinite",
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.4 },
    "100%": { opacity: 1 },
  },
};

const skeletonBase = {
  backgroundColor: "#e0e0e0",
  borderRadius: "4px",
  ...skeletonPulse,
};

// Mobile Progress Bar Skeleton - matches actual progress bar structure
const LoadingSpinner = ({ height = "150px" }) => (
  <BoxComponent
    sx={{ 
      p: 2, 
      minHeight: height,
      display: "flex",
      flexDirection: "column",
      gap: 2
    }}
  >
    {/* Progress bar */}
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "8px",
        width: "100%",
        borderRadius: "4px",
      }}
    />
    {/* Amount and percentage row */}
    <BoxComponent
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "28px",
          width: "120px",
        }}
      />
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "18px",
          width: "60px",
        }}
      />
    </BoxComponent>
    {/* Supporters count */}
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "16px",
        width: "150px",
      }}
    />
  </BoxComponent>
);

export default function MobileDonationProgressBar({
  currency: propCurrency,
  initialGoal: propInitialGoal,
  raisedPercentage: propRaisedPercentage = 0,
  recentSupportersCount: propRecentSupportersCount = 0,
  oneTimeDonation: propOneTimeDonation,
  recurringDonation: propRecurringDonation,
  checkStatus: propCheckStatus,
  previewMode = false,
}) {
  const [shouldLoad, setShouldLoad] = useState(false);

  // Read country-aware stats from Redux (hydrated by CampaignDetailsHydrator with cfCountry data)
  // Falls back to static shell props if Redux data isn't available yet
  const campaignDetails = useSelector((state) => state.donation?.campaignDetails);

  const currency = campaignDetails?.currencySymbol || propCurrency;
  const initialGoal = campaignDetails?.targetAmount ?? propInitialGoal;
  const raisedPercentage = campaignDetails?.targetAmount
    ? campaignDetails.collectedAmount / campaignDetails.targetAmount
    : propRaisedPercentage;
  const recentSupportersCount = campaignDetails?.recentSupportersCount ?? propRecentSupportersCount;
  const oneTimeDonation = campaignDetails?.isOneTimeDonation ?? propOneTimeDonation;
  const recurringDonation = campaignDetails?.isRecurringDonation ?? propRecurringDonation;
  const checkStatus = campaignDetails?.status || propCheckStatus;

  useEffect(() => {
    // Defer loading significantly to reduce TBT - this is below the fold on mobile
    // Use longer delays since progress bar is not critical for initial interaction
    const timeoutId = setTimeout(() => {
      if (typeof window === "undefined") return;

      if ("requestIdleCallback" in window) {
        const idleId = window.requestIdleCallback(
          () => setShouldLoad(true),
          { timeout: 2500 } // Increased timeout - let LCP complete first
        );
        return () => window.cancelIdleCallback?.(idleId);
      }

      setShouldLoad(true);
    }, 300); // Increased initial delay

    return () => clearTimeout(timeoutId);
  }, []);

  const defaultValue = useMemo(
    () => Math.round(initialGoal * raisedPercentage),
    [initialGoal, raisedPercentage]
  );

  // Use CSS-based responsive visibility instead of JS (reduces TBT)
  return (
    <BoxComponent 
      sx={{ 
        marginBottom: "16px", 
        marginTop: "16px",
        // CSS-based responsive visibility (better for TBT than useResponsiveScreen)
        display: { xs: "block", md: "none" },
      }}
    >
      {!shouldLoad ? (
        <LoadingSpinner />
      ) : (
        <Suspense fallback={<LoadingSpinner />}>
          <NewDonationProgressBar
            recentSupportersCount={recentSupportersCount}
            isAnimation={false}
            oneTimeDonation={oneTimeDonation}
            recurringDonation={recurringDonation}
            defaultValue={defaultValue}
            maxVal={+initialGoal > 0 ? initialGoal : 1}
            isStatic={false}
            minVal={0}
            currency={previewMode ? "$" : currency}
            status={checkStatus}
            getValue={() => {}}
          />
        </Suspense>
      )}
    </BoxComponent>
  );
}
