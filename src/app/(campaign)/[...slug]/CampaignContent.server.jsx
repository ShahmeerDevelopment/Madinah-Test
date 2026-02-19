/**
 * CampaignContent - Async Server Component for PPR (Partial Prerendering)
 *
 * Next.js 16+ PPR Strategy with Cache Components:
 * - Uses 'use cache' directive in data fetching functions for static shell
 * - cacheLife for cache duration (15 min for campaign, 5 min for supporters)
 * - cacheTag for on-demand revalidation via revalidateTag()
 * - Skeleton fallbacks stream in while cached content resolves
 *
 * Pattern:
 * 1. page.jsx (sync) wraps this in Suspense with CampaignPageSkeleton
 * 2. This component extracts runtime data (headers)
 * 3. Passes values to cached functions (slug, ip, country become cache keys)
 * 4. Inner Suspense boundaries for left/right sides stream progressively
 *
 * Benefits:
 * - Static shell with skeletons at build time
 * - Cached data streams in quickly (15-min cache)
 * - On-demand revalidation: revalidateTag('campaign-{slug}')
 */

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Use cached functions for PPR with 'use cache' directive
import {
  getCampaignDataCached,
  getSupportersCached,
} from "./campaign-cache.server";

// import { formatTimestamp } from "@/utils/helpers";
import { DEFAULT_AVATAR, RANDOM_URL } from "@/config/constant";

// Import server and client components
import CampaignLeftSide from "./components/CampaignLeftSide.server";
import CampaignRightSideServer from "./components/CampaignRightSide.server";
import MobileBottomBar from "./components/MobileBottomBar.client";
import {
  LeftSideSkeleton,
  RightSideSkeleton,
  MobileDonationBarSkeleton,
} from "./components/CampaignSkeletons";
import CampaignPageClient from "./CampaignPage.client";
import StackComponent from "@/components/atoms/StackComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

/**
 * Helper function to validate IPv4
 */
function getIPv4(ip) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ip) return null;
  const addresses = ip.split(/,\s*/);
  for (const addr of addresses) {
    if (ipv4Regex.test(addr)) return addr;
  }
  return null;
}

/**
 * Container styles for layout
 */
const containerStyles = {
  maxWidth: "1120px",
  width: "100%",
  margin: { xs: "0 auto", md: "24px auto" },
  padding: { xs: "16px", md: "0" },
  minHeight: "calc(100vh - 272px)",
};

export default async function CampaignContent({ params, searchParams, token }) {
  // Await params and searchParams (they're Promises in Next.js 15+)
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams?.slug;
  const headersList = await headers();

  // Extract headers
  const cfCountry = headersList.get("cf-ipcountry");

  // Extract UTM and other query params
  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referral,
    fbclid,
    src,
    widget,
    embedded,
    preview,
    announcementToken,
  } = resolvedSearchParams || {};

  // Get slug path for caching
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;

  // Fetch campaign data and supporters in parallel using cached functions
  // The 'use cache' directive in these functions enables PPR static shell
  const [campaignResult, supportersResult] = await Promise.allSettled([
    getCampaignDataCached(slugPath, cfCountry),
    getSupportersCached(slugPath, 4, 0),
  ]);

  // Handle campaign data
  let campaignDetails = null;
  if (campaignResult.status === "fulfilled") {
    campaignDetails = campaignResult.value?.data?.data?.campaignDetails;
  } else {
    console.error("Failed to fetch campaign data:", campaignResult.reason);
  }

  if (!campaignDetails) {
    notFound();
  }

  // Handle supporters data
  let recentSupporters = [];
  if (supportersResult.status === "fulfilled") {
    recentSupporters =
      supportersResult.value?.data?.data?.recentSupporters || [];
  }

  // Transform campaign data for components
  const {
    updatedAt,
    createdAt,
    videoLinks = [],
    coverImageUrl,
    status,
  } = campaignDetails;

  const whenPublished = updatedAt || createdAt ? updatedAt || createdAt : "";

  const coverMedia = coverImageUrl || videoLinks[0]?.url || "";

  const campaignStatus =
    status === "pending-approval"
      ? "Pending"
      : status === "active"
        ? "Active"
        : "";

  // slugPath already defined above for caching

  // Build campaign data object for all components
  const campaignData = {
    campaignId: campaignDetails._id,
    title: campaignDetails.title,
    subTitle: campaignDetails.subTitle,
    altTitle: campaignDetails?.altTitle || null,
    altSubTitle: campaignDetails?.altSubTitle || null,
    altStory: campaignDetails?.altStory || null,
    altCoverImageUrl: campaignDetails?.altCoverImageUrl || null,
    altVideoLinksUrl:
      campaignDetails?.altVideoLinks?.length > 0
        ? campaignDetails?.altVideoLinks[0]?.url
        : null,
    coverMedia,
    coverImageUrl: campaignDetails.coverImageUrl,
    thumbnailCoverImageUrl: campaignDetails?.thumbnailCoverImageUrl || null,
    organizerPhoto:
      campaignDetails.campaignerId?.profileImage || DEFAULT_AVATAR,
    whenPublished,
    story: campaignDetails.story,
    categoryName: campaignDetails.categoryId?.name,
    creator:
      `${campaignDetails.campaignerId?.firstName || ""} ${campaignDetails.campaignerId?.lastName || ""}`.trim(),
    countryName: campaignDetails.countryId?.name,
    currency: campaignDetails.currencySymbol,
    initialGoal: campaignDetails.targetAmount,
    isEmailVerified: campaignDetails?.campaignerId?.isEmailVerified,
    url: RANDOM_URL + slugPath,
    status: campaignStatus,
    checkStatus: campaignDetails?.status,
    email: campaignDetails.campaignerId?.email,
    gradingLevelsList: campaignDetails.givingLevels || [],
    currencyConversionIdCampaign: campaignDetails.currencyConversionId || null,
    symbol: campaignDetails.currencySymbol,
    units: campaignDetails.amountCurrency,
    isoAlpha2: campaignDetails.countryId?.isoAlpha2,
    country: campaignDetails.countryId?.name,
    currencyCountry: campaignDetails.currencyCountry,
    recentSupporters: recentSupporters,
    isZakatEligible: campaignDetails.isZakatEligible,
    recurringDonation: campaignDetails.isRecurringDonation,
    oneTimeDonation: campaignDetails.isOneTimeDonation,
    isTaxDeductable: campaignDetails?.isTaxDeductable || null,
    meta: campaignDetails?.meta || [],
    recentSupportersCount: campaignDetails?.recentSupportersCount || 0,
    raisedPercentage:
      campaignDetails.collectedAmount / campaignDetails.targetAmount,
    campaignEndDate: campaignDetails?.endDate,
    announcements: campaignDetails?.announcements,
    slugPath,
  };

  // Check widget mode
  const isWidgetMode = widget === "true" && embedded === "true";
  const isPreviewMode = preview === "true";

  // For widget mode, use the full client component (backward compatibility)
  if (isWidgetMode) {
    return (
      <CampaignPageClient
        campaignValuesAsProps={campaignData}
        slug={slugPath}
        cfCountry={cfCountry}
        utm_source={utm_source}
        utm_medium={utm_medium}
        utm_campaign={utm_campaign}
        utm_term={utm_term}
        utm_content={utm_content}
        referral={referral}
        fbclid={fbclid}
        src={src}
        widget={widget}
        embedded={embedded}
        preview={preview}
        announcementToken={announcementToken}
      />
    );
  }

  // PPR Strategy: Static shell with streaming content
  // Determine LCP image URL for preloading (prefer thumbnail for faster load)
  const lcpImageUrl =
    campaignData.thumbnailCoverImageUrl || campaignData.coverImageUrl;

  return (
    <>
      {/* Preload LCP image to reduce resource load delay */}
      {lcpImageUrl && (
        <link
          rel="preload"
          as="image"
          href={lcpImageUrl}
          fetchPriority="high"
        />
      )}
      <StackComponent
        direction={{ xs: "column", md: "row" }}
        spacing="24px"
        justifyContent="flex-start"
        sx={containerStyles}
      >
        {/* LEFT SIDE - Server Component */}
        <Suspense fallback={<LeftSideSkeleton />}>
          <CampaignLeftSide
            title={campaignData.title}
            subTitle={campaignData.subTitle}
            story={campaignData.story}
            coverMedia={campaignData.coverMedia}
            coverImageUrl={campaignData.coverImageUrl}
            thumbnailCoverImageUrl={campaignData.thumbnailCoverImageUrl}
            organizerPhoto={campaignData.organizerPhoto}
            creator={campaignData.creator}
            countryName={campaignData.countryName}
            whenPublished={campaignData.whenPublished}
            isEmailVerified={campaignData.isEmailVerified}
            isZakatEligible={campaignData.isZakatEligible}
            isTaxDeductable={campaignData.isTaxDeductable}
            categoryName={campaignData.categoryName}
            announcements={campaignData.announcements}
            recentSupporters={campaignData.recentSupporters}
            recentSupportersCount={campaignData.recentSupportersCount}
            campaignId={campaignData.campaignId}
            randomToken={slugPath}
            previewMode={isPreviewMode}
            currency={campaignData.currency}
            currencyCode={campaignData.units}
            initialGoal={campaignData.initialGoal}
            raisedPercentage={campaignData.raisedPercentage}
            oneTimeDonation={campaignData.oneTimeDonation}
            recurringDonation={campaignData.recurringDonation}
            checkStatus={campaignData.checkStatus}
            gradingLevelsList={campaignData.gradingLevelsList}
            currencyConversionIdCampaign={
              campaignData.currencyConversionIdCampaign
            }
            url={campaignData.url}
            campaignEndDate={campaignData.campaignEndDate}
            meta={campaignData.meta}
          />
        </Suspense>

        {/* RIGHT SIDE - Server Component - Desktop Only */}
        <BoxComponent
          sx={{
            display: { xs: "none", md: "block" },
            width: "31.508%",
            position: "relative",
          }}
        >
          <Suspense fallback={<RightSideSkeleton />}>
            <CampaignRightSideServer
              campaignId={campaignData.campaignId}
              title={campaignData.title}
              currency={campaignData.currency}
              currencyCode={campaignData.units}
              initialGoal={campaignData.initialGoal}
              raisedPercentage={campaignData.raisedPercentage}
              recentSupportersCount={campaignData.recentSupportersCount}
              isZakatEligible={campaignData.isZakatEligible}
              isTaxDeductable={campaignData.isTaxDeductable}
              oneTimeDonation={campaignData.oneTimeDonation}
              recurringDonation={campaignData.recurringDonation}
              gradingLevelsList={campaignData.gradingLevelsList}
              url={campaignData.url}
              checkStatus={campaignData.checkStatus}
              campaignEndDate={campaignData.campaignEndDate}
              randomToken={slugPath}
              meta={campaignData.meta}
              currencyConversionIdCampaign={
                campaignData.currencyConversionIdCampaign
              }
              previewMode={isPreviewMode}
              campaignDetails={campaignDetails}
            />
          </Suspense>
        </BoxComponent>

        {/* MOBILE - Fixed Bottom Bar */}
        <Suspense fallback={<MobileDonationBarSkeleton />}>
          <MobileBottomBar
            campaignData={campaignData}
            cfCountry={cfCountry}
            utmParams={{
              utm_source,
              utm_medium,
              utm_campaign,
              utm_term,
              utm_content,
              referral,
              fbclid,
              src,
            }}
            preview={preview}
            announcementToken={announcementToken}
            campaignDetails={campaignDetails}
          />
        </Suspense>
      </StackComponent>
    </>
  );
}
