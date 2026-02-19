"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAllCampaignsBasedOnQuery } from "@/api/get-api-services";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import StackComponent from "@/components/atoms/StackComponent";
import SectionHeading from "../UI/SectionHeading";

// Dynamic import to reduce blocking time
const BigCarousal = dynamic(() => import("@/components/UI/Home/BigCarousal"), {
  loading: () => <SkeletonComponent width="100%" height="250px" />,
  ssr: false,
});

const TrendingCampaigns = ({ initialData = [] }) => {
  const { isSmallScreen } = useResponsiveScreen();

  // Helper to map campaign data
  const mapCampaigns = (campaigns) => {
    return campaigns.map((eachCampaign) => ({
      id: eachCampaign.randomToken,
      image: eachCampaign.coverImageUrl, // BigCarousal format
      videoLinks: eachCampaign.videoLinks,
      title: eachCampaign.title,
      subTitle: eachCampaign.subTitle, // BigCarousal format
      raisedAmount: eachCampaign.collectedAmount,
      totalGoal: eachCampaign.targetAmount,
      raisedCurrency:
        eachCampaign.currencySymbol || eachCampaign.amountCurrency,
      urlRedirect: eachCampaign.randomToken,
      subtitle: eachCampaign.subTitle, // Keep for safety if reused
    }));
  };

  const [trendingCampaigns, setTrendingCampaigns] = useState(
    initialData && initialData.length > 0 ? mapCampaigns(initialData) : [],
  );
  const [loading, setLoading] = useState(
    !initialData || initialData.length === 0,
  );
  const [error, setError] = useState(false);

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
      getAllCampaignsBasedOnQuery(
        { type: "almost-completed" },
        12, // Increased to 12 for carousel
        0,
        null,
        cfCountry,
      )
        .then((res) => {
          if (!res.data.success) {
            return setError("Error Occured!");
          }
          const arr = mapCampaigns(res?.data?.data?.campaigns || []);

          if (!arr) {
            return setError("Error Occured!");
          }
          setError(false);
          setTrendingCampaigns(arr);
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
          Trending campaigns
        </SectionHeading>
      </StackComponent>

      {loading ? (
        <SkeletonComponent width="100%" height="250px" />
      ) : (
        <BigCarousal
          serverCampaigns={trendingCampaigns}
          containerStyleOverrides={{ mt: "0px !important" }}
        />
      )}
    </StackComponent>
  );
};

export default TrendingCampaigns;
