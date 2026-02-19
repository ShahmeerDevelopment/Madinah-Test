"use client";


import PropTypes from "prop-types";
import React from "react";
import TypographyComp from "../../atoms/typography/TypographyComp";

const SectionHeading = ({ children, sx, ...otherProps }) => {
	return (
		<TypographyComp
			component="h2"
			sx={{
				fontWeight: 500,
				fontSize: "32px",
				lineHeight: "38px",
				color: "rgba(9, 9, 9, 1)",

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
