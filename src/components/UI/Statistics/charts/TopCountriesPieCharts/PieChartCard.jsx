/* eslint-disable indent */
"use client";

import PropTypes from "prop-types";
import React from "react";
import StackComponent from "../../../../../components/atoms/StackComponent";
import TypographyComp from "../../../../../components/atoms/typography/TypographyComp";
import BoxComponent from "../../../../../components/atoms/boxComponent/BoxComponent";

const PieChartCard = ({ children, heading = "", sx }) => {
	return (
		<StackComponent
			spacing={{ xs: 1, sm: 3 }}
			direction="column"
			alignItems="flex-start"
			sx={{
				background: "#ffffff",
				borderRadius: "24px",
				boxShadow: "0px 4px 15px 0px rgba(0,0,0,0.06)",
				p: { xs: "16px", sm: "16px 16px 16px 18px" },
				...sx,
			}}
		>
			<TypographyComp
				sx={{
					color: "#090909",
					fontWeight: 500,
					fontSize: { xs: "20px", sm: "22px" },
					lineHeight: { xs: "24px", sm: "28px" },
					letterSpacing: "-0.41px",
				}}
			>
				{heading}
			</TypographyComp>
			<BoxComponent sx={{ width: "100%" }}>{children}</BoxComponent>
		</StackComponent>
	);
};

PieChartCard.propTypes = {
	children: PropTypes.any,
	heading: PropTypes.string,
	sx: PropTypes.any,
};

export default PieChartCard;
