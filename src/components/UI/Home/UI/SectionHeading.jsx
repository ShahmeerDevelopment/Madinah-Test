"use client";

import TypographyComp from "@/components/atoms/typography/TypographyComp";
import PropTypes from "prop-types";
import React from "react";

const SectionHeading = ({ children }) => {
	return (
		<TypographyComp
			sx={{
				fontWeight: 500,
				fontSize: "32px",
				lineHeight: "38px",
				letterSpacing: "-0.41px",
				color: "#090909",
				userSelect: "none",
			}}
		>
			{children}
		</TypographyComp>
	);
};

SectionHeading.propTypes = {
	children: PropTypes.any,
};

export default SectionHeading;
