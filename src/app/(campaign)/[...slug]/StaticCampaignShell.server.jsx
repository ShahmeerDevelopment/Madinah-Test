/**
 * StaticCampaignShell - Server Component for Static Shell (PPR)
 *
 * This component renders the LEFT SIDE of the campaign page as a static shell.
 * It uses 'use cache' functions and does NOT access runtime APIs like headers().
 *
 * The static shell appears on initial paint, while dynamic content streams in.
 */

import { notFound } from "next/navigation";

import {
  getStaticCampaignDataCached,
} from "./campaign-cache.server";
import { formatTimestamp } from "@/utils/helpers";
import { DEFAULT_AVATAR, RANDOM_URL } from "@/config/constant";

import CampaignLeftSide from "./components/CampaignLeftSide.server";

/**
 * Transform raw campaign data into props for CampaignLeftSide
 */
function transformCampaignData(campaignDetails, slugPath) {
  const {
    updatedAt,
    createdAt,
    videoLinks = [],
    coverImageUrl,
    status,
  } = campaignDetails;

  const whenPublished =
    updatedAt || createdAt ? formatTimestamp(updatedAt || createdAt) : "";
  const coverMedia = coverImageUrl || videoLinks[0]?.url || "";
  const campaignStatus =
    status === "pending-approval"
      ? "Pending"
      : status === "active"
        ? "Active"
        : "";

  return {
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
    recentSupporters: [], // Will be fetched dynamically
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
}

/**
 * StaticCampaignShell - Renders the static left side of the campaign page
 *
 * This is the main static shell that appears on initial paint.
 * It does NOT access headers() or other runtime APIs.
 * Token is NOT passed here to keep it truly static for initial paint.
 */
export default async function StaticCampaignShell({ params, searchParams }) {
  // Await params (Promise in Next.js 15+)
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;

  // Widget mode is handled client-side or via dynamic content only
  // Static shell renders blindly to enable Initial Paint caching

  // Fetch campaign data using static cache (no token - truly static for initial paint)
  const campaignResult = await getStaticCampaignDataCached(slugPath);
  const campaignDetails = campaignResult?.data?.data?.campaignDetails;
  const httpStatus = campaignResult?.status;

  // Show 404 page if campaign not found (API returns 404) or campaign details are null
  if (httpStatus === 404 || !campaignDetails) {
    notFound();
  }

  // Transform data for components
  const campaignData = transformCampaignData(campaignDetails, slugPath);

  // LCP image URL for preloading
  const lcpImageUrl =
    campaignData.thumbnailCoverImageUrl || campaignData.coverImageUrl;

  return (
    <>
      {/* LEFT SIDE - Static Shell */}
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
        recentSupportersCount={campaignData.recentSupportersCount}
        slugPath={slugPath}
        campaignId={campaignData.campaignId}
        randomToken={slugPath}
        // previewMode={isPreviewMode}
        currency={campaignData.currency}
        currencyCode={campaignData.units}
        initialGoal={campaignData.initialGoal}
        raisedPercentage={campaignData.raisedPercentage}
        oneTimeDonation={campaignData.oneTimeDonation}
        recurringDonation={campaignData.recurringDonation}
        checkStatus={campaignData.checkStatus}
        gradingLevelsList={campaignData.gradingLevelsList}
        currencyConversionIdCampaign={campaignData.currencyConversionIdCampaign}
        url={campaignData.url}
        campaignEndDate={campaignData.campaignEndDate}
        meta={campaignData.meta}
      />
    </>
  );
}

/**
 * Export campaign data transformer for use by dynamic content component
 */
export { transformCampaignData };
