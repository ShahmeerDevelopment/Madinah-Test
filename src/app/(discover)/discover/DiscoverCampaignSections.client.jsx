"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import WhiteFlexBackgroundLayout from "@/components/UI/Discover/UI/WhiteBackgroundLayout";

// Dynamic imports with ssr: false - allowed in Client Components
const FeaturedCampaigns = dynamic(
  () => import("@/components/UI/Discover/Subsections/FeaturedCampaigns"),
  {
    loading: () => <SkeletonComponent width="100%" height="300px" />,
    ssr: false,
  },
);

const TrendingCampaigns = dynamic(
  () => import("@/components/UI/Discover/Subsections/TrendingCampaigns"),
  {
    loading: () => <SkeletonComponent width="100%" height="300px" />,
    ssr: false,
  },
);

export function FeaturedCampaignsSection({ initialData }) {
  return (
    <WhiteFlexBackgroundLayout spacing="24px">
      <Suspense fallback={<SkeletonComponent width="100%" height="300px" />}>
        <FeaturedCampaigns initialData={initialData} />
      </Suspense>
    </WhiteFlexBackgroundLayout>
  );
}

export function TrendingCampaignsSection({ initialData }) {
  return (
    <WhiteFlexBackgroundLayout spacing="24px">
      <Suspense fallback={<SkeletonComponent width="100%" height="300px" />}>
        <TrendingCampaigns initialData={initialData} />
      </Suspense>
    </WhiteFlexBackgroundLayout>
  );
}
