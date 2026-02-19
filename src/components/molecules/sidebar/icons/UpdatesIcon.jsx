"use client";

import React from "react";

const UpdatesIcon = () => {
	return (
		<div>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<linearGradient
						id="gradient"
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
					d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56"
					stroke="url(#gradient)"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
};

export default UpdatesIcon;
