"use client";

import React, { memo } from "react";
import PropTypes from "prop-types";

import { theme } from "@/config/customTheme";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const PrivacyButton = memo(({ isActive, onClickHandler, text }) => {
	return (
		<BoxComponent
			sx={{
				width: "auto",
				height: "40px",
				padding: "0px 24px",
				color: isActive ? "#ffffff" : theme.palette.primary.darkGray,
				background: isActive ? theme.palette.primary.main : "#ffffff",
				fontWeight: 400,
				fontSize: "16px",
				lineHeight: "20px",
				boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)",
				display: "flex",
				alignItems: "center",
				borderRadius: "32px",
				userSelect: "none",
			}}
			onClick={onClickHandler}
		>
			{text}
		</BoxComponent>
	);
});

PrivacyButton.propTypes = {
	isActive: PropTypes.bool,
	onClickHandler: PropTypes.func,
	text: PropTypes.string,
};
PrivacyButton.displayName = "PrivacyButton";
export default PrivacyButton;
