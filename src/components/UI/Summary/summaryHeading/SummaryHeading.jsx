"use client";

import React, { useEffect } from "react";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CalenderComp from "./CalenderComp";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import { theme } from "@/config/customTheme";
import { formatNumberWithCommas } from "@/utils/helpers";
import { format, startOfMonth } from "date-fns";
import PropTypes from "prop-types";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const SummaryHeading = ({ heading, setFilterDate }) => {
  const { isSmallScreen } = useResponsiveScreen();
  useEffect(() => {
    const today = new Date();
    const startOfYearDate = startOfMonth(today);
    const formattedStartDate = format(startOfYearDate, "yyyy-MM-dd");
    const formattedEndDate = format(today, "yyyy-MM-dd");

    // Set default date values
    setFilterDate({ startDate: formattedStartDate, endDate: formattedEndDate });
  }, []);

  const handleDateChange = (newDates) => {
    const startDate = format(new Date(newDates.startDate), "yyyy-MM-dd");
    const endDate = format(new Date(newDates.endDate), "yyyy-MM-dd");
    // dateHandler({ startDate: startDate, endDate: endDate });
    setFilterDate({ startDate, endDate });
  };

  return (
    <>
      <BoxComponent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          height: "38px",
        }}
      >
        <CampaignHeading sx={{ color: "#090909" }}>
          Financial Summary
        </CampaignHeading>
        <CalenderComp
          onDateChange={handleDateChange}
          isFinancialSummary={true}
        />
      </BoxComponent>
      <BoxComponent mt={isSmallScreen ? 8 : 3}>
        <SubHeading1 sx={{ color: "#606062", mb: 0.5 }}>
          Gross Funds Raised
        </SubHeading1>
        <CampaignHeading
          marginBottom={2}
          sx={{ color: theme.palette.primary.main }}
        >
          USD ${formatNumberWithCommas(heading?.toFixed(2))}
        </CampaignHeading>
      </BoxComponent>
    </>
  );
};
SummaryHeading.propTypes = {
  setFilterDate: PropTypes.func,
  heading: PropTypes.any,
};
export default SummaryHeading;
