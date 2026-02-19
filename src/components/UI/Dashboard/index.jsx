/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Wrapper } from "./Dashboard.style";

import { useDispatch } from "react-redux";

import PaginationComp from "@/components/molecules/paginationComp/PaginationComp";

import SortingMenu from "@/components/molecules/sortingMeanu/SortingMenu";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
// import GivingLevelsInfo from "./givingLevelsInfo/GivingLevelsInfo";
import CampaignList from "@/components/UI/Dashboard/campaignList/CampaignList";
import TransferInfo from "@/components/UI/Dashboard/transferInfo/TransferInfo";
import BlogCarousel from "@/components/UI/Dashboard/blogCarousel/BlogCarousel";
import FilterButtons from "@/components/UI/Dashboard/filterButtons/FilterButtons";
import CampaignSkeleton from "@/components/UI/Dashboard/skeleton/CampaignSkeleton";
import GivingLevelsInfo from "@/components/UI/Dashboard/givingLevelsInfo/GivingLevelsInfo";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import {
  updatePaginationData,
  updatePaginationNumber,
} from "@/store/slices/dashboardSlice";
import { getAllVisits, useGetCampaignList } from "@/api/get-api-services";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import Link from "next/link";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useInjectDashboardSlices } from "@/hooks/useInjectReducers";
import { campaignListHandler } from "@/store/slices/campaignSlice";

const DashboardUI = React.memo(() => {
  // Inject dashboard slice on mount
  const isDashboardReady = useInjectDashboardSlices();

  const dispatch = useDispatch();
  const { isSmallScreen } = useResponsiveScreen();
  const username = getCookie("name");
  const utmParameters = useSelector((state) => state.utmParameters);

  // Get dashboard state with defaults for when slice isn't ready yet
  const dashboardPaginatedData = useSelector(
    (state) => state.dashboard?.paginatedData ?? 1,
  );
  const dashboardPaginationNumber = useSelector(
    (state) => state.dashboard?.paginationNumber ?? { label: "10", value: 10 },
  );

  const [status, setStatus] = useState("all");
  const [paginatedData, setPaginatedData] = useState(dashboardPaginatedData);
  const [paginationNumber, setPaginationNumber] = useState(
    dashboardPaginationNumber,
  );
  const [selectedLabel, setSelectedLabel] = useState({
    _id: 1,
    label: "Creation date",
    isUp: false,
  });
  const campaignsPerPage = paginationNumber.value;

  const {
    data: campaignListResponse,
    isLoading,
    isError,
    error,
  } = useGetCampaignList();

  if (isError) return <p>Error: {error.message}</p>;

  const campaignData = campaignListResponse?.data?.data;
  const recentCampaigns = campaignData?.recentCampaigns;

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral,
    );
  }, []);

  const sortedCampaigns = useMemo(() => {
    if (!recentCampaigns) return [];
    return [...recentCampaigns].sort((a, b) => {
      if (selectedLabel._id === 1) {
        return selectedLabel.isUp
          ? new Date(a.createdAt) - new Date(b.createdAt) // Oldest first
          : new Date(b.createdAt) - new Date(a.createdAt); // Newest first
      } else if (selectedLabel._id === 2) {
        return selectedLabel.isUp
          ? a.collectedAmount - b.collectedAmount // Ascending by targetAmount
          : b.collectedAmount - a.collectedAmount; // Descending by targetAmount
      } else if (selectedLabel._id === 3) {
        return selectedLabel.isUp
          ? a.targetAmount - b.targetAmount // Ascending by collectedAmount
          : b.targetAmount - a.targetAmount; // Descending by collectedAmount
      } else {
        return 0;
      }
    });
  }, [recentCampaigns, selectedLabel]);

  useEffect(() => {
    dispatch(campaignListHandler(sortedCampaigns));
  }, [dispatch, sortedCampaigns]);

  const filterCampaigns = useCallback((campaigns, status) => {
    switch (status) {
      case "active":
        return campaigns.filter((campaign) => campaign.status === "active");
      case "inActive":
        return campaigns.filter(
          (campaign) =>
            campaign.status === "in-active" || campaign.status === "rejected",
        );
      case "pending-approval":
        return campaigns.filter(
          (campaign) => campaign.status === "pending-approval",
        );
      case "expired":
        return campaigns.filter((campaign) => campaign.status === "expired");
      case "drafts":
        return campaigns.filter((campaign) => campaign.status === "draft");
      default:
        return campaigns;
    }
  }, []);
  const filteredCampaigns = useMemo(
    () => filterCampaigns(sortedCampaigns, status),
    [sortedCampaigns, status, filterCampaigns],
  );

  const handleSortingChange = useCallback((_id, label, isUp) => {
    setSelectedLabel({ _id, label, isUp });
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [paginationNumber]);

  const paginateHandler = useCallback(
    (event, value) => {
      if (paginatedData === value) {
        return; // Do nothing if the same page is clicked
      }
      setPaginatedData(value);
      dispatch(updatePaginationData(value));
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    [paginatedData],
  );

  useEffect(() => {
    dispatch(updatePaginationNumber(paginationNumber));
  }, [paginationNumber]);

  const paginatedCampaigns = useMemo(() => {
    const startIndex = (paginatedData - 1) * campaignsPerPage;
    const endIndex = startIndex + campaignsPerPage;
    return filteredCampaigns?.slice(startIndex, endIndex);
  }, [filteredCampaigns, paginatedData, campaignsPerPage]);

  const totalPage = Math.ceil(
    filteredCampaigns && filteredCampaigns.length / campaignsPerPage,
  );

  useEffect(() => {
    setPaginatedData(1);
  }, [status]);

  return (
    <Wrapper>
      <BoxComponent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mx: { xs: 2, sm: 0 },
        }}
      >
        <FilterButtons setStatus={setStatus} status={status} />
        <BoxComponent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          <Link href="/create-campaign" passHref prefetch={false}>
            <ButtonComp
              sx={{
                padding: "12px 32px",
                radius: "48px",
                height: "34px",
                // width: "170px",
                color: "#FFFFFF",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: "20px",
              }}
              onClick={() => dispatch(resetCampaignValues())}
            >
              Start Fundraising
            </ButtonComp>
          </Link>
          <SortingMenu
            selectedLabel={selectedLabel}
            onSortingChange={handleSortingChange}
          />
        </BoxComponent>
      </BoxComponent>

      <TransferInfo />

      {campaignData && campaignData.recentCampaigns?.length === 1 ? (
        <GivingLevelsInfo
          campaignId={campaignData.recentCampaigns[0]?.randomToken}
        />
      ) : null}
      {isLoading ? (
        <CampaignSkeleton />
      ) : (
        paginatedCampaigns.map((item, index) => (
          <div key={index}>
            <CampaignList campaignData={item} username={username} />
          </div>
        ))
      )}

      {isLoading ? null : sortedCampaigns?.length === 0 ||
        paginatedCampaigns?.length === 0 ? (
        <CampaignHeading align={"center"} sx={{ mt: 2 }}>
          No campaigns available
        </CampaignHeading>
      ) : (
        <PaginationComp
          totalPage={totalPage}
          page={paginatedData}
          onChange={paginateHandler}
          setPaginationNumber={setPaginationNumber}
          paginationNumber={paginationNumber}
          resetPage={() => setPaginatedData(1)}
        />
      )}
      <BlogCarousel />
    </Wrapper>
  );
});

DashboardUI.displayName = "DashboardUI";

export default DashboardUI;
