"use client";

import React from "react";
import PropTypes from "prop-types";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

// Next
const SubHeading = ({ children, align = "left", sx }) => {
	return (
		<TypographyComp
			align={align}
			sx={{
				fontSize: "22px",
				fontWeight: 500,
				lineHeight: { xs: "22px", sm: "28px" },
				color: "rgba(96, 96, 98, 1)",
				...sx,
			}}
		>
			{children}
		</TypographyComp>
	);
};

SubHeading.propTypes = {
	children: PropTypes.node.isRequired,
	sx: PropTypes.object,
	align: PropTypes.string,
};

export default SubHeading;
