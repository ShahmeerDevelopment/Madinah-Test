"use client";

import React from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";

// Lazy load the DoughnutChart component
const DoughnutChart = dynamic(() => import("./DoughnutChart"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "426px",
        height: "127px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <div>Loading chart...</div>
    </div>
  ),
});

const LazyDoughnutChart = (props) => {
  return <DoughnutChart {...props} />;
};

LazyDoughnutChart.propTypes = {
  data: PropTypes.any,
};

export default LazyDoughnutChart;
