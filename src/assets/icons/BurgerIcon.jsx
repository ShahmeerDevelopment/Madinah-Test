import PropTypes from "prop-types";
import React from "react";

const BurgerIcon = ({ color = "#6363E6" }) => {
	return (
		<svg
			width="14"
			height="12"
			viewBox="0 0 14 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M13 1.5L1 1.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M13 6L1 6"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M13 10.5L1 10.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};

BurgerIcon.propTypes = {
	color: PropTypes.string,
};

export default BurgerIcon;
