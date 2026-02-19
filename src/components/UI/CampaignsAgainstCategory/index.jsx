"use client";

import React, { useEffect, useState } from "react";
import { scrollToTop } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { IMAGES } from "@/assets/pick-campaign-that";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import StackComponent from "@/components/atoms/StackComponent";
import AlertComponent from "@/components/atoms/AlertComponent";
import MainImage from "./MainImage";
import CampaignsList from "./CampaignsList";
import { getAllCampaigns, getAllVisits } from "@/api/get-api-services";
import { queryToString } from "@/utils/helpers";
import { getCookie } from "cookies-next";
import { handlePosthog } from "@/api/post-api-services";
// import posthog from "posthog-js";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";

const CampaignsAgainstCategory = () => {
  const searchParams = useSearchParams();
  const utmParameters = useSelector((state) => state.utmParameters);
  const search = searchParams.get("search");
  const organization = searchParams.get("organization");
  const choice = searchParams.get("choice");
  const countryId = searchParams.get("countryId");
  const organizationName = searchParams.get("organizationName");
  const categoryId = searchParams.get("category");

  const [baseData, setBaseData] = useState({
    totalCampaigns: "",
    totalAmount: "",
    totalSupporters: "",
    currency: "$",
  });
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [page, setPage] = useState(0); // Track the page number
  const [hideViewMore, setHideViewMore] = useState(false);

  const limit = 12; // Constant limit

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral
    );
    if (parsedConsent?.analytics || !consentCookie) {
      const userId = getCookie("distinctId");
      const payload = {
        distinctId: userId,
        event: "Search Page Visited",
        properties: {
          $current_url: window.location.href,
          // ...posthog?.persistence?.properties(),
        },
      };
      enhancedHandlePosthog(handlePosthog, payload, "Search Page");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      scrollToTop();
    }
  }, []);

  const fetchCampaigns = () => {
    // Get cfCountry from localStorage
    const cfCountry =
      typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;

    setMoreLoading(true);
    const query = {};

    if (choice) {
      query.type = choice;
    }
    if (countryId) {
      query.countryId = countryId;
    }
    if (organization) {
      query.organization = organization;
    }
    if (search) {
      query.searchText = search;
    }
    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (Object.keys(query).length > 0) {
      if (queryToString(query)?.toLowerCase().includes("syria")) {
        setCampaigns([]);
        setLoading(false);
        setMoreLoading(false);
        setBaseData({
          totalCampaigns: "",
          totalAmount: "",
          totalSupporters: "",
          currency: "",
        });
      } else {
        getAllCampaigns(queryToString(query), limit, page, cfCountry)
          .then((res) => {
            setError("");
            if (!res?.data?.success) {
              setCampaigns([]);
              setLoading(false);
              setMoreLoading(false);
              return;
            }

            const result = res?.data?.data;
            setBaseData({
              totalCampaigns: result?.categoryCampaigns,
              totalAmount: result?.totalDonations,
              totalSupporters: result?.totalSupporters,
              currency: "$",
            });

            const tempCampaigns = result?.campaigns.map((eachCampaign) => ({
              id: eachCampaign?._id,
              title: eachCampaign?.title,
              coverImageUrl: eachCampaign.coverImageUrl,
              videoLinks: eachCampaign.videoLinks,
              raisedAmount: eachCampaign?.collectedAmount,
              raisedCurrency: eachCampaign?.amountCurrency,
              totalGoal: eachCampaign?.targetAmount,
              urlRedirect: eachCampaign?.randomToken,
              currencySymbol: eachCampaign?.currencySymbol,
              subtitle: eachCampaign?.subTitle,
              recurringDonation: eachCampaign?.isRecurringDonation,
              oneTimeDonation: eachCampaign?.isOneTimeDonation,
            }));

            setCampaigns((prevCampaigns) =>
              page > 0 ? [...prevCampaigns, ...tempCampaigns] : tempCampaigns
            );
            if (tempCampaigns.length < 12) {
              setHideViewMore(true);
            }
          })
          .catch((err) => setError(err.message))
          .finally(() => {
            setLoading(false);
            setMoreLoading(false);
          });
      }
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [page, search, organization, choice, countryId, categoryId]);

  // Reset page to 0 when search parameters change
  useEffect(() => {
    setPage(0);
    setCampaigns([]);
    setHideViewMore(false);
    setLoading(true);
  }, [search, organization, choice, countryId, categoryId]);

  const categoryDetails = useSelector((state) =>
    state.meta?.categories?.find(
      (eachCategory) => eachCategory._id === categoryId
    )
  );
  const countryDetails = useSelector((state) =>
    state.meta.countries?.find((eachCountry) => eachCountry._id === countryId)
  );

  const choiceDetails = IMAGES?.find((eachImg) => eachImg.name === choice);

  const choiceName = choiceDetails?.label;
  const choiceImage = choiceDetails?.url;
  const categoryName = categoryDetails?.name;
  const categoryCoverImage = categoryDetails?.imageUrl;

  const countryName = countryDetails?.name;
  const countryCoverImage = countryDetails?.imageUrl;

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    // fetchCampaigns();
  };

  let render = null;

  render = loading ? (
    <>
      <SkeletonComponent
        width={"100%"}
        height="460px"
        sx={{ borderRadius: "15px" }}
      />
      <StackComponent sx={{ flexWrap: "wrap", gap: "30px" }} spacing={0}>
        <SkeletonComponent width="30%" sx={{ borderRadius: "12px" }} />
        <SkeletonComponent width="30%" sx={{ borderRadius: "12px" }} />
        <SkeletonComponent width="30%" sx={{ borderRadius: "12px" }} />
      </StackComponent>
    </>
  ) : error ? (
    <>
      <AlertComponent severity="error">{error}</AlertComponent>
    </>
  ) : (
    <>
      <MainImage
        image={
          countryId
            ? countryCoverImage
            : choice
              ? choiceImage
              : categoryCoverImage
        }
        title={categoryName || organizationName || choiceName || countryName}
        showBaseData={!!categoryId}
        {...{
          currency: baseData?.currency,
          total: baseData?.totalAmount,
          numberOfSupporters: baseData?.totalSupporters,
          numberOfCampaigns: baseData?.totalCampaigns,
        }}
      />
      <CampaignsList
        searchPage
        heading={search ? `Showing Results For: ${search}` : "Latest activity"}
        campaignsArr={campaigns}
        hideViewMore={hideViewMore}
        handleLoadMore={handleLoadMore}
        moreLoading={moreLoading}
      />
      {/* {!hideViewMore ? (
        <ButtonComp onClick={handleLoadMore} variant="text">
          View more
        </ButtonComp>
      ) : null} */}
    </>
  );

  return (
    <StackComponent
      spacing="32px"
      sx={{
        width: "100%",
        mt: "24px",
        minHeight: "calc(100vh - 286px)",
        margin: "0 auto",
      }}
      direction="column"
    >
      {render}
    </StackComponent>
  );
};

export default CampaignsAgainstCategory;
