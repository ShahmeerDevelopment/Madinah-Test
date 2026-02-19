/**
 * DynamicCampaignContent - Server Component for Dynamic Content (Streamed)
 *
 * This component handles the DYNAMIC parts of the campaign page:
 * - Right side donation panel (desktop)
 * - Mobile bottom bar
 *
 * It accesses headers() and is wrapped in Suspense, so it streams in
 * after the static shell.
 */

import { headers } from "next/headers";
import { Suspense } from "react";

import {
  getCampaignDataCached,
  getCampaignDataCachedGivingLevels,
  getCampaignDataCachedLeftSide,
  getCampaignDataCachedStats,
  getStaticCampaignDataCached,
} from "./campaign-cache.server";
import { formatTimestamp } from "@/utils/helpers";
import { DEFAULT_AVATAR, RANDOM_URL } from "@/config/constant";

import CampaignRightSideServer from "./components/CampaignRightSide.server";
import MobileBottomBar from "./components/MobileBottomBar.client";
import CampaignVisitTracker from "./components/CampaignVisitTracker.client";
import CampaignDetailsHydrator from "./components/CampaignDetailsHydrator.client";
import CampaignPageClient from "./CampaignPage.client";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import {
  RightSideSkeleton,
  MobileDonationBarSkeleton,
} from "./components/CampaignSkeletons";

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
 * Transform campaign data to component props
 */
function transformCampaignData(
  campaignDetails,
  campaignDetailsStats,
  campaignGivingLevels,
  slugPath,
) {
  const {
    updatedAt,
    createdAt,
    videoLinks = [],
    coverImageUrl,
  } = campaignDetails;

  const whenPublished =
    updatedAt || createdAt ? formatTimestamp(updatedAt || createdAt) : "";
  const coverMedia = coverImageUrl || videoLinks[0]?.url || "";
  const campaignStatus =
    campaignDetailsStats.status === "pending-approval"
      ? "Pending"
      : campaignDetailsStats.status === "active"
        ? "Active"
        : "";

  return {
    campaignId: campaignDetails._id,
    title: campaignDetails.title,
    subTitle: campaignDetails.subTitle,
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
    currency: campaignDetailsStats.currencySymbol,
    initialGoal: campaignDetailsStats.targetAmount,
    isEmailVerified: campaignDetails?.campaignerId?.isEmailVerified,
    url: RANDOM_URL + slugPath,
    status: campaignStatus,
    checkStatus: campaignDetailsStats?.status,
    email: campaignDetails.campaignerId?.email,
    gradingLevelsList: campaignGivingLevels?.givingLevels || [],
    currencyConversionIdCampaign: campaignDetails.currencyConversionId || null,
    symbol: campaignDetailsStats.currencySymbol,
    units: campaignDetailsStats.amountCurrency,
    isoAlpha2: campaignDetails.countryId?.isoAlpha2,
    country: campaignDetails.countryId?.name,
    currencyCountry: campaignDetails.currencyCountry,
    recentSupporters: [],
    isZakatEligible: campaignDetailsStats.isZakatEligible,
    recurringDonation: campaignDetailsStats.isRecurringDonation,
    oneTimeDonation: campaignDetailsStats.isOneTimeDonation,
    isTaxDeductable: campaignDetailsStats?.isTaxDeductable || null,
    meta: campaignDetails?.meta || [],
    recentSupportersCount: campaignDetailsStats?.recentSupportersCount || 0,
    raisedPercentage:
      campaignDetailsStats.collectedAmount / campaignDetailsStats.targetAmount,
    campaignEndDate: campaignDetailsStats?.endDate,
    announcements: campaignDetails?.announcements,
    gtmId: campaignDetails?.gtmId || campaignDetails?.campaignerId?.gtmId,
    slugPath,
  };
}

/**
 * DynamicCampaignContent - Renders dynamic right side and mobile bar
 *
 * This component accesses headers() for IP/country-based personalization.
 * It should be wrapped in Suspense by the parent page.
 */
export default async function DynamicCampaignContent({
  params,
  searchParams,
  token,
}) {
  // Await params and searchParams (Promises in Next.js 15+)
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams?.slug;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;

  // Access headers - this is the dynamic part that causes streaming
  const headersList = await headers();

  // Extract headers for personalization
  const cfCountry = headersList.get("cf-ipcountry");
  const cfIp = headersList.get("cf-connecting-ip");
  const forwarded = headersList.get("x-forwarded-for");

  // Get IPv4 address
  let ip = cfIp ? getIPv4(cfIp) : null;
  if (!ip && forwarded) ip = getIPv4(forwarded);
  if (!ip) ip = "0.0.0.0";

  // Extract query params
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

  const utmParams = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referral,
  };

  const isWidgetMode = widget === "true" && embedded === "true";
  const isPreviewMode = preview === "true";

  // Fetch campaign data with IP for personalization
  const [
    campaigLeftSideResult,
    campaignStatsResult,
    campaignGivingLevelsResult,
  ] = await Promise.allSettled([
    getCampaignDataCachedLeftSide(slugPath, cfCountry),
    getCampaignDataCachedStats(slugPath, cfCountry),
    getCampaignDataCachedGivingLevels(slugPath, cfCountry),
  ]);

  // Extract campaign and status
  let campaignDetails = null;
  let campaignDetailsStats = null;
  let campaignGivingLevels = null;
  let httpStatus = null;
  if (campaigLeftSideResult.status === "fulfilled") {
    campaignDetails = campaigLeftSideResult.value?.data?.data?.campaignDetails;
    httpStatus = campaigLeftSideResult.value?.status;
  }
  if (campaignStatsResult.status === "fulfilled") {
    campaignDetailsStats =
      campaignStatsResult.value?.data?.data?.campaignDetails;
    // httpStatus = campaignStatsResult.value?.status;
  }
  if (campaignGivingLevelsResult.status === "fulfilled") {
    campaignGivingLevels =
      campaignGivingLevelsResult.value?.data?.data?.campaignDetails;
    // httpStatus = campaignGivingLevelsResult.value?.status;
  }

  // Show 404 page if campaign not found (API returns 404) or campaign details are null
  if (httpStatus === 404 || !campaignDetails) {
    return null; // Static shell already handled notFound()
  }

  // Merge all 3 API responses into a combined campaignDetails for Redux hydration
  // This ensures giving levels, stats, and donation type flags are all available in Redux
  const mergedCampaignDetails = {
    ...campaignDetails, // left section: title, story, images, campaignerId, etc.
    ...campaignDetailsStats, // stats: status, targetAmount, isRecurringDonation, isOneTimeDonation, etc.
    ...campaignGivingLevels, // giving levels: givingLevels array, isCustomDonationsAllowed, currencyConversionId, etc.
  };

  // Transform data
  const campaignData = transformCampaignData(
    campaignDetails,
    campaignDetailsStats,
    campaignGivingLevels,
    slugPath,
  );

  // For widget mode, use the full client component
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
        gtmId={campaignData.gtmId}
      />
    );
  }

  // Render dynamic right side and mobile bar
  return (
    <>
      {/* Hydrate mergedCampaignDetails into Redux for all downstream components */}
      <CampaignDetailsHydrator campaignDetails={mergedCampaignDetails} />

      {/* Track campaign visit */}
      <CampaignVisitTracker
        randomToken={slugPath}
        utm_source={utm_source}
        utm_medium={utm_medium}
        utm_campaign={utm_campaign}
        utm_term={utm_term}
        utm_content={utm_content}
        referral={referral}
        src={src}
        previewMode={isPreviewMode}
        gtmId={campaignData.gtmId}
      />
      {/* RIGHT SIDE - Server Component - Desktop Only */}
      <BoxComponent
        sx={{
          display: { xs: "none", md: "block" },
          width: "31.508%",
          flexShrink: 0,
          position: { xs: "relative", md: "sticky" },
          top: { xs: "auto", md: "88px" },
          alignSelf: "flex-start",
          height: "fit-content",
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
        />
      </Suspense>
    </>
  );
}
