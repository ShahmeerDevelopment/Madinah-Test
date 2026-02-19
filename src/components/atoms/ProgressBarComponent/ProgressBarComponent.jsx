"use client";

import React from "react";
import PropTypes from "prop-types";
import { BorderLinearProgress } from "./loader.style";

// Next
const ProgressBarComponent = ({ currentValue = 10, totalValue = 100 }) => {
	const percentage = (currentValue / totalValue) * 100;

	const totalPercentage =
		percentage === 0 ? 1.5 : percentage > 100 ? 100 : percentage;

	return (
		<div>
			<BorderLinearProgress variant="determinate" value={totalPercentage} />
		</div>
	);
};
ProgressBarComponent.propTypes = {
	currentValue: PropTypes.any,
	totalValue: PropTypes.any,
};

export default ProgressBarComponent;
