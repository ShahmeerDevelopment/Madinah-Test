"use client";

import TypographyComp from "@/components/atoms/typography/TypographyComp";
import PropTypes from "prop-types";
import React from "react";

// Next
const SectionHeading = ({ children, sx, ...otherProps }) => {
	return (
		<TypographyComp
			sx={{
				fontWeight: 500,
				fontSize: "32px",
				lineHeight: "38px",
				letterSpacing: "-0.41px",
				userSelect: "none",
				...sx,
			}}
			{...otherProps}
		>
			{children}
		</TypographyComp>
	);
};

SectionHeading.propTypes = {
	children: PropTypes.any,
	sx: PropTypes.any,
};

export default SectionHeading;
