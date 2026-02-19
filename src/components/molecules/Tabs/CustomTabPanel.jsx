"use client";

import React from "react";
import PropTypes from "prop-types";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";

const CustomTabPanel = (props) => {
	const { children, value, index, ...other } = props;
	return (
		<div>
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<BoxComponent sx={{ pt: 4 }}>{children}</BoxComponent>
				)}
			</div>
		</div>
	);
};

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};
export default CustomTabPanel;
