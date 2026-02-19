import {
  getCategoriesListCached,
  getCountriesListCached,
  getFeaturedCampaignsCached,
  getOrganizationsCached,
  getTrendingCampaignsCached,
} from "./discover-cache.server";

import StackComponent from "@/components/atoms/StackComponent";
import WhiteFlexBackgroundLayout from "@/components/UI/Discover/UI/WhiteBackgroundLayout";
import Explore from "@/components/UI/Discover/Subsections/Explore";
import GiveAroundTheWorld from "@/components/UI/Discover/Subsections/GiveAroundTheWorld";
import DonateToFavoriteCharity from "@/components/UI/Discover/Subsections/DonateToFavoriteCharity";
import HelpRebuild from "@/components/UI/Discover/Subsections/HelpRebuild";
import PickACampaign from "@/components/UI/Discover/Subsections/PickACampaign";
import DiscoverDataHydrator from "./DiscoverDataHydrator.client";
import {
  FeaturedCampaignsSection,
  TrendingCampaignsSection,
} from "./DiscoverCampaignSections.client";

export default async function DiscoverPage() {
  // Fetch cached data on the server
  const [
    categoriesResult,
    countriesResult,
    featuredResult,
    organizationsResult,
    trendingResult,
  ] = await Promise.all([
    getCategoriesListCached(),
    getCountriesListCached(),
    getFeaturedCampaignsCached(),
    getOrganizationsCached(),
    getTrendingCampaignsCached(),
  ]);

  const categories = categoriesResult?.data?.data?.categories || [];
  const countries = countriesResult?.data?.data?.countries || [];
  const featuredCampaigns = featuredResult?.data?.data?.campaigns || [];
  const organizations =
    organizationsResult?.data?.data?.charityOrganizations || [];
  const trendingCampaigns = trendingResult?.data?.data?.campaigns || [];

  return (
    <>
      <style>{`
        .discover-sections {
          width: 100%;
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      `}</style>

      {/* Hydrate Redux with server data */}
      <DiscoverDataHydrator
        initialCategories={categories}
        initialCountries={countries}
      />

      <div className="discover-sections">
        <StackComponent
          spacing="24px"
          sx={{ width: "100%", mt: "24px" }}
          direction="column"
        >
          <WhiteFlexBackgroundLayout spacing="16px">
            {/* <Suspense fallback={null}> */}
            <Explore initialCategories={categories} />
            {/* </Suspense> */}
          </WhiteFlexBackgroundLayout>

          <WhiteFlexBackgroundLayout spacing="24px">
            {/* <Suspense fallback={null}> */}
            <GiveAroundTheWorld />
            {/* </Suspense> */}
          </WhiteFlexBackgroundLayout>

          <WhiteFlexBackgroundLayout spacing="24px">
            {/* <Suspense fallback={null}> */}
            <DonateToFavoriteCharity initialData={organizations} />
            {/* </Suspense> */}
          </WhiteFlexBackgroundLayout>

          <FeaturedCampaignsSection initialData={featuredCampaigns} />

          <HelpRebuild />

          <WhiteFlexBackgroundLayout spacing="24px">
            <PickACampaign />
          </WhiteFlexBackgroundLayout>

          <TrendingCampaignsSection initialData={trendingCampaigns} />
        </StackComponent>
      </div>
    </>
  );
}
