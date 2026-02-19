"use client";


import PropTypes from "prop-types";
import React from "react";
import TypographyComp from "../../atoms/typography/TypographyComp";

const SectionSubheading = ({ children, sx, ...otherProps }) => {
	return (
		<TypographyComp
			component="h3"
			sx={{
				fontWeight: 400,
				fontSize: "16px",
				lineHeight: "20px",
				color: "rgba(9, 9, 9, 1)",
				...sx,
			}}
			{...otherProps}
		>
			{children}
		</TypographyComp>
	);
};

SectionSubheading.propTypes = {
	children: PropTypes.any,
	sx: PropTypes.any,
};

export default SectionSubheading;
