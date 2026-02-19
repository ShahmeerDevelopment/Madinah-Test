"use client";

/**
 * DonationProgressBar - Client wrapper for NewDonationProgressBar
 *
 * This is needed because the NewDonationProgressBar uses React hooks
 * and client-side animations (Lottie, requestAnimationFrame)
 */

import { lazy, Suspense } from "react";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";

// Lazy load the actual progress bar
const NewDonationProgressBar = lazy(
  () =>
    import("@/components/advance/DonationProgressBar/NewDonationProgressBar")
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

// Progress Bar Skeleton - matches NewDonationProgressBar structure
const ProgressBarSkeleton = () => (
  <BoxComponent sx={{ width: "100%", mb: 3 }}>
    {/* Amount raised skeleton */}
    <BoxComponent
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mb: 2,
      }}
    >
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "48px",
          width: "180px",
          borderRadius: "8px",
          mb: 1,
        }}
      />
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "20px",
          width: "220px",
          borderRadius: "4px",
        }}
      />
    </BoxComponent>

    {/* Progress bar skeleton */}
    <StackComponent direction="column" sx={{ width: "100%", mt: 1.5, mb: 2 }} spacing={1}>
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "12px",
          width: "100%",
          borderRadius: "6px",
        }}
      />
      {/* Supporters count skeleton */}
      <BoxComponent
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "20px",
            width: "120px",
            borderRadius: "4px",
          }}
        />
      </BoxComponent>
    </StackComponent>
  </BoxComponent>
);

export default function DonationProgressBarClient({
  recentSupportersCount,
  isAnimation = false,
  oneTimeDonation,
  recurringDonation,
  defaultValue,
  maxVal,
  isStatic = false,
  minVal = 0,
  currency,
  status,
}) {
  return (
    <Suspense fallback={<ProgressBarSkeleton />}>
      <NewDonationProgressBar
        recentSupportersCount={recentSupportersCount}
        isAnimation={isAnimation}
        oneTimeDonation={oneTimeDonation}
        recurringDonation={recurringDonation}
        defaultValue={defaultValue}
        maxVal={maxVal}
        isStatic={isStatic}
        minVal={minVal}
        currency={currency}
        status={status}
        getValue={() => {}}
      />
    </Suspense>
  );
}
