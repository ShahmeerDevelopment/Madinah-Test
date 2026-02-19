"use client";

import React from "react";
import PropTypes from "prop-types";

const DropIcon = ({ color = "#6363E6" }) => {
	return (
		<svg
			width="18"
			height="16"
			viewBox="0 0 18 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6 5L5.5 5C3.29086 5 1.5 6.79086 1.5 9L1.5 10.75C1.5 12.9591 3.29086 14.75 5.5 14.75L12.5 14.75C14.7091 14.75 16.5 12.9591 16.5 10.75L16.5 9C16.5 6.79086 14.7091 5 12.5 5L12 5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M6.75 8.75L8.29289 10.2929C8.68342 10.6834 9.31658 10.6834 9.70711 10.2929L11.25 8.75"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M9 10.25L9 1.25"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};
DropIcon.propTypes = {
	color: PropTypes.string,
};
export default DropIcon;
