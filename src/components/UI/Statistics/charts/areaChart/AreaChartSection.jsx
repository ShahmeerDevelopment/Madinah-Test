"use client";

import React, { memo } from "react";
import PropTypes from "prop-types";

import StackComponent from "@/components/atoms/StackComponent";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
// import { formatToPreciseTime } from '../../../../utils/helpers';
import { useSelector } from "react-redux";
import { formatDateRange } from "@/utils/helpers";
import dynamic from "next/dynamic";
// import SortingMenu from '../../../../components/molecules/sortingMeanu/SortingMenu';

// const menuItems = [
// 	{ _id: 1, label: 'By day' },
// 	{ _id: 2, label: 'By week' },
// ];

const AreaChartSection = memo(({ statistics }) => {
  const AreaChart = dynamic(() => import("./AreaChart"), { ssr: false });
  // const [selectedLabel, setSelectedLabel] = useState({
  // 	_id: 1,
  // 	label: 'By day',
  // });

  // const handleSortingChange = useCallback((_id, label) => {
  // 	setSelectedLabel({ _id, label });
  // }, []);

  // const previousStats = statistics?.previousStats || [];

  // const selectedDate = useSelector((state) => state.statistics.presetsDate);
  const currentDate = useSelector((state) => state.statistics.currentDate);
  const dateRangeType = useSelector((state) => state.statistics.dateRangeType);
  const selectedCard = useSelector((state) => state.statistics.selectedCard);
  const comparePreviousPeriod = useSelector(
    (state) => state.statistics.comparePreviousPeriod
  );

  const chartDataX = statistics?.chartData || [];
  const previousStats = statistics?.previousChartData || [];
  let chartValues = [];
  let chartPreviousValue = [];
  let intervals = chartDataX.map((item) => item.interval);

  if (selectedCard.value === "visitCount") {
    chartValues = chartDataX.map((entry) => entry.visits);
  }

  if (selectedCard.value === "visitCount") {
    chartPreviousValue = previousStats.map((entry) => entry.visits);
  }

  if (selectedCard.value === "donationCount") {
    chartValues = chartDataX.map((entry) => entry.donations);
  }

  if (selectedCard.value === "donationCount") {
    chartPreviousValue = previousStats.map((entry) => entry.donations);
  }
  if (selectedCard.value === "totalDonationValue") {
    chartValues = chartDataX.map((entry) => entry.donationsSum);
  }

  if (selectedCard.value === "totalDonationValue") {
    chartPreviousValue = previousStats.map((entry) => entry.donationsSum);
  }
  if (selectedCard.value === "averageDonationValue") {
    chartValues = chartDataX.map((entry) =>
      entry.visits === 0 ? 0 : entry.avgDonation
    );
  }

  if (selectedCard.value === "averageDonationValue") {
    chartPreviousValue = previousStats.map((entry) =>
      entry.visits === 0 ? 0 : entry.avgDonation
    );
  }

  if (selectedCard.value === "donationCountPerVisit") {
    chartValues = chartDataX.map((entry) =>
      entry.visits === 0 ? 0 : entry.donationsSum / entry.visits
    );
  }

  if (selectedCard.value === "donationCountPerVisit") {
    chartPreviousValue = previousStats.map((entry) =>
      entry.visits === 0 ? 0 : entry.donationsSum / entry.visits
    );
  }

  if (selectedCard.value === "conversionRate") {
    chartValues = chartDataX.map((entry) =>
      entry.visits === 0 ? 0 : entry.donations / entry.visits
    );
  }

  if (selectedCard.value === "conversionRate") {
    chartPreviousValue = previousStats.map((entry) =>
      entry.visits === 0 ? 0 : entry.donations / entry.visits
    );
  }

  if (
    currentDate.value === "today" ||
    currentDate.value === "yesterday" ||
    currentDate.startDate === currentDate.endDate
  ) {
    intervals = intervals.map((interval) => {
      // Extract time directly from interval string
      const date = new Date(interval);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    });
  } else {
    intervals = intervals.map((interval) => {
      // Extract date parts directly from interval string
      const datePart = interval?.split("T")[0];
      const [year, month, day] = datePart.split("-");
      const monthName = new Date(year, month - 1, 1).toLocaleString("default", {
        month: "short",
      });
      return `${day}-${monthName}`;
    });
  }

  const getChartHeading = () => {
    switch (selectedCard.value) {
      case "visitCount":
        return "Total Visits";
      case "donationCount":
        return "Donations";
      case "totalDonationValue":
        return "Total Donations";
      case "averageDonationValue":
        return "Average Donations";
      case "donationCountPerVisit":
        return "Donations per Visit";
      case "conversionRate":
        return "Coversion Rate";
      default:
        return "Chart";
    }
  };

  const date = formatDateRange(currentDate?.startDate, currentDate?.endDate);

  return (
    <BoxComponent
      sx={{
        height: { xs: "100%", sm: "391px" },
        padding: { xs: "16px 0px 4px 0px", sm: "16px 16px 16px 18px" },
        borderRadius: "24px",

        boxShadow: "0px 0px 100px 0px rgba(0, 0, 0, 0.06)",
      }}
    >
      <StackComponent justifyContent={"space-between"} alignItems="center">
        <SubHeading
          sx={{ pr: { xs: "8px", sm: "0px" }, pl: { xs: "8px", sm: "0px" } }}
        >{`${getChartHeading(selectedCard)} on ${date} `}</SubHeading>

        {/* <SortingMenu
					data={menuItems}
					selectedLabel={selectedLabel}
					onSortingChange={handleSortingChange}
					isIcon={false}
					width={'95px'}
					height="26px"
					padding="5px 8px 5px 8px"
				/> */}
      </StackComponent>
      {typeof window !== "undefined" ? (
        <AreaChart
          selectedDate={currentDate}
          comparePreviousPeriod={comparePreviousPeriod}
          newValue={chartValues}
          xAxis={intervals}
          previousValue={chartPreviousValue}
          dateRangeType={dateRangeType}
          selectedCard={selectedCard}
          previousChartData={previousStats}
        />
      ) : null}
    </BoxComponent>
  );
});

AreaChartSection.propTypes = {
  statistics: PropTypes.any,
};
AreaChartSection.displayName = "AreaChartSection";
export default AreaChartSection;
