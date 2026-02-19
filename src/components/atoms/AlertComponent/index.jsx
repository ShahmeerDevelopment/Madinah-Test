"use client";

import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import React from "react";

const AlertComponent = ({
	variant = "outlined",
	severity = "success",
	children,
	...otherProps
}) => {
	return (
		<Alert variant={variant} severity={severity} {...otherProps}>
			{children}
		</Alert>
	);
};

AlertComponent.propTypes = {
	children: PropTypes.any,
	severity: PropTypes.string,
	variant: PropTypes.string,
};

export default AlertComponent;
