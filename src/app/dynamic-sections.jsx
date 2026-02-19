"use client";

/**
 * Dynamic Sections Container
 * Handles client-side interactivity for sections that need it
 * while preserving streaming benefits
 */
import dynamic from "next/dynamic";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import StackComponent from "@/components/atoms/StackComponent";

// Dynamic imports for heavy components
const VoiceOfMadinah = dynamic(
  () => import("@/components/UI/Home/VoiceOfMadinah"),
  {
    loading: () => <VoicesSkeleton />,
    ssr: true,
  }
);

const BigCarousal = dynamic(
  () => import("@/components/UI/Home/BigCarousal"),
  {
    loading: () => <CarouselSkeleton />,
    ssr: true,
  }
);

const YearInHelpReview = dynamic(
  () => import("@/components/UI/Home/YearInHelpReview"),
  {
    loading: () => <BlogSkeleton />,
    ssr: true,
  }
);

const OrganizationsArr = dynamic(
  () => import("@/components/UI/Home/OrganizationsArr"),
  {
    loading: () => <OrgsSkeleton />,
    ssr: true,
  }
);

const OurCategories = dynamic(
  () => import("@/components/UI/Home/OurCategories"),
  {
    loading: () => <CategoriesSkeleton />,
    ssr: true,
  }
);

const FundraiseForAnyone = dynamic(
  () => import("@/components/UI/Home/FundraiseForAnyone"),
  {
    loading: () => <FundraiseSkeleton />,
    ssr: true,
  }
);

// Skeleton components
function VoicesSkeleton() {
  return (
    <StackComponent direction="row" spacing="16px">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonComponent
          key={i}
          width="100px"
          height="120px"
          sx={{ borderRadius: "12px" }}
        />
      ))}
    </StackComponent>
  );
}

function CarouselSkeleton() {
  return (
    <StackComponent direction="row" spacing="24px" sx={{ mt: "56px" }}>
      {[1, 2, 3].map((i) => (
        <SkeletonComponent
          key={i}
          width="350px"
          height="280px"
          sx={{ borderRadius: "12px", flexShrink: 0 }}
        />
      ))}
    </StackComponent>
  );
}

function BlogSkeleton() {
  return (
    <StackComponent direction="row" spacing="24px">
      <SkeletonComponent
        width="50%"
        height="300px"
        sx={{ borderRadius: "12px" }}
      />
      <SkeletonComponent
        width="50%"
        height="300px"
        sx={{ borderRadius: "12px" }}
      />
    </StackComponent>
  );
}

function OrgsSkeleton() {
  return (
    <StackComponent direction="row" spacing="16px">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <SkeletonComponent
          key={i}
          width="80px"
          height="58px"
          sx={{ borderRadius: "8px" }}
        />
      ))}
    </StackComponent>
  );
}

function CategoriesSkeleton() {
  return (
    <StackComponent direction="row" spacing="16px">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonComponent
          key={i}
          width="200px"
          height="150px"
          sx={{ borderRadius: "12px" }}
        />
      ))}
    </StackComponent>
  );
}

function FundraiseSkeleton() {
  return (
    <StackComponent direction="column" spacing="16px">
      {[1, 2, 3].map((i) => (
        <SkeletonComponent
          key={i}
          width="100%"
          height="80px"
          sx={{ borderRadius: "12px" }}
        />
      ))}
    </StackComponent>
  );
}

// Export components for use in HomeUI
export {
  VoiceOfMadinah,
  BigCarousal,
  YearInHelpReview,
  OrganizationsArr,
  OurCategories,
  FundraiseForAnyone,
  VoicesSkeleton,
  CarouselSkeleton,
  BlogSkeleton,
  OrgsSkeleton,
  CategoriesSkeleton,
  FundraiseSkeleton,
};
