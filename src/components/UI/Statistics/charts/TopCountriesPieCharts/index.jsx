/* eslint-disable indent */
"use client";

import React from "react";
import StackComponent from "@/components/atoms/StackComponent";
import PieChartCard from "./PieChartCard";
// import PieChartComponent from '../../../../components/advance/PieChartComponent';
// import useData from './hooks/useData';
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import DoughnutChart from "@/components/molecules/doughnutChart/LazyDoughnutChart";
import PropTypes from "prop-types";

const TopCountriesPieCharts = ({ data }) => {
  // const charts = useData();
  const { isSmallerThan } = useResponsiveScreen();
  const isSmallerThan1000 = isSmallerThan("1000");

  return (
    <StackComponent
      direction={isSmallerThan1000 ? "column" : "row"}
      spacing={1}
      sx={{ "& > *": { width: "100%" } }}
    >
      {/* {charts.map((eachChart) => ( */}
      <PieChartCard
        sx={{
          width: { xs: "100%", sm: "460px" },
          height: "196px",
        }}
        heading="Top countries by number of donations"
      >
        <DoughnutChart data={data?.topCountriesByNumberOfDonations} />
      </PieChartCard>
      <PieChartCard
        sx={{ width: { xs: "100%", sm: "460px" }, height: "196px" }}
        heading="Top countries by sum from donations"
      >
        {/* <PieChartComponent data={eachChart.data} /> */}

        <DoughnutChart sumValue data={data?.topCountriesByDonationValue} />
      </PieChartCard>
      {/* ))} */}
    </StackComponent>
  );
};

TopCountriesPieCharts.propTypes = {
  data: PropTypes.any,
};
export default TopCountriesPieCharts;
