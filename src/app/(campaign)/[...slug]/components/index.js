/**
 * Campaign Page Components - Next.js 16 Cache Components Structure
 *
 * This folder contains the split components for the campaign page
 * implementing Next.js 16 cacheComponents strategy:
 *
 * Server Components (Static, can be cached):
 * - CampaignLeftSide.server.jsx - Main campaign content (title, image, story, updates, supporters)
 * - CampaignRightSide.server.jsx - Donation progress, giving levels (desktop) - server shell with client buttons
 *
 * Client Components (Dynamic, streamed with Suspense):
 * - MobileDonation.client.jsx - Mobile-specific donation UI
 * - CampaignMedia.client.jsx - Image/video handling with error states
 * - CampaignUpdatesInteractive.client.jsx - Only load more functionality for updates
 * - CampaignSupportersInteractive.client.jsx - Only load more functionality for supporters
 * - GivingLevelCard.client.jsx - Giving level cards with interactive buttons
 * - RightSideButtons.client.jsx - Donate and Share buttons
 *
 * Loading States:
 * - CampaignSkeletons.jsx - Loading skeletons for Suspense fallbacks
 */

export { default as CampaignLeftSide } from "./CampaignLeftSide.server";
export { default as CampaignRightSideServer } from "./CampaignRightSide.server";
export { default as MobileDonation } from "./MobileDonation.client";
export { default as CampaignMedia } from "./CampaignMedia.client";
export { default as CampaignUpdatesInteractive } from "./CampaignUpdatesInteractive.client";
export { default as CampaignSupportersInteractive } from "./CampaignSupportersInteractive.client";
export {
  LeftSideSkeleton,
  RightSideSkeleton,
  MobileDonationBarSkeleton,
  CampaignPageSkeleton,
  CampaignMediaSkeleton,
  CampaignHeaderSkeleton,
  CampaignStorySkeleton,
  OrganizerSkeleton,
  BadgesSkeleton,
  MobileDonationProgressSkeleton,
  MobileGivingLevelsSkeleton,
} from "./CampaignSkeletons";
