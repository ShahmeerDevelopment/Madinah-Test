"use client";

import PropTypes from "prop-types";
import Slider from "@mui/material/Slider";
import React from "react";

const RangeSliderComponent = ({
	showBall = true,
	sx,
	campaignView = false,
	...otherProps
}) => {
	return (
		<Slider
			sx={{
				"& .MuiSlider-thumb": {
					display: showBall ? "block" : "none",
				},
				"& .MuiSlider-thumb:not(.MuiSlider-active)": {
					transition: "left 1s ease-in",
				},

				"& .MuiSlider-track": {
					transition: campaignView ? "none" : "width 1s ease-in",
				},
				...sx,
			}}
			aria-label="Temperature"
			color="primary"
			{...otherProps}
		/>
	);
};

RangeSliderComponent.propTypes = {
	showBall: PropTypes.any,
	sx: PropTypes.any,
	campaignView: PropTypes.bool
};

export default RangeSliderComponent;
