"use client";

import StackComponent from "@/components/atoms/StackComponent";
import PropTypes from "prop-types";
import React from "react";

const WhiteFlexBackgroundLayout = ({
	direction = "column",
	children,
	...otherProps
}) => {
	return (
		<StackComponent
			sx={{
				background: "#ffffff",
				p: "40px 32px !important",
				borderRadius: "32px",
				boxShadow: "0px 0px 100px 0px #0000000F",
				"@media (max-width: 600px)": {
					px: "16px !important",
				},
			}}
			direction={direction}
			{...otherProps}
		>
			{children}
		</StackComponent>
	);
};

WhiteFlexBackgroundLayout.propTypes = {
	children: PropTypes.any,
	direction: PropTypes.string,
};

export default WhiteFlexBackgroundLayout;
