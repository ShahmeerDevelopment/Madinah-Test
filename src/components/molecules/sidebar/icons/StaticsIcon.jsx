"use client";

import React, { useId } from "react";

const StaticsIcon = () => {
	const gradientId = useId(); // Generates a unique ID

	return (
		<svg
			width="24px"
			height="24px"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<linearGradient
					id={`linearGradient-${gradientId}`}
					x1="2"
					y1="12"
					x2="22"
					y2="12"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#6363E6" />
					<stop offset="1" stopColor="#59C9F9" />
				</linearGradient>
			</defs>
			<path
				d="M2 22H22"
				stroke={`url(#linearGradient-${gradientId})`}
				strokeWidth="1.5"
			/>
			<path
				d="M9.75 4V22H14.25V4C14.25 2.9 13.8 2 12.45 2H11.55C10.2 2 9.75 2.9 9.75 4Z"
				stroke={`url(#linearGradient-${gradientId})`}
				strokeWidth="1.5"
			/>
			<path
				d="M3 10V22H7V10C7 8.9 6.6 8 5.4 8H4.6C3.4 8 3 8.9 3 10Z"
				stroke={`url(#linearGradient-${gradientId})`}
				strokeWidth="1.5"
			/>
			<path
				d="M17 15V22H21V15C21 13.9 20.6 13 19.4 13H18.6C17.4 13 17 13.9 17 15Z"
				stroke={`url(#linearGradient-${gradientId})`}
				strokeWidth="1.5"
			/>
		</svg>
	);
};

export default StaticsIcon;
