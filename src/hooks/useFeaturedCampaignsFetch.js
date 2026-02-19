import { useState } from "react";
import { getAllCampaignsBasedOnQuery } from "@/api/get-api-services";
import { getVideoThumbnail } from "@/utils/helpers";
// import { getVideoThumbnail } from "@/utils/helpers";

const useFeaturedCampaignsFetch = (initialProps) => {
  const [currentPage, setCurrentPage] = useState(initialProps.currentPage || 0);
  const [featuredCampaigns, setFeaturedCampaigns] = useState(
    initialProps.mutatedCampaignsArr
  );
  const [campaignsStillRemaining, setCampaignsStillRemaining] = useState(
    initialProps.campaignsStillRemaining
  );
  const [loadingfeaturedCampaigns, setLoadingfeaturedCampaigns] = useState(
    initialProps.loadingfeaturedCampaigns
  );
  const [hasErrorfeaturedCampaigns, setHasErrorfeaturedCampaigns] = useState(
    initialProps.hasErrorfeaturedCampaigns
  );

  const fetchCampaigns = async (page) => {
    // Get cfCountry from localStorage
    const cfCountry =
      typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;

    setLoadingfeaturedCampaigns(true);
    setHasErrorfeaturedCampaigns(false);
    try {
      const res = await getAllCampaignsBasedOnQuery(
        { type: "featured" },
        5,
        page,
        null,
        cfCountry
      );

      if (!res.data.success) {
        setHasErrorfeaturedCampaigns(true);
        return;
      }

      const campaigns = res.data.data.campaigns.map((campaign) => ({
        id: campaign.randomToken,
        image: campaign.coverImageUrl
          ? campaign.coverImageUrl
          : getVideoThumbnail(campaign.videoLinks[0]?.url),
        coverImageUrl: campaign.coverImageUrl,
        videoLinks: campaign.videoLinks,
        title: campaign.title,
        subtitle: campaign.subTitle,
        raisedAmount: campaign.collectedAmount,
        totalGoal: campaign.targetAmount,
        raisedCurrency: campaign.currencySymbol || null,
        recurringDonation: campaign.isRecurringDonation || false,
        oneTimeDonation: campaign.isOneTimeDonation || false,
        currencySymbol: campaign?.currencySymbol,
      }));
      setFeaturedCampaigns(campaigns);
      setCampaignsStillRemaining(res.data.data.isMoreRecordsExist);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      setHasErrorfeaturedCampaigns(true);
    } finally {
      setLoadingfeaturedCampaigns(false);
    }
  };

  const increasePage = () => {
    if (campaignsStillRemaining) {
      fetchCampaigns(currentPage + 1);
    }
  };

  const decreasePage = () => {
    if (currentPage > 0) {
      fetchCampaigns(currentPage - 1);
    }
  };

  return {
    currentPage,
    featuredCampaigns,
    campaignsStillRemaining,
    loadingfeaturedCampaigns,
    hasErrorfeaturedCampaigns,
    increasePage,
    decreasePage,
  };
};

export default useFeaturedCampaignsFetch;
