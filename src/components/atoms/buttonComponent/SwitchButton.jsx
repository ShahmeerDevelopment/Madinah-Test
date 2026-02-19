"use client";

import React from "react";
import PropTypes from "prop-types";
import Switch from "@mui/material/Switch";

// Next
const SwitchButton = ({
	checked,
	onChange,
	name,
	color = "primary",
	...otherProps
}) => {
	return (
		<Switch
			checked={checked}
			onChange={onChange}
			name={name}
			color={color}
			{...otherProps}
		/>
	);
};

SwitchButton.propTypes = {
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string,
	color: PropTypes.oneOf([
		"default",
		"primary",
		"secondary",
		"error",
		"info",
		"success",
		"warning",
	]),
	// Include any other prop types you might need
};

export default SwitchButton;
