"use client";
import { getAllCampaignsBasedOnQuery } from "@/api/get-api-services";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { getThumbnailUrl } from "@/utils/helpers"; // Needed for thumbnail fallback
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import StackComponent from "@/components/atoms/StackComponent";
import SectionHeading from "../UI/SectionHeading";
import SectionSubheading from "../UI/SectionSubheading";

// Dynamic import to reduce blocking time
const BigCarousal = dynamic(() => import("@/components/UI/Home/BigCarousal"), {
  loading: () => <SkeletonComponent width="100%" height="250px" />,
  ssr: false,
});

const FeaturedCampaigns = ({ initialData = [] }) => {
  const { isSmallScreen } = useResponsiveScreen();

  // Helper to map campaign data to BigCarousal format
  const mapCampaigns = (campaigns) => {
    return campaigns.map((eachCampaign) => ({
      id: eachCampaign.randomToken,
      // BigCarousal/Card expects 'image'
      image:
        eachCampaign.coverImageUrl ||
        getThumbnailUrl(eachCampaign.videoLinks?.[0]?.url),
      // Actually standardizing to pass raw or simplified data
      title: eachCampaign.title,
      subTitle: eachCampaign.subTitle, // Capital T for Card
      raisedAmount: eachCampaign.collectedAmount,
      totalGoal: eachCampaign.targetAmount,
      raisedCurrency:
        eachCampaign.currencySymbol || eachCampaign.amountCurrency,
      urlRedirect: eachCampaign.randomToken,
      videoLinks: eachCampaign.videoLinks,
      // Add coverImage for fallback logic if needed
      coverImageUrl: eachCampaign.coverImageUrl,
    }));
  };

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(
    !initialData || initialData.length === 0,
  );
  const [featuredCampaigns, setFeaturedCampaigns] = useState(
    initialData && initialData.length > 0 ? mapCampaigns(initialData) : [],
  );

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      return;
    }

    // Defer the API call to not block rendering
    const timer = setTimeout(() => {
      const cfCountry =
        typeof window !== "undefined"
          ? localStorage.getItem("cfCountry")
          : null;

      setLoading(true);
      getAllCampaignsBasedOnQuery({ type: "featured" }, 12, 0, null, cfCountry)
        .then((res) => {
          if (!res.data.success) {
            return setError("Error Occured!");
          }

          const arr = mapCampaigns(res?.data?.data?.campaigns || []);

          if (!arr) {
            return setError("Error Occured!");
          }
          setError(false);
          setFeaturedCampaigns(arr);
        })
        .catch((err) => {
          console.error(err);
          setError("Error Occured!");
        })
        .finally(() => {
          setLoading(false);
        });
    }, 100);

    return () => clearTimeout(timer);
  }, [initialData]);

  return (
    <StackComponent direction="column">
      <StackComponent sx={{ flexGrow: 1 }} direction="column" spacing="4px">
        <SectionHeading style={{ mb: "4px !important" }}>
          Featured campaigns
        </SectionHeading>
        <SectionSubheading style={{ mb: "24px !important" }}>
          Sponsored
        </SectionSubheading>
      </StackComponent>

      {loading ? (
        <SkeletonComponent width="100%" height="250px" />
      ) : (
        <BigCarousal
          serverCampaigns={featuredCampaigns}
          containerStyleOverrides={{ mt: "0px !important" }}
        />
      )}
    </StackComponent>
  );
};

export default FeaturedCampaigns;
