import FeaturedCampaignsServer from "./FeaturedCampaignsServer";
import VoicesOfMadinahServer from "../server-components/VoicesOfMadinahServer";
import HelpHappensHereSection from "../server-components/HelpHappensHereSection";
import YearInHelpReviewSection from "../server-components/YearInHelpReviewSection";
import RecentCampaignsServer from "./RecentCampaignsServer";
import OurCategoriesServer from "./OurCategoriesServer";
import OrganizationsServer from "./OrganizationsServer";
import AdminLoginHandler from "./AdminLoginHandler.client";

import {
  FundraiseForAnyoneServer,
  HowMadinahWorksSection,
} from "../server-components";

/**
 * HomePage Server Component
 *
 * Next.js 16+ Architecture with cacheComponents:
 * - Components using "use cache" are included in the static shell (fast LCP!)
 * - Each component has its own Suspense with skeleton fallback for cache misses
 * - Cached content renders immediately - skeletons only show on first request/cache miss
 *
 * This is the CORRECT behavior:
 * - Fast LCP because cached content is in static shell
 * - Skeletons only appear during actual loading (cache miss)
 * - Don't use connection() as it blocks cached content
 */
export default function HomePage() {
  return (
    <>
      <AdminLoginHandler />
      {/* Styles moved to globals.css for TBT optimization */}
      <div className="initial-paint-sections">
        <FeaturedCampaignsServer />
        <VoicesOfMadinahServer />
        <HelpHappensHereSection />
        <YearInHelpReviewSection />
        <RecentCampaignsServer />
        <OurCategoriesServer />
        <HowMadinahWorksSection showLearnMore={true} />
        <OrganizationsServer />
        <FundraiseForAnyoneServer />
      </div>
    </>
  );
}
