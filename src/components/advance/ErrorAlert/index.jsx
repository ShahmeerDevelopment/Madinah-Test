"use client";


import AlertComponent from "@/components/atoms/AlertComponent";
import PropTypes from "prop-types";
import React from "react";

const ErrorAlert = ({ children, ...otherProps }) => {
	return (
		<AlertComponent severity="error" {...otherProps}>
			{children}
		</AlertComponent>
	);
};

ErrorAlert.propTypes = {
	children: PropTypes.any,
};

export default ErrorAlert;
