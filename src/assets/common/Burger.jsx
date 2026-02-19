import PropTypes from "prop-types";
import React from "react";

const Burger = ({ color }) => {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M15 4.5L3 4.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M15 9L3 9"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M15 13.5L3 13.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};

Burger.propTypes = {
	color: PropTypes.any,
};

export default Burger;
