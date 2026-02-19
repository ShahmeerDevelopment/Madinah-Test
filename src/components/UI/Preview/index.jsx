/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, {Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import ViewCampaignTemplate from "@/components/templates/ViewCampaignTemplate";
import { DEFAULT_AVATAR } from "@/config/constant";
import { useGetSingleCampaign } from "@/api";
import { getAllVisits } from "@/api/get-api-services";
import { loadFeatures } from "@/utils/growthbook";

const PreviewUI = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const utmParameters = useSelector((state) => state.utmParameters);
  const userDetails = useSelector((state) => state.auth.userDetails);

  useEffect(() => {
    const initializeAndGetVisits = async () => {
      try {
        await loadFeatures(); // Wait for GrowthBook features to load
        getAllVisits(
          utmParameters.utmSource,
          utmParameters.utmMedium,
          utmParameters.utmCampaign,
          utmParameters.utmTerm,
          utmParameters.utmContent,
          utmParameters.referral
        );
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    initializeAndGetVisits();
  }, []);

  const {
    data: singleCampaign,
    isLoading,
    isError,
    error,
  } = useGetSingleCampaign(id, "");

  if (isError) return <p>Error: {error.message}</p>;

  const singleCampaignDetails =
    singleCampaign && singleCampaign?.data?.data?.campaignDetails;

  if (isLoading) return <p>Loading...</p>;

  const coverMedia =
    singleCampaignDetails?.coverImageUrl ||
    singleCampaignDetails?.videoLinks[0]?.url ||
    "";

  const allValues = {
    subTitle: "",
    title: singleCampaignDetails?.title,
    coverMedia: coverMedia,
    organizerPhoto: userDetails?.profileImage
      ? userDetails?.profileImage
      : DEFAULT_AVATAR,
    whenPublished: "Just Now",
    story: singleCampaignDetails?.story,
    category: singleCampaignDetails?.categoryId?.name,
    creator: `${userDetails?.firstName} ${userDetails?.lastName}`,
    recentSupporters: "",
    location_country: singleCampaignDetails?.countryId.name,
    updateDonationValue: "",
    gradingLevelsList: [
      {
        title: "Donate a $1 meal",
        amount: 1,
        donationType: "oneTimeDonation",
        isLimited: false,
        quantity: null,
        usedCount: 2,
        description: "Donate a $1 meal",
        currentCurrency: "$",
        index: 0,
        _id: "66f2751b77f4106841b0bcda",
        recurringPackageValues: [12.16, 8.69],
      },
      {
        title: "Donate a $2 meal monthly",
        amount: 2,
        donationType: "recurringDonation",
        isLimited: false,
        currentCurrency: "$",
        quantity: null,
        usedCount: 9,
        description: "Donate a $2 meal monthly",
        recurringType: "monthly",
        index: 0,
        _id: "66f2751b77f4106841b0bcdb",
        recurringPackageValues: [12.16, 8.69],
        recurringEndDate: "2025-07-24T19:00:00.000Z",
      },
    ],
    currency: singleCampaignDetails?.currencySymbol,
    initialGoal: singleCampaignDetails?.startingAmount,
    url: "",
    status: "",
    email: userDetails?.email,
  };

  return (
    <Suspense>
    <ViewCampaignTemplate
      previewMode={true}
      {...allValues}
      categoryName={allValues.category}
      countryName={allValues.location_country}
    />
    </Suspense>
  );
};

export default PreviewUI;
