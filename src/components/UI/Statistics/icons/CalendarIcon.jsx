"use client";

import React from "react";
import PropTypes from "prop-types";

const CalendarIcon = ({ color = "#A1A1A8" }) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				x="3"
				y="3.5"
				width="18"
				height="18"
				rx="5"
				stroke={color}
				strokeWidth="1.5"
			/>
			<path
				d="M3 8.5H21"
				stroke={color}
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
			<path
				d="M16.5 2L16.5 5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7.5 2L7.5 5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.5 12.5H7.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M11.5 12.5H12.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M16.5 12.5H17.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.5 16.5H7.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M11.5 16.5H12.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M16.5 16.5H17.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
CalendarIcon.propTypes = {
	color: PropTypes.string,
};
export default CalendarIcon;
