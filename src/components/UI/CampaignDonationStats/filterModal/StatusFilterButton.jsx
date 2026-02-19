"use client";

import React, { memo } from "react";
import PropTypes from "prop-types";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

export const StatusFilterButton = memo(
	({ color, bgColor, onClickHandler, isActive, text }) => {
		return (
			<BoxComponent
				sx={{
					width: "auto",
					height: "34px",
					padding: "10px 14px",
					color: color,
					background: bgColor,
					fontWeight: 400,
					fontSize: "14px",
					lineHeight: "16px",
					display: "flex",
					alignItems: "center",
					borderRadius: "25px",
					userSelect: "none",
					opacity: isActive ? 1 : 0.4,
				}}
				onClick={onClickHandler}
			>
				{text}
			</BoxComponent>
		);
	},
);
StatusFilterButton.displayName = "StatusFilterButton";

StatusFilterButton.propTypes = {
	color: PropTypes.string,
	bgColor: PropTypes.string,
	onClickHandler: PropTypes.func,
	isActive: PropTypes.bool,
	text: PropTypes.string,
};
