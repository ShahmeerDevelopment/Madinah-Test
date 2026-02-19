"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { format, startOfToday } from "date-fns";

// Core components that are needed for the initial layout
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import CalenderButton from "@/components/molecules/calenderButton/CalenderButton";
import StackComponent from "@/components/atoms/StackComponent";
import { Section } from "./style";
import { getAllVisits } from "@/api/get-api-services";

// Lazy-loaded components for better code splitting
const ModalComponent = dynamic(
  () => import("@/components/molecules/modal/ModalComponent"),
  { ssr: false }
);
const StatisticsCard = dynamic(() => import("./statisticsCard/StatisticsCard"));
const AreaChartSection = dynamic(
  () => import("./charts/areaChart/AreaChartSection"),
  { ssr: false }
);
const TopCountriesPieCharts = dynamic(
  () => import("./charts/TopCountriesPieCharts"),
  { ssr: false }
);
const TableSkeleton = dynamic(
  () => import("@/components/advance/TableSkeleton")
);
const StatisticsTable = dynamic(
  () => import("./statisticsTable/StatisticsTable"),
  { ssr: false }
);
const DateRangeModal = dynamic(
  () => import("./dateRangeModal/DateRangeModal"),
  { ssr: false }
);

// Import API functions only when needed
import { getAllStatistics, getAllStatisticsTableData } from "@/api";
import { STATISTICS_DATA } from "./constant";

const StatisticsUI = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const referralToken = searchParams.get("referralToken");
  const [calendarModal, setCalendarModal] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [resetFilterButton, setResetFilterButton] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [filterData, setFilterData] = useState();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const utmParameters = useSelector((state) => state.utmParameters);

  const selectedDate = useSelector((state) => state.statistics?.currentDate);
  const owner = useSelector((state) => state.mutateCampaign.creator);

  console.log("selectedDate", selectedDate);
  const previousPeriod = useSelector(
    (state) => state.statistics?.comparePreviousPeriod
  );

  // Provide fallback values if selectedDate is not available
  const endDate = selectedDate?.endDate
    ? selectedDate.endDate
    : selectedDate?.startDate || format(startOfToday(), "yyyy-MM-dd");

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral
    );
  }, []);

  useEffect(() => {
    if (resetFilterButton) {
      setFilterValues({});
      setResetFilterButton(false);
    }
  }, [resetFilterButton]);

  const getStatisticsFromBackend = useCallback(async () => {
    // Early return if selectedDate is not available
    if (!selectedDate || !selectedDate.startDate) {
      console.warn("selectedDate is not available yet");
      setLoading(false);
      return;
    }

    setLoading(false);
    try {
      const payload = {
        startDate: selectedDate.startDate,
        endDate: endDate,
        value: selectedDate.value,
        previousPeriod: previousPeriod,
        id: id || null,
        referralToken: referralToken || null,
      };

      const response = await getAllStatistics(payload);
      if (
        response.data.success === true &&
        response.data.message === "Success"
      ) {
        setData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("error", error);
    }
  }, [selectedDate, endDate, previousPeriod, id, referralToken]);

  const getStatisticsTableDataFromBackend = async (values) => {
    // Early return if selectedDate is not available
    if (!selectedDate || !selectedDate.startDate) {
      console.warn("selectedDate is not available yet");
      setTableLoading(false);
      return;
    }

    setTableLoading(true);
    setFilterValues(values);

    try {
      const campaignSource = Array.isArray(values?.campaignSource)
        ? values.campaignSource.map((item) => item.name)
        : typeof values?.campaignSource === "object"
          ? values?.campaignSource?.name
          : values?.campaignSource;

      const selectedSource = Array.isArray(values?.selectedSource)
        ? values.selectedSource.map((item) => item.name)
        : typeof values?.selectedSource === "object"
          ? values?.selectedSource?.name
          : values?.selectedSource;

      const mediumSource = Array.isArray(values?.mediumSource)
        ? values.mediumSource.map((item) => item.name)
        : typeof values?.mediumSource === "object"
          ? values?.mediumSource?.name
          : values?.mediumSource;

      const termSource = Array.isArray(values?.termSource)
        ? values.termSource.map((item) => item.name)
        : typeof values?.termSource === "object"
          ? values?.termSource?.name
          : values?.termSource;

      const contentSource = Array.isArray(values?.contentSource)
        ? values.contentSource.map((item) => item.name)
        : typeof values?.contentSource === "object"
          ? values?.contentSource?.name
          : values?.contentSource;

      const response = await getAllStatisticsTableData(
        values?.groupByFilter,
        selectedSource,
        mediumSource,
        termSource,
        contentSource,
        campaignSource,
        id || null,
        referralToken || null,
        selectedDate?.startDate,
        selectedDate?.endDate
      );

      if (
        response.data.success === true &&
        response.data.message === "Success"
      ) {
        let filteredData = response?.data?.data?.campaignsUTMTableData;
        setFilterData(filteredData);

        filteredData = filteredData.filter((campaign) => {
          const details = campaign.campaignDetails;

          const totalDonationCount = details.reduce(
            (acc, detail) => acc + detail.donationCount,
            0
          );
          const totalVisits = details.reduce(
            (acc, detail) => acc + detail.visitCount,
            0
          );
          const totalDonationValue = details.reduce(
            (acc, detail) => acc + detail.totalDonationValue,
            0
          );
          const averageDonation =
            totalDonationCount > 0 ? totalDonationValue / totalVisits : 0;
          const totalConversionRate =
            totalVisits > 0 ? totalDonationCount / totalVisits : 0;

          const fromCount = values.donations?.from || 0;
          const toCount = values.donations?.to || Infinity;
          if (totalDonationCount < fromCount || totalDonationCount > toCount)
            return false;

          const fromValue = values.totalDonations?.from || 0;
          const toValue = values.totalDonations?.to || Infinity;
          if (totalDonationValue < fromValue || totalDonationValue > toValue)
            return false;

          const fromAverage = values.averageDonations?.from || 0;
          const toAverage = values.averageDonations?.to || Infinity;
          if (averageDonation < fromAverage || averageDonation > toAverage)
            return false;

          const fromRate = values.conversionRate?.from || 0;
          const toRate = values.conversionRate?.to || Infinity;
          if (totalConversionRate < fromRate || totalConversionRate > toRate)
            return false;

          if (values?.specificCampaign && values.specificCampaign.length > 0) {
            let specificCampaignValues = [];

            if (Array.isArray(values.specificCampaign)) {
              specificCampaignValues = values.specificCampaign.map((item) =>
                item.name.toLowerCase()
              );
            } else if (typeof values.specificCampaign === "object") {
              specificCampaignValues = [
                values.specificCampaign.name.toLowerCase(),
              ];
            } else {
              specificCampaignValues = [values.specificCampaign.toLowerCase()];
            }

            const campaignTitleLower = campaign.campaignTitle.toLowerCase();
            const matches = specificCampaignValues.some(
              (value) => campaignTitleLower === value
            );

            if (!matches) {
              return false;
            }
          }
          return true;
        });

        setTableData(filteredData);
      }
      setTableLoading(false);
    } catch (error) {
      setTableLoading(false);
      console.error("error", error);
    }
  };

  useEffect(() => {
    getStatisticsTableDataFromBackend(filterValues);
  }, [getStatisticsFromBackend, filterValues]);

  useEffect(() => {
    getStatisticsFromBackend();
  }, [getStatisticsFromBackend]);

  useEffect(() => {
    getStatisticsTableDataFromBackend(filterValues);
    getStatisticsFromBackendDate();
  }, [selectedDate]);

  const handleCalendarModal = useCallback((open) => setCalendarModal(open), []);

  const getStatisticsFromBackendDate = async () => {
    // Early return if selectedDate is not available
    if (!selectedDate || !selectedDate.startDate) {
      console.warn("selectedDate is not available yet");
      return;
    }

    const payload = {
      startDate: selectedDate.startDate,
      endDate: endDate,
      value: selectedDate.value,
      previousPeriod: previousPeriod,
      id: id || null,
      referralToken: referralToken || null,
    };
    const response = await getAllStatistics(payload);
    setData(response.data.data);
  };

  const handleFilter = useCallback(
    (values) => {
      if (!values) return;
      getStatisticsTableDataFromBackend(values);
      localStorage.setItem("statFilters", JSON.stringify(values));
    },
    [data, filterData]
  );

  const handleResetFilter = (values) => {
    localStorage.removeItem("statFilters");
    getStatisticsTableDataFromBackend(values);
  };

  return (
    <>
      <Section>
        <StackComponent
          justifyContent="space-between"
          direction={{ xs: "column", sm: "row" }}
        >
          <CampaignHeading marginBottom={0}>
            {`Statistics for ${
              referralToken ? `Referral Owner ${owner}` : "all campaigns"
            }`}
          </CampaignHeading>
          <StackComponent spacing={"4px"} alignItems={"center"}>
            <CalenderButton
              content={`Starting: ${selectedDate.startDate}`}
              onClickHandler={() => handleCalendarModal(true)}
            />
            <CalenderButton
              content={`Ending: ${endDate}`}
              onClickHandler={() => handleCalendarModal(true)}
            />
          </StackComponent>
        </StackComponent>

        <Suspense fallback={<div>Loading statistics cards...</div>}>
          <StatisticsCard data={STATISTICS_DATA} statistics={data} />
        </Suspense>

        {loading ? (
          <div>loading...</div>
        ) : (
          <Suspense fallback={<div>Loading chart data...</div>}>
            <AreaChartSection statistics={data} />
          </Suspense>
        )}

        {tableLoading ? (
          <TableSkeleton />
        ) : (
          <Suspense fallback={<div>Loading table data...</div>}>
            <StatisticsTable
              tableLoading={tableLoading}
              data={tableData}
              filterData={filterData}
              filterValues={filterValues}
              handleResetFilter={(values) => handleResetFilter(values)}
              sendFilterData={(values) => {
                handleFilter(values);
              }}
              referralToken={referralToken}
              setResetFilterButton={setResetFilterButton}
            />
          </Suspense>
        )}

        {data && (
          <Suspense fallback={<div>Loading chart data...</div>}>
            <TopCountriesPieCharts data={data?.pieChartData} />
          </Suspense>
        )}
      </Section>

      {calendarModal && (
        <ModalComponent
          open={calendarModal}
          onClose={() => handleCalendarModal(false)}
          width={"612px"}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
          containerStyleOverrides={{
            maxHeight: "95vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <DateRangeModal setCalendarModal={handleCalendarModal} />
        </ModalComponent>
      )}
    </>
  );
};

export default React.memo(StatisticsUI);
