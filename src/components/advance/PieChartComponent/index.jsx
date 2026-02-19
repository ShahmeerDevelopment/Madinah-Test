/* eslint-disable semi */
/* eslint-disable indent */
"use client";


import PropTypes from "prop-types";
import React from "react";
import dynamic from "next/dynamic";
// Dynamic import for ApexCharts to reduce initial bundle size
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "350px",
        background: "#f5f5f5",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading chart...
    </div>
  ),
});

const DEFAULT_DATA = [
  {
    label: "United Arab Emirates",
    value: 1234,
    color: "#6433B5",
  },
  {
    label: "United Kingdom",
    value: 1234,
    color: "#6363E6",
  },
  {
    label: "USA",
    value: 1234,
    color: "#7E7EEA",
  },
  {
    label: "China",
    value: 1234,
    color: "#A7A7FD",
  },
  {
    label: "Japan",
    value: 1234,
    color: "#E7E7FF",
  },
];

const PieChartComponent = ({ data = DEFAULT_DATA, showLabels = false }) => {
  const buildArr = (identifier) => {
    return data.map((eachEl) => eachEl[identifier]);
  };
  const series = buildArr("value");
  var options = {
    chart: {
      type: "donut",
    },
    labels: buildArr("label"),
    colors: buildArr("color"),
    dataLabels: {
      enabled: showLabels,
    },
    plotOptions: {
      pie: {
        size: 112,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="pie-chart-reusable" style={{ width: "100%" }}>
      {" "}
      {typeof window !== "undefined" ? (
        <Chart
          options={options}
          series={series}
          type="donut"
          width="100%"
          height="112px"
        />
      ) : null}
    </div>
  );
};

PieChartComponent.propTypes = {
  data: PropTypes.shape({
    map: PropTypes.func,
  }),
  showLabels: PropTypes.bool,
};

export default PieChartComponent;
