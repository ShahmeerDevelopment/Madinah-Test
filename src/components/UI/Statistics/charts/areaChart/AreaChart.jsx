"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { formatDateRange } from "@/utils/helpers";

// Dynamic import for ApexCharts to reduce initial bundle size
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "400px",
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

const AreaChart = ({
  selectedDate,
  comparePreviousPeriod,
  newValue,
  xAxis,
  previousValue,
  dateRangeType,
  selectedCard,
  previousChartData,
}) => {
  let date;
  date = formatDateRange(selectedDate.startDate, selectedDate.endDate);
  let dollarSign;

  switch (selectedCard.value) {
    case "visitCount":
      dollarSign = "";
      break;
    case "donationCount":
      dollarSign = "";
      break;
    case "totalDonationValue":
      dollarSign = "$";
      break;
    case "averageDonationValue":
      dollarSign = "$";
      break;
    case "donationCountPerVisit":
      dollarSign = "$";
      break;
    case "conversionRate":
      dollarSign = "";
      break;
    default:
      dollarSign = "";
  }

  const chartData = useMemo(
    () => ({
      series: [
        {
          name: `${
            dateRangeType === "preset" ? selectedDate.name : ""
          } ${date}`,
          data: newValue,
        },
        ...(dateRangeType === "preset"
          ? [
              {
                name: `${
                  comparePreviousPeriod === "previous-year"
                    ? "Previous Year"
                    : "Previous Period"
                } ${
                  previousChartData?.length > 0
                    ? formatDateRange(
                        previousChartData[0]?.interval,
                        previousChartData[previousChartData.length - 1]
                          ?.interval
                      )
                    : ""
                }`,
                data: previousValue,
              },
            ]
          : []),
      ],
      options: {
        chart: {
          height: 340,
          type: "area",
          fontFamily: "Inter, Arial, sans-serif",
          toolbar: {
            show: true,
          },
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              xaxis: {
                tickAmount: 5, // Adjusts the number of x-axis ticks for mobile screens
              },
              chart: {
                width: "100%", // Adjust width or other options for smaller screens
              },
              legend: {
                position: "bottom",
                offsetY: -10, // Adjust legend position for better fit
              },
            },
          },
        ],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 1,
        },
        grid: {
          borderColor: "#F8F8F8",
          position: "back",
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        plotOptions: {
          area: {
            borderRadius: 30,
          },
        },
        legend: {
          show: true,
          fontFamily: "League Spartan, Arial",
          offsetY: -10,
          position: "bottom",
          height: 50,
          labels: {
            colors: "#A1A1A8",
          },
          markers: {
            width: 14,
            height: 14,
            radius: 4,
            offsetX: -6,
            offsetY: 0,
          },
          itemMargin: {
            horizontal: 20,
            vertical: 0,
          },
        },
        xaxis: {
          type: "categories",
          categories: xAxis,
          // tickAmount: 5,
          // tickPlacement: 'between',
          axisTicks: {
            show: false,
          },
          tickAmount: 10, // Show only 10 x-axis labels
          labels: {
            rotate: 0, // Rotate the labels to make them vertical
            style: {
              fontSize: "12px", // Ensure appropriate font size
              fontWeight: 400,
              fontFamily: "League Spartan, sans-serif", // Match your chart's font style
              cssClass: "apexcharts-xaxis-label", // Class to control CSS styling if needed
            },
          },
          // scrollbar: {
          // 	enabled: true, // Enable scrollbar if necessary
          // },
        },
        yaxis: {
          labels: {
            formatter: (value) => `${dollarSign} ${value?.toFixed(2)}`, // Limit Y-axis labels to 2 decimal places
          },
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
    }),
    [
      newValue,
      previousValue,
      xAxis,
      selectedDate,
      comparePreviousPeriod,
      previousChartData,
      dateRangeType,
    ] // Updated dependencies
  );

  return (
    <div>
      <div
        id="chart"
        style={{
          borderRadius: "30px",
          overflow: "hidden",
          maskImage: "radial-gradient(circle, white 100%, black 100%)",
        }}
      >
        {typeof window !== "undefined" ? (
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={340}
          />
        ) : null}
      </div>
      {/* <div id="html-dist"></div> */}
    </div>
  );
};

AreaChart.propTypes = {
  selectedDate: PropTypes.any,
  comparePreviousPeriod: PropTypes.any,
  newValue: PropTypes.any,
  xAxis: PropTypes.any,
  previousValue: PropTypes.any,
  dateRangeType: PropTypes.string,
  selectedCard: PropTypes.object,
  previousChartData: PropTypes.array,
};
export default AreaChart;
