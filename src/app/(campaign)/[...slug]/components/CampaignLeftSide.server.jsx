/**
 * CampaignLeftSide - Server Component with Next.js 16 PPR & Cache Strategy
 *
 * Next.js 16 Modern Rendering Architecture:
 * 1. PPR (Partial Prerendering): Static shell + streaming dynamic content
 * 2. "use cache" on async functions: Cache processed data, not JSX
 * 3. Suspense boundaries: Enable streaming and progressive hydration
 * 4. cacheLife/cacheTag: Fine-grained cache control (1 day for campaign content)
 *
 * Cache Strategy:
 * - Cacheable: Pure data processing (story HTML processing)
 * - NOT Cacheable: Components with client interactivity (media, mobile UI)
 * - Cached Server Components: Updates and Supporters sections use 'use cache'
 *   at component level for static shell with cached content
 *
 * Performance:
 * - LCP: Cover image prioritized with fetchPriority="high"
 * - CLS: Skeleton fallbacks for all async components
 * - TBT: Story deferred via requestIdleCallback
 * - Cache: Updates/Supporters use Next.js 16 Cache Components for static shells
 */

import { Suspense } from "react";

import { cacheLife, cacheTag, unstable_cache } from "next/cache";
import NextImage from "next/image";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import SafeImage from "@/components/atoms/SafeImage";
import { ASSET_PATHS } from "@/utils/assets";
import { formatTimestamp } from "@/utils/helpers";
import { processAndOptimizeStory } from "@/utils/processStoryHtml";
import { themeColors } from "@/config/themeColors";
import EmailButton from "@/components/advance/EmailButton";

// Client components - these need interactivity
import CampaignMedia from "./CampaignMedia.client";
import MobileDonationProgressBar from "./MobileDonationProgressBar.client";
import DeferredMobileGivingLevels from "./DeferredMobileGivingLevels.client";
import LazyStoryContent from "./LazyStoryContent.client";
import TimeAgo from "./TimeAgo.client";

// Cached Server Components for Updates and Supporters (Next.js 16 'use cache')
// These create static shells with cached content for better performance
import CachedUpdatesSection from "./CachedUpdatesSection.server";
import CachedSupportersSection from "./CachedSupportersSection.server";
import { getSupportersCached } from "../campaign-cache.server";

// Skeletons for client component Suspense fallbacks (reduces CLS)
import {
  CampaignMediaSkeleton,
  MobileDonationProgressSkeleton,
  MobileGivingLevelsSkeleton,
  UpdatesSkeleton,
  SupportersSkeleton,
} from "./CampaignSkeletons";
import DisplayEditorData from "@/components/atoms/displayEditorData/DisplayEditorData";

const flagIcon = "/assets/svg/common/Flag.svg";
// ============================================
// Helper Functions (defined first for use in cached functions)
// ============================================

function truncateHTML(html, maxLength = 900) {
  if (!html || html.length <= maxLength) return html;
  return html.substring(0, maxLength) + "...";
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
}

function formatName(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function getFullName(firstName, lastName) {
  const fn = formatName(firstName);
  const ln = formatName(lastName);
  const fullName = `${fn} ${ln}`.trim();
  if (fullName.length > 15) {
    return fullName.substring(0, 15) + "...";
  }
  return fullName || "Anonymous";
}

const DEFAULT_IMG =
  ASSET_PATHS.testimonials?.avatarPlaceholder ||
  "/assets/images/avatar-placeholder.png";
const testimonial_1 =
  ASSET_PATHS.testimonials?.avatarPlaceholder ||
  "/assets/images/avatar-placeholder.png";

const styles = {
  leftSide: {
    width: { xs: "100%", md: "66.33%" },
    // Prevent flex shrink to avoid layout shifts
    flexShrink: 0,
    borderRadius: "32px",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
    MsOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  heading: {
    color: "rgba(9, 9, 9, 1)",
    fontWeight: 500,
    fontSize: "32px",
    lineHeight: "48px",
    wordBreak: "auto-phrase",
    overflowWrap: "break-word",
  },
  announcementHeading: {
    color: "rgba(9,9,9,1)",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "32px",
    wordBreak: "auto-phrase",
    overflowWrap: "break-word",
  },
  organizerHeading: {
    color: "rgba(96, 96, 98, 1)",
    fontWeight: 500,
    fontSize: "22px",
    mb: "8px !important",
  },
  story: {
    "& p": {
      marginBottom: "16px",
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "8px",
      // CLS Prevention: Reserve space with aspect-ratio fallback
      aspectRatio: "16/9",
      objectFit: "cover",
      backgroundColor: "#f0f0f0",
    },
    // CLS Prevention: Ensure iframes (videos) have aspect ratio
    "& iframe": {
      maxWidth: "100%",
      aspectRatio: "16/9",
      height: "auto",
      borderRadius: "8px",
    },
  },
};

// ============================================
// Cached Data Processing (Next.js 16 "use cache")
// ============================================

/**
 * Cached Story Processing - Process story HTML with 1-day cache
 * This caches the expensive HTML processing, not the JSX
 */
async function getCachedProcessedStory(story, campaignId) {
  "use cache";
  cacheLife("campaignContent");
  cacheTag(`campaign-story-${campaignId}`);

  if (!story) return null;
  return processAndOptimizeStory(story);
}

/**
 * Cached Announcement Processing - Process updates with 1-day cache
 */
// async function getCachedAnnouncementsData(announcements, campaignId) {
//   "use cache";
//   cacheLife("campaignContent");
//   cacheTag(`campaign-updates-${campaignId}`);

//   if (!announcements || announcements.length === 0) return [];

//   return announcements.map((item) => ({
//     ...item,
//     truncatedBody: truncateHTML(item.body),
//     timeAgo: getTimeAgo(item.userUpdatedAt || item.createdAt),
//   }));
// }

// ============================================
// Static Sub-Components (Pure, No Data Fetching)
// ============================================

/**
 * Campaign Header - Title and subtitle rarely change
 */
function CampaignHeader({ title, subTitle }) {
  return (
    <>
      <StackComponent direction="column">
        <TypographyComp
          align="center"
          component="h1"
          style={{ lineHeight: 1 }}
          sx={styles.heading}
        >
          {title}
        </TypographyComp>
      </StackComponent>

      {subTitle && (
        <TypographyComp
          align="center"
          component="h4"
          sx={{
            marginTop: "4px !important",
            color: "rgba(161, 161, 168, 1)",
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: "22px",
            marginBottom: "16px !important",
          }}
        >
          {subTitle}
        </TypographyComp>
      )}
    </>
  );
}

/**
 * Campaign Story - Display story content using DisplayEditorData
 */
function CampaignStory({ story }) {
  if (!story) return null;

  return <DisplayEditorData isStory content={story} />;
}

/**
 * Organizer Info - Static content
 */
function OrganizerInfo({
  organizerPhoto,
  creator,
  countryName,
  whenPublished,
  isEmailVerified,
  isZakatEligible,
  isTaxDeductable,
  categoryName,
}) {
  const defaultAvatar =
    ASSET_PATHS.testimonials?.avatarPlaceholder ||
    "./assets/images/avatar-placeholder.png";

  return (
    <StackComponent direction="column">
      <BoxComponent
        sx={{
          marginLeft: "0px !important",
          marginBottom: "15px",
        }}
      >
        <EmailButton
          variant="text"
          email="admin@madinah.com"
          newTab={false}
          isReport
        >
          <NextImage src={flagIcon} alt="flag icon" width={16} height={16} />
          <TypographyComp
            sx={{
              color: "rgba(99, 99, 230, 1)",
              marginLeft: "20.67px",
              fontSize: "14px",
              lineHeight: "16px",
              fontWeight: 500,
              marginTop: "-23px",
            }}
          >
            Report fundraiser
          </TypographyComp>
        </EmailButton>
      </BoxComponent>
      <TypographyComp sx={styles.organizerHeading}>Organizer</TypographyComp>
      <StackComponent direction="column">
        <StackComponent
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            marginTop: "24px",
            width: "100%",

            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <SafeImage
              src={organizerPhoto || defaultAvatar}
              fallbackSrc={defaultAvatar}
              alt={creator || "Campaign Organizer"}
              width={56}
              height={56}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <StackComponent direction="column" spacing={0}>
              <StackComponent direction="row" alignItems="center" spacing={0.5}>
                <TypographyComp
                  sx={{
                    color: "rgba(96, 96, 98, 1)",
                    fontSize: "18px",
                    fontWeight: 500,
                    lineHeight: "22px",
                  }}
                >
                  {creator || "Anonymous"}
                </TypographyComp>
                {isEmailVerified && (
                  <span style={{ color: "#4CAF50", fontSize: "14px" }}>✓</span>
                )}
              </StackComponent>
              <TypographyComp
                sx={{
                  color: "rgba(161, 161, 168, 1)",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                {countryName && `${countryName}  `}
              </TypographyComp>
            </StackComponent>
          </div>
          <EmailButton
            variant="outlined"
            email={"example@somebody.com"}
            newTab={false}
          >
            Contact
          </EmailButton>
        </StackComponent>
        <BoxComponent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {whenPublished && (
            <>
              <TimeAgo dateString={whenPublished} />
              <TypographyComp
                sx={{
                  color: "rgba(161, 161, 168, 1)",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                •
              </TypographyComp>
            </>
          )}
          <StackComponent direction="row" spacing={1}>
            {categoryName && (
              <span
                style={{
                  // backgroundColor: "#f0f0f0",
                  padding: "4px 12px",
                  paddingLeft: "0px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                {categoryName}
              </span>
            )}
          </StackComponent>
        </BoxComponent>
      </StackComponent>
    </StackComponent>
  );
}

/**
 * Campaign Badges - Static content
 */
// function CampaignBadges({ isZakatEligible, isTaxDeductable, categoryName }) {
//   return (
//     <StackComponent direction="row" spacing={1}>
//       {categoryName && (
//         <span
//           style={{
//             backgroundColor: "#f0f0f0",
//             padding: "4px 12px",
//             borderRadius: "16px",
//             fontSize: "12px",
//             color: "#666",
//           }}
//         >
//           {categoryName}
//         </span>
//       )}
//       {isZakatEligible && (
//         <span
//           style={{
//             backgroundColor: "#e8f5e9",
//             padding: "4px 12px",
//             borderRadius: "16px",
//             fontSize: "12px",
//             color: "#4CAF50",
//           }}
//         >
//           Zakat Eligible
//         </span>
//       )}
//       {isTaxDeductable && (
//         <span
//           style={{
//             backgroundColor: "#e3f2fd",
//             padding: "4px 12px",
//             borderRadius: "16px",
//             fontSize: "12px",
//             color: "#2196F3",
//           }}
//         >
//           Tax Deductible
//         </span>
//       )}
//     </StackComponent>
//   );
// }

// ============================================
// Static Content Components (cached via parent)
// ============================================

/**
 * Static Updates Section
 * Rendered as part of parent cached component
 */
function StaticUpdatesSection({
  announcements,
  organizerPhoto,
  creator,
  campaignId,
}) {
  if (!announcements || announcements.length === 0) return null;

  const totalAnnouncements = announcements.length;

  return (
    <BoxComponent>
      <WhiteBackgroundSection direction="column">
        <TypographyComp sx={{ ...styles.heading }}>
          Updates{" "}
          <Badge
            sx={{ marginLeft: "10px" }}
            color="primary"
            badgeContent={totalAnnouncements}
          />
        </TypographyComp>

        {announcements.map((item, index) => {
          const truncatedBody = truncateHTML(item.body);

          return (
            <BoxComponent key={index} sx={{ marginBottom: "20px !important" }}>
              <StackComponent
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <NextImage
                  src={organizerPhoto || DEFAULT_IMG}
                  alt="organizer photo"
                  width={24}
                  height={24}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <TypographyComp
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    color: themeColors.primary.dark,
                  }}
                >
                  {creator}
                </TypographyComp>
                <TypographyComp
                  sx={{
                    fontSize: "14px",
                    color: themeColors.primary.gray,
                  }}
                >
                  • {getTimeAgo(item.userUpdatedAt || item.createdAt)}
                </TypographyComp>
              </StackComponent>

              <StackComponent direction="column">
                <TypographyComp component="h4" sx={styles.announcementHeading}>
                  {item.title}
                </TypographyComp>
              </StackComponent>

              <StackComponent direction="column">
                <BoxComponent
                  sx={{
                    "& p": { marginBottom: "16px" },
                    "& img": {
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    },
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: truncatedBody }}
                    style={{
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#333",
                    }}
                  />
                </BoxComponent>
              </StackComponent>
            </BoxComponent>
          );
        })}

        <CampaignUpdatesInteractive
          announcements={announcements}
          campaignId={campaignId}
          totalAnnouncements={totalAnnouncements}
        />
      </WhiteBackgroundSection>
    </BoxComponent>
  );
}

/**
 * Static Supporters Section
 * Rendered as part of parent cached component
 */
// function StaticSupportersSection({
//   recentSupporters,
//   recentSupportersCount,
//   randomToken,
//   isSmallScreen = false,
// }) {
//   console.log("recentSupporters", recentSupporters);
//   if (!recentSupporters || recentSupporters.length === 0) return null;
//   return (
//     <WhiteBackgroundSection direction="column">
//       <TypographyComp sx={{ ...styles.heading }}>
//         Recent Supporters
//       </TypographyComp>
//       <StackComponent spacing={0} sx={{ flexWrap: "wrap" }}>
//         {recentSupporters.map((eachSupporter, index) => (
//           <StackComponent
//             sx={{
//               marginTop: "22px",
//               width: isSmallScreen ? "100%" : "50%",
//               minWidth: isSmallScreen ? "auto" : "176px",
//             }}
//             key={eachSupporter.id || index}
//             alignItems="center"
//           >
//             <NextImage
//               width={46}
//               height={46}
//               style={{
//                 borderRadius: "8px",
//                 objectFit: "cover",
//               }}
//               src={eachSupporter.profileImage || testimonial_1}
//               alt={`${eachSupporter.firstName || ""} ${eachSupporter.lastName || ""}`}
//             />
//             <StackComponent
//               direction="column"
//               sx={{ maxWidth: "100%" }}
//               spacing={0}
//             >
//               <Tooltip
//                 title={`${formatName(eachSupporter?.firstName)} ${formatName(eachSupporter?.lastName)}`}
//               >
//                 <span>
//                   <TypographyComp
//                     sx={{
//                       fontWeight: 500,
//                       fontSize: "18px",
//                       lineHeight: "22px",
//                       color: "#090909",
//                     }}
//                   >
//                     {getFullName(
//                       eachSupporter?.firstName,
//                       eachSupporter?.lastName,
//                     )}
//                   </TypographyComp>
//                 </span>
//               </Tooltip>
//               <TypographyComp
//                 sx={{
//                   color: "#606062",
//                   fontWeight: 400,
//                   fontSize: "16px",
//                   lineHeight: "20px",
//                 }}
//               >
//                 {eachSupporter.currencySymbol}
//                 {eachSupporter.amount} {eachSupporter.currency},{" "}
//                 {formatTimestamp(eachSupporter.createdAt)}
//               </TypographyComp>
//             </StackComponent>
//           </StackComponent>
//         ))}
//       </StackComponent>
//       <CampaignSupportersInteractive
//         initialCount={recentSupporters.length}
//         recentSupportersCount={recentSupportersCount}
//         randomToken={randomToken}
//       />
//     </WhiteBackgroundSection>
//   );
// }

// ============================================
// Async Supporters Fetcher (inside Suspense boundary)
// ============================================

/**
 * AsyncSupportersSection - Fetches supporters data inside a Suspense boundary
 * This ensures the uncached fetch doesn't block the entire page render.
 */
async function AsyncSupportersSection({
  slugPath,
  recentSupportersCount,
  randomToken,
}) {
  const response = await getSupportersCached(slugPath, 4, 0);
  const recentSupporters = response?.data?.data?.recentSupporters || [];

  if (!recentSupporters || recentSupporters.length === 0) return null;

  return (
    <CachedSupportersSection
      recentSupporters={recentSupporters}
      recentSupportersCount={recentSupportersCount}
      randomToken={randomToken}
    />
  );
}

// ============================================
// Main Component - Server Component with PPR
// ============================================

/**
 * CampaignLeftSide - Async Server Component with Next.js 16 PPR
 *
 * Architecture:
 * - Async to enable "use cache" in child functions
 * - Static content cached for 1 day via cached processing functions
 * - Client components stream via Suspense boundaries
 * - Uses PPR: Static shell renders immediately, dynamic streams in
 *
 * Cache Strategy:
 * - Story HTML processing: 1-day cache with cacheTag for invalidation
 * - Announcements processing: 1-day cache
 * - Client components: Not cached (need interactivity)
 */
export default async function CampaignLeftSide({
  title,
  subTitle,
  story,
  coverMedia,
  coverImageUrl,
  thumbnailCoverImageUrl,
  organizerPhoto,
  creator,
  countryName,
  whenPublished,
  isEmailVerified,
  isZakatEligible,
  isTaxDeductable,
  categoryName,
  announcements = [],
  recentSupportersCount = 0,
  campaignId,
  randomToken,
  slugPath,
  previewMode = false,
  currency,
  currencyCode,
  initialGoal,
  raisedPercentage,
  oneTimeDonation,
  recurringDonation,
  checkStatus,
  gradingLevelsList = [],
  currencyConversionIdCampaign,
  url,
  campaignEndDate,
  meta,
}) {
  // Read request headers early to allow using current time safely
  // in this Server Component (prevents Next.js prerender error).

  return (
    <StackComponent direction="column" sx={styles.leftSide} spacing={2}>
      <WhiteBackgroundSection direction="column">
        <CampaignHeader title={title} subTitle={subTitle} />

        <Suspense fallback={<CampaignMediaSkeleton />}>
          <CampaignMedia
            coverMedia={coverMedia}
            coverImageUrl={coverImageUrl}
            thumbnailCoverImageUrl={thumbnailCoverImageUrl}
          />
        </Suspense>
        {/* Mobile-only: keep donation progress directly under cover media */}
        <MobileDonationProgressBar
          currency={currency}
          initialGoal={initialGoal}
          raisedPercentage={raisedPercentage}
          recentSupportersCount={recentSupportersCount}
          oneTimeDonation={oneTimeDonation}
          recurringDonation={recurringDonation}
          checkStatus={checkStatus}
          previewMode={previewMode}
        />
        <Suspense
          fallback={
            <BoxComponent
              sx={{ minHeight: "200px", backgroundColor: "#f9f9f9" }}
            />
          }
        >
          <CampaignStory story={story} campaignId={campaignId} />
        </Suspense>
        {/* <CampaignBadges
          isZakatEligible={isZakatEligible}
          isTaxDeductable={isTaxDeductable}
          categoryName={categoryName}
        /> */}
        <OrganizerInfo
          organizerPhoto={organizerPhoto}
          creator={creator}
          countryName={countryName}
          whenPublished={whenPublished}
          isEmailVerified={isEmailVerified}
          isZakatEligible={isZakatEligible}
          isTaxDeductable={isTaxDeductable}
          categoryName={categoryName}
        />
      </WhiteBackgroundSection>

      <Suspense fallback={<MobileGivingLevelsSkeleton />}>
        <DeferredMobileGivingLevels
          gradingLevelsList={gradingLevelsList}
          currency={currency}
          currencyCode={currencyCode}
          currencyConversionIdCampaign={currencyConversionIdCampaign}
          checkStatus={checkStatus}
          url={url}
          randomToken={randomToken}
          previewMode={previewMode}
          title={title}
        />
      </Suspense>

      <Suspense fallback={<UpdatesSkeleton />}>
        <CachedUpdatesSection
          announcements={announcements}
          organizerPhoto={organizerPhoto}
          creator={creator}
          campaignId={campaignId}
        />
      </Suspense>

      <Suspense fallback={<SupportersSkeleton />}>
        {!previewMode && (
          <AsyncSupportersSection
            slugPath={slugPath}
            recentSupportersCount={recentSupportersCount}
            randomToken={randomToken}
          />
        )}
      </Suspense>
    </StackComponent>
  );
}
