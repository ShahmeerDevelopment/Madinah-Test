"use client";
import React from "react";
import PropTypes from "prop-types";
import BoxComponent from "../boxComponent/BoxComponent";

const AspectRatioBox = ({ ratio = "56.6%", children, sx }) => {
	return (
		<BoxComponent
			sx={{
				position: "relative",
				width: "100%", // Makes the component fill the width of its parent.
				paddingTop: ratio, // Calculates the top padding to maintain the desired aspect ratio, based on the ratio prop.
			}}
		>
			<BoxComponent
				sx={{
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					...sx, // These styles ensure the child content fills the entire space of the padded parent while maintaining the aspect ratio.
				}}
			>
				{children}
			</BoxComponent>
		</BoxComponent>
	);
};

AspectRatioBox.propTypes = {
	ratio: PropTypes.any,
	children: PropTypes.any,
	sx: PropTypes.any,
};

export default AspectRatioBox;
