"use client";

import StackComponent from "@/components/atoms/StackComponent";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Section from "./UI/Section";
import ArrowsLeftAndRight from "./UI/ArrowsLeftAndRight";
import OptionsForFeaturedCampaigns from "./UI/OptionsForFeaturedCampaigns";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import { getAllVisits, useGetAllCampaignsQuery } from "@/api/get-api-services";
import ExternalLink from "./UI/ExternalLink";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// =============================================================================
// STREAMING OPTIMIZATION: Dynamic Imports with Code Splitting
// =============================================================================
// These components are loaded dynamically to enable:
// 1. Code splitting - smaller initial bundle
// 2. Progressive loading - content streams in as ready
// 3. Better Core Web Vitals - faster LCP, better INP
// =============================================================================

// Loading skeletons for each dynamically loaded section
const VoiceOfMadinahSkeleton = () => (
  <div style={{ display: "flex", gap: "16px", overflow: "hidden", padding: "20px 0" }}>
    {[1, 2, 3].map((i) => (
      <div key={i} style={{ 
        minWidth: "300px", 
        height: "200px", 
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        borderRadius: "12px"
      }} />
    ))}
    <style jsx>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);

const BigCarousalSkeleton = () => (
  <div style={{ width: "100%", height: "400px", background: "#f0f0f0", borderRadius: "16px" }} />
);

const YearInHelpReviewSkeleton = () => (
  <div style={{ width: "100%", height: "430px", background: "#f0f0f0", borderRadius: "12px" }} />
);

const CategoriesSkeleton = () => (
  <div style={{ display: "flex", gap: "16px" }}>
    {[1, 2, 3].map((i) => (
      <div key={i} style={{ flex: 1, height: "120px", background: "#f0f0f0", borderRadius: "12px" }} />
    ))}
  </div>
);

const OrganizationsSkeleton = () => (
  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} style={{ width: "100px", height: "60px", background: "#f0f0f0", borderRadius: "8px" }} />
    ))}
  </div>
);

const FundraiseForAnyoneSkeleton = () => (
  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
    {[1, 2, 3].map((i) => (
      <div key={i} style={{ flex: "1 1 250px", height: "180px", background: "#f0f0f0", borderRadius: "12px" }} />
    ))}
  </div>
);

// Dynamic imports with loading states - enables streaming
const VoiceOfMadinah = dynamic(() => import("./VoiceOfMadinah"), {
  loading: () => <VoiceOfMadinahSkeleton />,
  ssr: true
});

const BigCarousal = dynamic(() => import("./BigCarousal"), {
  loading: () => <BigCarousalSkeleton />,
  ssr: true
});

const YearInHelpReview = dynamic(() => import("./YearInHelpReview"), {
  loading: () => <YearInHelpReviewSkeleton />,
  ssr: true
});

const OurCategories = dynamic(() => import("./OurCategories"), {
  loading: () => <CategoriesSkeleton />,
  ssr: true
});

const OrganizationsArr = dynamic(() => import("./OrganizationsArr"), {
  loading: () => <OrganizationsSkeleton />,
  ssr: true
});

const FundraiseForAnyone = dynamic(() => import("./FundraiseForAnyone"), {
  loading: () => <FundraiseForAnyoneSkeleton />,
  ssr: true
});

const HomeUI = ({
  mutatedCampaignsArr,
  loadingfeaturedCampaigns,
  hasErrorfeaturedCampaigns,
  increasePage,
  decreasePage,
  campaignsStillRemaining,
  currentPage,
  serverSections = {},
  // Server-fetched data to avoid client-side waterfalls
  carouselCampaigns = [],
  organizations = [],
  blogPost = null,
}) => {
  const utmParameters = useSelector((state) => state.utmParameters);
  const {
    data: categories,
    isLoading: loadingCategories,
    isError: hasErrorCategories,
    error: errorMessageCategories,
  } = useGetAllCampaignsQuery();

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral
    );
  }, []);

  const { isSmallScreen } = useResponsiveScreen();
  const router = useRouter();
  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* <Hero /> */}
      <StackComponent
        direction="column"
        sx={{
          position: "relative",
          transform: isSmallScreen ? "none" : "translateY(-140px)",
          marginBottom: isSmallScreen ? "none" : "-140px !important",
        }}
        spacing="56px"
      >
        <Section
          heading="Featured Campaigns"
          sectionRightActions={
            isSmallScreen ? null : (
              <ArrowsLeftAndRight
                disabledLeft={currentPage === 0}
                disabledRight={
                  !campaignsStillRemaining || loadingfeaturedCampaigns
                }
                rightAction={increasePage}
                leftAction={decreasePage}
              />
            )
          }
          direction="column"
          spacing="32px"
        >
          <OptionsForFeaturedCampaigns
            hasErrorfeaturedCampaigns={hasErrorfeaturedCampaigns}
            loadingfeaturedCampaigns={loadingfeaturedCampaigns}
            campaignsArr={mutatedCampaignsArr}
          />
        </Section>
        <Section
          heading="Voices of Madinah"
          // sectionRightActions={<ExternalLink>View more</ExternalLink>}
          direction="column"
          spacing="32px"
          style={{
            borderBottomRightRadius: isSmallScreen ? "0px" : "40px",
            borderTopRightRadius: isSmallScreen ? "0px" : "40px",
          }}
        >
          <VoiceOfMadinah />
        </Section>
        
        {/* Server-rendered section: Help happens here */}
        {serverSections.helpHappensHere || (
          <Section heading="Help happens here" direction="column" spacing={0}>
            {/* Fallback if server section not provided */}
          </Section>
        )}
        
        <Section withoutHeading spacing={0}>
          <YearInHelpReview serverBlogPost={blogPost} />
        </Section>
        <Section heading="Recent campaigns" direction="column" spacing={0}>
          <BigCarousal serverCampaigns={carouselCampaigns} />
        </Section>
        <Section heading="Our Categories" direction="column" spacing="24px">
          {loadingCategories ? (
            <StackComponent justifyContent="space-between">
              <SkeletonComponent
                sx={{ flexGrow: 1, borderRadius: "12px" }}
                height="100%"
              />
              <SkeletonComponent
                sx={{ flexGrow: 1, borderRadius: "12px" }}
                height="100%"
              />
              <SkeletonComponent
                sx={{ flexGrow: 1, borderRadius: "12px" }}
                height="100%"
              />
            </StackComponent>
          ) : (
            <>
              {hasErrorCategories ? (
                <>{errorMessageCategories}</>
              ) : (
                <OurCategories
                  categories={categories?.data?.data?.categories}
                />
              )}
            </>
          )}
        </Section>

        {/* Server-rendered section: How Madinah Works */}
        {serverSections.howMadinahWorks || (
          <Section
            heading="How Madinah Works"
            sectionRightActions={
              !isSmallScreen ? (
                <ExternalLink to="/how-it-works">Learn More</ExternalLink>
              ) : null
            }
            direction="column"
            spacing="0px"
          >
            {/* Fallback if server section not provided */}
          </Section>
        )}
        {/* Mobile learn more button - still client-side for interaction */}
        {isSmallScreen && (
          <ButtonComp
            onClick={() => router.push("/how-it-works")}
            sx={{ fontWeight: 500, fontSize: "14px", mt: "-40px" }}
            variant="text"
          >
            Learn more
          </ButtonComp>
        )}
        
        <Section
          heading="Organizations we work with"
          direction="column"
          spacing="24px"
          sx={{ display: { xs: "block" } }}
        >
          <OrganizationsArr serverOrganizations={organizations} />
        </Section>
        <Section
          heading="Fundraise for anyone"
          direction="column"
          spacing="24px"
        >
          <FundraiseForAnyone />
        </Section>
      </StackComponent>
    </div>
  );
};

export default HomeUI;
