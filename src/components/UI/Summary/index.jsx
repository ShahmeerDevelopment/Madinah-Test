"use client";

import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";

import { Section } from "./style";
import { useGetFinancialSummary } from "@/api";
import { theme } from "@/config/customTheme";
import { formatNumberWithCommas } from "@/utils/helpers";
import SummaryHeading from "./summaryHeading/SummaryHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CustomTable from "@/components/molecules/customTable/CustomTable";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import OutstandingTable from "@/components/molecules/customTable/OutstandingTable";
import TableSkeleton from "@/components/advance/TableSkeleton";
import { getAllVisits } from "@/api/get-api-services";
import { useSelector } from "react-redux";

const SummaryUI = () => {
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(false);

  // Memoizing the dateHandler function
  const utmParameters = useSelector((state) => state.utmParameters);

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
  const defaultDate = useMemo(() => dayjs(new Date()).format("YYYY-MM-DD"), []);
  const [filterDate, setFilterDate] = useState({
    firstDate: defaultDate,
    endDate: defaultDate,
  });
  const { startDate, endDate } = filterDate;
  const {
    data: financialSummaryData,
    isLoading,
    isError,
    error,
  } = useGetFinancialSummary(startDate, endDate);

  let summaryData = financialSummaryData?.data.data;

  if (isError) return <p>Error: {error.message}</p>;
  // const dateHandler = useCallback(async (value) => {
  // 	setLoading(true);
  // 	try {
  // 		const response = await getFinancialSummary(
  // 			value.startDate,
  // 			value.endDate,
  // 		);
  // 		if (response.data.success && response.data.message === 'Success') {
  // 			setData(response.data.data);
  // 		}
  // 		setLoading(false);
  // 	} catch (error) {
  // 		setLoading(false);
  // 		console.error('error', error);
  // 	}
  // }, []);

  // Default date initialization
  // const defaultDate = useMemo(() => dayjs(new Date()).format('YYYY-MM-DD'), []);

  // useEffect(() => {
  // 	dateHandler({ startDate: defaultDate, endDate: defaultDate });
  // }, [dateHandler, defaultDate]);

  return (
    <Section>
      <SummaryHeading
        setFilterDate={setFilterDate}
        heading={summaryData?.grossFundsRaised}
      />
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <CustomTable data={summaryData} />
          <BoxComponent mt={4}>
            <SubHeading1 sx={{ color: "#606062" }}>
              Outstanding Balance
            </SubHeading1>
            <CampaignHeading
              marginBottom={2}
              sx={{ color: theme.palette.primary.main }}
            >
              USD $
              {formatNumberWithCommas(
                summaryData?.outstandingAmount.toFixed(2),
              )}
            </CampaignHeading>
          </BoxComponent>
          <OutstandingTable data={summaryData} />
        </>
      )}
    </Section>
  );
};

export default React.memo(SummaryUI);
