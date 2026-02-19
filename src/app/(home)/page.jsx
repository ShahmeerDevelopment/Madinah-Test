import HomePage from "./HomePage.server";

// Note: With cacheComponents enabled, use 'use cache' directive instead of revalidate
// Featured campaigns: 2-hour cache, Recent campaigns: 1-hour cache
// Categories: 2-day cache, Organizations: 2-day cache

export default function Page() {
  // All data fetching now handled by individual server components:
  // - Featured campaigns: FeaturedCampaignsServer with 2-hour cache
  // - Recent campaigns: RecentCampaignsServer with 1-hour cache
  // - Categories: OurCategoriesServer with 2-day cache
  // - Organizations: OrganizationsServer with 2-day cache
  // - Blog: YearInHelpReviewSection (client-side fetch)
  // - How Madinah Works: HowMadinahWorksSection (static)

  return <HomePage />;
}
