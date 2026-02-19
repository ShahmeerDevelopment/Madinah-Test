/* eslint-disable indent */
"use client";

import PropTypes from "prop-types";
import React from "react";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

const FieldLabel = ({ children }) => {
	return (
		<TypographyComp
			component="span"
			sx={{ color: "#A1A1A8", fontSize: "14px", fontWeight: 500 }}
		>
			{children}
		</TypographyComp>
	);
};

FieldLabel.propTypes = {
	children: PropTypes.any,
};

export default FieldLabel;
