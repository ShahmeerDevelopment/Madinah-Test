"use client";


import React from "react";
import PropTypes from "prop-types";
import IconButtonComp from "@/components/atoms/buttonComponent/IconButtonComp";

// Next
const OutlinedIconButton = ({
	borderColor = "rgba(193, 193, 245, 1)",
	sx,
	width = "48px",
	height = "34px",
	children,
	disabled,
	...props
}) => {
	const btnProps = {
		sx: {
			width: width,
			height: height,
			borderRadius: "25px",
			border: `1px solid ${borderColor}`,
			...sx,
		},
		...props,
	};
	return (
		<IconButtonComp disabled={disabled} {...btnProps}>
			{children}
		</IconButtonComp>
	);
};

OutlinedIconButton.propTypes = {
	borderColor: PropTypes.string,
	children: PropTypes.any,
	height: PropTypes.string,
	sx: PropTypes.any,
	width: PropTypes.string,
	disabled: PropTypes.bool,
};

export default OutlinedIconButton;
