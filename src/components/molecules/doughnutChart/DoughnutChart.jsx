"use client";

import React, { useRef, useEffect, useMemo } from "react";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import PropTypes from "prop-types";
import useResponsiveScreen from "../../../hooks/useResponsiveScreen";
import { formatNumberWithCommas } from "@/utils/helpers";

// Register only the components we need
echarts.use([
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	PieChart,
	CanvasRenderer,
]);

const DoughnutChart = (data, sumValue = false) => {
	const chartRef = useRef(null);
	const isMobile = useResponsiveScreen();

	const transformedData = useMemo(
		() =>
			data.data.map((item) => ({
				value: `${item?.value?.toFixed(2)}`,
				name: item.countryName,
			})),
		[data.data]
	);

	useEffect(() => {
		const myChart = echarts.init(chartRef.current);

		const option = {
			title: {
				// text: 'Pie Chart Example',
				// subtext: 'Demo',
				// left: 'right',
			},
			color: ["#6433B5", "#E7E7FF", "#A7A7FD", "#7E7EEA", "#6363E6"],
			textStyle: {
				color: "#A1A1A8",
				fontFamily: "League Spartan",
				fontSize: "14px",
				fontStyle: "normal",
				fontWeight: 400,
			},
			tooltip: {
				trigger: "item",
				formatter: function (params) {
					const value = formatNumberWithCommas(params.value);
					return `<div style="color: #333; font-family: inherit;">
							<div style="margin-bottom: 4px; color: #666; font-size: 12px;">${params.seriesName}</div>
							<div style="display: flex; align-items: center;">
								<span style="display: inline-block; width: 10px; height: 10px; background-color: ${params.color}; border-radius: 50%; margin-right: 8px;"></span>
								<span style="font-weight: 500;">${params.name}: ${sumValue ? "$" : ""}${value}</span>
							</div>
						</div>`;
				}
			},
			legend: {
				top: 0,
				right: "right",
				left: "200px",
				orient: "vertical",
				itemGap: 10,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					color: "#A1A1A8",
				},
			},

			series: [
				{
					top: -26,
					right: 300,
					height: "170px",
					width: "170px",
					name: "Access Source",
					type: "pie",
					radius: ["50%", "70%"],
					avoidLabelOverlap: false,
					padAngle: 5,
					z: 50,
					data: transformedData,
					itemStyle: {
						borderRadius: 50,
					},
					label: {
						show: false,
						position: "center",
					},
					emphasis: {
						label: {
							show: false,
							fontSize: 40,
							fontWeight: "bold",
						},
						scale: true,
						scaleSize: 1,
					},
					labelLine: {
						show: false,
					},
					// emphasis: {
					// 	itemStyle: {
					// 		shadowBlur: 10,
					// 		shadowOffsetX: 0,
					// 		shadowColor: 'rgba(0, 0, 0, 0.5)',
					// 	},
					// },
					// Adding padAngle to create spacing between segments
				},
			],
		};

		myChart.setOption(option);
		return () => {
			myChart.dispose();
		};
	}, [transformedData, sumValue]);

	return (
		<div
			ref={chartRef}
			style={{ width: isMobile ? "100%" : "426px", height: "127px" }}
		/>
	);
};

DoughnutChart.propTypes = {
	data: PropTypes.any,
};
export default DoughnutChart;
