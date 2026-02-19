"use client";

import PropTypes from "prop-types";
import React from "react";

const ArrowRight = ({ disabled = false }) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9 19L14.3306 12.7809C14.7158 12.3316 14.7158 11.6684 14.3306 11.2191L9 5"
				stroke={disabled ? "#C1C1F5" : "#6363E6"}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};

ArrowRight.propTypes = {
	disabled: PropTypes.any,
};

export default ArrowRight;
