import React from "react";
import PropTypes from "prop-types";

const BackIcon = ({ disabled }) => {
	return (
		<svg
			width="7"
			height="14"
			viewBox="0 0 7 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5.5 1.16699L1.16939 6.21938C0.784196 6.66876 0.784196 7.33189 1.16939 7.78127L5.5 12.8337"
				stroke={disabled ? "#00000042" : "#606062"}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};
BackIcon.propTypes = {
	disabled: PropTypes.bool,
};
export default BackIcon;
