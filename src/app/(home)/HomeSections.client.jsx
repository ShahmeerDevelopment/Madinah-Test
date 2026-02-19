"use client";

/**
 * Client section wrappers for homepage
 * Only exports components that are actively used
 * Unused exports removed to reduce bundle size
 */

import BigCarousal from "@/components/UI/Home/BigCarousal";
import OurCategories from "@/components/UI/Home/OurCategories";
import OrganizationsArr from "@/components/UI/Home/OrganizationsArr";

// Used by RecentCampaignsServer
export function BigCarousalSection({ campaigns }) {
  return <BigCarousal serverCampaigns={campaigns} isFromHomepage={true} />;
}

// Used by OurCategoriesServer
export function OurCategoriesSection({ categories }) {
  return <OurCategories categories={categories} />;
}

// Used by OrganizationsServer
export function OrganizationsSection({ organizations }) {
  return <OrganizationsArr serverOrganizations={organizations} />;
}

// REMOVED UNUSED EXPORTS:
// - VoiceOfMadinahSection (using VoicesOfMadinahServer instead)
// - YearInHelpReviewSection (using server-components/YearInHelpReviewSection instead)
// - FundraiseSection (using FundraiseForAnyoneServer instead)
