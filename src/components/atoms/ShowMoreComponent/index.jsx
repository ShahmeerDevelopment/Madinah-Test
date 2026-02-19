"use client";

import PropTypes from "prop-types";
import React from "react";
import ShowMoreText from "react-show-more-text";
import { styled } from "@mui/material/styles";

const StyledShowMoreComponent = styled(ShowMoreText)(
	({ descriptionLength }) => ({
		"& *": {
			color: "rgba(161, 161, 168, 1)",
		},
		lineHeight: 1.5,

		"& .show-more-less-clickable": {
			//styleName: Body/FontQuote Medium;
			fontFamily: "League Spartan",
			fontSize: "14px",
			fontWeight: "500",
			lineHeight: "16px",
			textAlign: "center",
			color: "rgba(99, 99, 230, 1)",
			cursor: "pointer",
		},
		"& p": {
			wordBreak: descriptionLength > 100 ? "break-all" : "normal",
		},
	}),
);

const ShowMoreComponent = ({
	lines = 3,
	children,
	descriptionLength,
	...otherProps
}) => {
	return (
		<StyledShowMoreComponent
			lines={lines}
			more="Show more"
			less="Hide"
			// className="content-css"
			truncatedEndingComponent={"... "}
			descriptionLength={descriptionLength}
			{...otherProps}
		>
			{children}
		</StyledShowMoreComponent>
	);
};

ShowMoreComponent.propTypes = {
	children: PropTypes.any,
	lines: PropTypes.number,
	descriptionLength: PropTypes.any,
};

export default ShowMoreComponent;
