"use client";

import TypographyComp from "@/components/atoms/typography/TypographyComp";
import PropTypes from "prop-types";
import React from "react";

// Next
const SectionSubheading = ({ children, ...otherProps }) => {
	return (
		<TypographyComp
			sx={{
				fontWeight: 400,
				fontSize: "16px",
				lineHeight: "20px",
				letterSpacing: "-0.41px",
				color: "rgba(9, 9, 9, 1)",
			}}
			{...otherProps}
		>
			{children}
		</TypographyComp>
	);
};

SectionSubheading.propTypes = {
	children: PropTypes.any,
};

export default SectionSubheading;
