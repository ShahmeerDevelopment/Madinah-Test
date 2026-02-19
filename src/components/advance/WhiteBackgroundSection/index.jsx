"use client";

import StackComponent from "@/components/atoms/StackComponent";
import PropTypes from "prop-types";
import React from "react";

const WhiteBackgroundSection = ({ sx, children, ...otherProps }) => {
	return (
		<StackComponent
			sx={{
				background: "#ffffff",
				p: { xs: "16px 16px 32px 16px", sm: "32px 32px 40px 32px" },
				borderRadius: "32px",
				// height: '120vh',
				// boxShadow: '0px 0px 100px 0px rgba(0, 0, 0, 0.06)',
				...sx,
			}}
			component="section"
			{...otherProps}
		>
			{children}
		</StackComponent>
	);
};

WhiteBackgroundSection.propTypes = {
	children: PropTypes.any,
	sx: PropTypes.any,
};

export default WhiteBackgroundSection;
